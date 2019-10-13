import React, { Component, Fragment } from 'react';
import {
  _get,
  _last,
  randomDigitStringId,
  getJSONFromLocalStorage,
} from '../../utilsCommon';

import {
  isWebImage,
  getImageDimensions,
  playNotificationSound,
  unlockNotificationSoundAutoplay,
} from '../../utilsWidget';

import { IMessage } from '../../sdk/serializers/serializeMessage';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';
import {
  JOIN_ROOM_SUCCESS,
  MESSAGES_NEW,
  MESSAGES_FETCH_HISTORY_SUCCESS,
  OPERATOR_ONLINE_STATUS_CHANGE,
  TYPING_STATUS_SUBSCRIBE_SUCCESS
} from '../../sdk/ElixirChatEventTypes';

import {
  WIDGET_IFRAME_READY,
  SCREENSHOT_REQUEST_SUCCESS,
} from '../ElixirChatWidgetEventTypes';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  messages: Array<IMessage>;
  room: any;
  client: any;
  textareaText: string;
  textareaResponseToMessageId: string | null;
  textareaAttachments: Array<{ id: string, file: File, name: string, isScreenshot: boolean }>;
  isLoadingPreviousMessages: boolean;
  isDraggingAttachments: boolean;
  widgetTitle: string;
  areAnyOperatorsOnline: boolean;
  areNotificationsMuted: boolean;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  container: { current: HTMLElement } = React.createRef();
  scrollBlock: { current: HTMLElement } = React.createRef();
  messageChunkSize: number = 20;

  state = {
    messages: [],
    room: {},
    client: {},
    textareaText: '',
    textareaResponseToMessageId: null,
    textareaAttachments: [],
    isLoadingPreviousMessages: false,
    isDraggingAttachments: false,
    widgetTitle: '',
    areAnyOperatorsOnline: false,
    areNotificationsMuted: false,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('dragover', this.onBodyDrag);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('drop', this.onBodyDrop);
    });

    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      this.setState({ widgetTitle: elixirChatWidget.widgetTitle });
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize);
    });

    elixirChatWidget.on(MESSAGES_FETCH_HISTORY_SUCCESS, this.scrollToBottom);
    elixirChatWidget.on(MESSAGES_NEW, this.onNewMessage);

    elixirChatWidget.on(TYPING_STATUS_SUBSCRIBE_SUCCESS, () => {
      const textareaText = localStorage.getItem('elixirchat-typed-text') || '';
      elixirChatWidget.dispatchTypedText(textareaText);
      this.setState({ textareaText });
    });

    elixirChatWidget.on(OPERATOR_ONLINE_STATUS_CHANGE, areAnyOperatorsOnline => {
      this.setState({ areAnyOperatorsOnline });
    });

    elixirChatWidget.on(SCREENSHOT_REQUEST_SUCCESS, this.onScreenshotRequestFulfilled);

    const areNotificationsMuted = getJSONFromLocalStorage('elixirchat-notifications-muted', false);
    this.setState({ areNotificationsMuted });
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('dragover', this.onBodyDrag);
    elixirChatWidget.widgetIFrameDocument.body.removeEventListener('drop', this.onBodyDrop);
  }

  onBodyDrag = (e) => {
    e.preventDefault();
    this.setState({ isDraggingAttachments: true });
  };

  onBodyDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let textareaAttachments = [ ...this.state.textareaAttachments ];
    let attachmentFiles;
    if (e.dataTransfer.items) {
      attachmentFiles = Array.from(e.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile());
    }
    else {
      attachmentFiles = Array.from(e.dataTransfer.files);
    }

    for (let i = 0; i < attachmentFiles.length; i++) {
      const file = attachmentFiles[i];
      const imageBlobUrl = URL.createObjectURL(attachmentFiles[i]);
      const dimensions = await getImageDimensions(imageBlobUrl);
      textareaAttachments.push({
        id: randomDigitStringId(6),
        name: file.name,
        file,
        ...dimensions,
      });
    }
    this.setState({ textareaAttachments, isDraggingAttachments: false });
  };

  onNewMessage = (message) => {
    const hasUserScroll = this.hasUserScroll();
    const isMessageSentByCurrentClient = message.sender.isCurrentClient;

    if (isMessageSentByCurrentClient) {
      this.replaceTemporaryMessageWithActualOne(message);
    }
    else {
      const messages = [...this.state.messages, message];
      this.setState({ messages });
      if (!this.state.areNotificationsMuted) {
        playNotificationSound();
      }
    }
    if (!hasUserScroll) {
      this.scrollToBottom();
    }
  };

  loadPreviousMessages = (callback): void => {
    const { messages, isLoadingPreviousMessages } = this.state;
    const { elixirChatWidget } = this.props;

    if (!isLoadingPreviousMessages && !elixirChatWidget.reachedBeginningOfMessageHistory) {
      this.setState({ isLoadingPreviousMessages: true });
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize, messages[0].cursor).then(history => {
        const updatedMessages = [...history, ...messages];
        this.setState({
          messages: updatedMessages,
          isLoadingPreviousMessages: false,
        }, callback);
      });
    }
  };

  onMessagesScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    if (scrollBlock.scrollTop <= 0) {
      const initialScrollHeight = scrollBlock.scrollHeight;
      this.loadPreviousMessages(() => {
        setTimeout(() => {
          scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
        }, 0);
      });
    }
  };

  hasUserScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    return scrollBlock.scrollTop !== scrollBlock.scrollHeight - scrollBlock.offsetHeight;
  };

  scrollToBottom = (): void => {
    this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
  };

  onTextareaVerticalResize = (newTextareaHeight: number, options: { forceScrollToBottom: boolean } = {}) => {
    const hasUserScroll = this.hasUserScroll();
    this.scrollBlock.current.style.bottom = newTextareaHeight + 'px';

    if (!hasUserScroll || options.forceScrollToBottom) {
      this.scrollToBottom();
    }
  };

  onMessageSubmit = async () => {
    const { elixirChatWidget } = this.props;
    const {
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
      messages,
    } = this.state;

    if (textareaText.trim() || textareaAttachments.length) {
      const hasUserScroll = this.hasUserScroll();
      const temporaryMessage = this.generateTemporaryMessage({
        textareaText,
        textareaResponseToMessageId,
        textareaAttachments,
      });
      await this.setState({
        messages: [...messages, temporaryMessage],
      });
      if (!hasUserScroll) {
        this.scrollToBottom();
      }
      elixirChatWidget.sendMessage({
        text: textareaText,
        responseToMessageId: textareaResponseToMessageId,
        attachments: textareaAttachments.map(attachment => attachment.file),
        tempId: temporaryMessage.tempId,
      })
        .catch(() => {
          this.changeMessageById(temporaryMessage.id, {
            isSubmitting: false,
            isSubmissionError: true,
          });
          elixirChatWidget.dispatchTypedText(false);
        });

      localStorage.removeItem('elixirchat-typed-text');
    }
  };

  changeMessageById = (messageId, data) => {
    const { messages } = this.state;
    const changedMessages = messages.map(message => {
      if (message.id === messageId) {
        const changedMessage = { ...message };
        for (let key in data) {
          changedMessage[key] = data[key];
        }
        return changedMessage;
      }
      else {
        return { ...message };
      }
    });
    this.setState({ messages: changedMessages });
  };

  replaceTemporaryMessageWithActualOne = (newMessage) => {
    const { messages } = this.state;
    const temporaryMessage = _last(messages.filter(message => {
      return message.tempId === newMessage.tempId;
    }));
    if (temporaryMessage) {
      this.changeMessageById(temporaryMessage.id, newMessage);
    }
    else {
      this.setState({
        messages: [...this.state.messages, newMessage]
      });
    }
  };

  generateTemporaryMessage = ({ textareaText, textareaResponseToMessageId, textareaAttachments }) => {
    const { messages } = this.state;
    const responseToMessage = messages.filter(message => {
      return message.id === textareaResponseToMessageId;
    })[0];

    const attachments = textareaAttachments.map(attachment => {
      const id = randomDigitStringId(6);
      const originalFileObject = attachment.file;
      const contentType = originalFileObject.type;
      const url = URL.createObjectURL(originalFileObject);
      let thumbnails = [];
      if (isWebImage(contentType) && attachment.width && attachment.height) {
        thumbnails = [{ id, url }];
      }
      return {
        id,
        url,
        originalFileObject,
        contentType,
        thumbnails,
        name: attachment.name,
        width: attachment.width,
        height: attachment.height,
        bytesSize: originalFileObject.size,
      };
    });

    return  {
      id: randomDigitStringId(6),
      tempId: randomDigitStringId(6),
      text: textareaText.trim() || '',
      timestamp: new Date().toISOString(),
      sender: {
        isOperator: false,
        isCurrentClient: true,
      },
      responseToMessage: responseToMessage || null,
      attachments: attachments,
      isSubmitting: true,
    };
  };

  onTextareaChange = (stateChange) => {
    if (this.state.textareaText !== stateChange.textareaText) {
      localStorage.setItem('elixirchat-typed-text', stateChange.textareaText);
    }
    this.setState(stateChange);
  };

  onScreenshotRequestFulfilled = async (screenshot) => {
    const { textareaText, textareaAttachments } = this.state;
    const imageBlobUrl = URL.createObjectURL(screenshot.file);
    const dimensions = await getImageDimensions(imageBlobUrl);
    const newAttachment = {
      id: randomDigitStringId(6),
      name: 'Скриншот экрана',
      file: screenshot.file,
      isScreenshot: true,
      ...dimensions,
    };
    const updatedText = textareaText.trim() ? textareaText : 'Вот скриншот моего экрана';
    this.setState({
      textareaText: updatedText,
      textareaAttachments: [ ...textareaAttachments, newAttachment ]
    });
  };

  onReplyMessage = (messageId) => {
    this.setState({ textareaResponseToMessageId: messageId });
  };

  onSubmitRetry = async (message) => {
    const { elixirChatWidget } = this.props;

    this.changeMessageById(message.id, {
      isSubmitting: true,
      isSubmissionError: false,
    });
    elixirChatWidget.sendMessage({
      text: message.text,
      attachments: message.attachments.map(attachment => attachment.originalFileObject).filter(file => file),
      responseToMessageId: _get(message, 'responseToMessage.id'),
      tempId: message.tempId,
    }).catch(() => {
      this.changeMessageById(message.id, {
        isSubmitting: false,
        isSubmissionError: true,
      });
    });
  };

  toggleMute = () => {
    const { areNotificationsMuted } = this.state;
    localStorage.setItem('elixirchat-notifications-muted', JSON.stringify(!areNotificationsMuted));
    this.setState({ areNotificationsMuted: !areNotificationsMuted });
  };

  render(): void {
    const { elixirChatWidget } = this.props;
    const {
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
      isDraggingAttachments,
      widgetTitle,
      areAnyOperatorsOnline,
      areNotificationsMuted,
    } = this.state;

    return (
      <div className="elixirchat-chat-container" ref={this.container}>

        <h2 className="elixirchat-chat-header">
          {widgetTitle && (
            <Fragment>
              {areAnyOperatorsOnline && (
                <i className="elixirchat-chat-header__indicator"/>
              )}
              {widgetTitle}
            </Fragment>
          )}

          <button className="elixirchat-chat-header__mute"
            title={areNotificationsMuted ? 'Включить звук уведомлений' : 'Выключить звук уведомлений'}
            onClick={this.toggleMute}>
            <i className={areNotificationsMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
          </button>

          <button className="elixirchat-chat-header__close"
            title="Закрыть чат"
            onClick={elixirChatWidget.togglePopup}>
            <i className="icon-close-thin"/>
          </button>
        </h2>

        <div className="elixirchat-chat-scroll" ref={this.scrollBlock} onScroll={this.onMessagesScroll}>
          <ChatMessages
            onLoadPreviousMessages={this.loadPreviousMessages}
            onReplyMessage={this.onReplyMessage}
            onSubmitRetry={this.onSubmitRetry}
            elixirChatWidget={elixirChatWidget}/>
        </div>

        <ChatTextarea
          onChange={this.onTextareaChange}
          onSubmit={this.onMessageSubmit}
          textareaText={textareaText}
          textareaResponseToMessageId={textareaResponseToMessageId}
          textareaAttachments={textareaAttachments}
          onVerticalResize={this.onTextareaVerticalResize}
          elixirChatWidget={elixirChatWidget}/>


        {isDraggingAttachments && (
          <Fragment>
            <div className="elixirchat-chat-draggable-backdrop"/>
            <div className="elixirchat-chat-draggable-area">
              <i className="elixirchat-chat-draggable-area__icon icon-file"/>
              <div>Перетащите файлы для загрузки</div>
            </div>
          </Fragment>
        )}

      </div>
    );
  }
}
