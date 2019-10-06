import React, { Component, Fragment } from 'react';
import { _get, _last, randomDigitStringId } from '../../utilsCommon';
import {
  unlockNotificationSoundAutoplay,
  playNotificationSound,
  getImageDimensions,
  isWebImage,
} from '../../utilsWidget';

import { IMessage } from '../../sdk/serializers/serializeMessage';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  messages: Array<IMessage>;
  highlightedMessageIds: Array<IMessage>;
  room: any;
  client: any;
  currentlyTypingUsers: Array<any>;
  textareaText: string;
  textareaResponseToMessageId: string | null;
  textareaAttachments: Array<{ id: string, file: File, name: string, isScreenshot: boolean }>;
  isLoading: boolean;
  isLoadingError: boolean;
  isLoadingPreviousMessages: boolean;
  isDraggingAttachments: boolean;
  widgetTitle: string;
  areOperatorsOnline: boolean;
  areNotificationsMuted: boolean;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  container: { current: HTMLElement } = React.createRef();
  scrollBlock: { current: HTMLElement } = React.createRef();
  messageChunkSize: number = 100; // TODO: reduce to 20 when unread message count implemented in server-side

  state = {
    messages: [],
    highlightedMessageIds: [],
    room: {},
    client: {},
    currentlyTypingUsers: [],
    textareaText: '',
    textareaResponseToMessageId: null,
    textareaAttachments: [],
    isLoading: true,
    isLoadingError: false,
    isLoadingPreviousMessages: false,
    isDraggingAttachments: false,
    widgetTitle: '',
    areOperatorsOnline: false,
    areNotificationsMuted: false,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.onIFrameReady(() => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('dragover', this.onBodyDrag);
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('drop', this.onBodyDrop);
    });

    elixirChatWidget.onConnectSuccess(() => {
      this.setState({ widgetTitle: elixirChatWidget.widgetTitle });

      elixirChatWidget.fetchMessageHistory(this.messageChunkSize)
        .then(async messages => {
          if (messages.length < this.messageChunkSize) {
            messages = [this.generateNewClientPlaceholderMessage(messages), ...messages];
          }
          await this.setState({ messages, isLoading: false });
          this.scrollToBottom();
          this.updateUnseenRepliesCount();
          elixirChatWidget.setIFrameContentMounted();
        })
        .catch(async () => {
          await this.setState({
            isLoading: false,
            isLoadingError: true,
          });
          elixirChatWidget.setIFrameContentMounted();
        });
    });

    elixirChatWidget.onConnectError(async () => {
      await this.setState({
        isLoading: false,
        isLoadingError: true,
      });
    });

    elixirChatWidget.onMessage(message => {
      const hasUserScroll = this.hasUserScroll();
      const messages = [...this.state.messages, message];
      const isMessageSentByCurrentClient = message.sender.isCurrentClient;

      if (isMessageSentByCurrentClient) {
        this.replaceTemporaryMessageWithActualOne(message);
      }
      else {
        this.setState({ messages });
        if (!this.state.areNotificationsMuted) {
          playNotificationSound();
        }
      }
      if (!hasUserScroll) {
        this.scrollToBottom();
      }
      this.updateUnseenRepliesCount();
    });

    elixirChatWidget.onTyping(currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
    });

    elixirChatWidget.onOperatorOnlineStatusChange(areOperatorsOnline => {
      this.setState({ areOperatorsOnline });
    });

    let areNotificationsMuted = false;
    try {
      areNotificationsMuted = JSON.parse(localStorage.getItem('elixirchat-notifications-muted'))
    }
    catch (e) {}
    this.setState({ areNotificationsMuted });
  }

  componentWillUnmount(){
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

  generateNewClientPlaceholderMessage = (previousMessages) => {
    const previousMessageTimestamp = _get(previousMessages, '[0].timestamp');
    const timestamp = previousMessageTimestamp || new Date().toISOString();

    return {
      timestamp,
      id: randomDigitStringId(6),
      isSystem: true,
      sender: {},
      attachments: [],
      systemData: {
        type: 'NEW_CLIENT_PLACEHOLDER'
      },
    };
  };

  getRepliesToCurrentClient = () => {
    const { elixirChatWidget } = this.props;
    const { messages } = this.state;

    if (elixirChatWidget.isPrivate) {
      return messages.filter(message => {
        const isSentByCurrentClient = message.sender.id !== elixirChatWidget.elixirChatClientId;
        const isNewClientPlaceholder = _get(message, 'systemData.type') === 'NEW_CLIENT_PLACEHOLDER';
        return !isSentByCurrentClient && !isNewClientPlaceholder;
      });
    }
    else {
      return messages.filter(message => {
        const { responseToMessage, sender } = message;
        const isSentByCurrentClient = sender.id !== elixirChatWidget.elixirChatClientId;
        const isResponseToCurrentClient = responseToMessage && responseToMessage.sender.id === elixirChatWidget.elixirChatClientId;
        return isResponseToCurrentClient && !isSentByCurrentClient;
      });
    }
  };

  updateUnseenRepliesCount = () => {
    const { elixirChatWidget } = this.props;

    const allRepliesToCurrentClient = this.getRepliesToCurrentClient();
    const latestUnseenReplyId = localStorage.getItem('elixirchat-latest-unseen-reply');
    const latestUnseenReplyIndex = allRepliesToCurrentClient
      .map(message => message.id)
      .indexOf(latestUnseenReplyId);

    const unseenRepliesToCurrentClient = latestUnseenReplyIndex === -1
      ? allRepliesToCurrentClient
      : allRepliesToCurrentClient.slice(latestUnseenReplyIndex + 1);

    const highlightedMessageIds = unseenRepliesToCurrentClient.map(message => message.id);
    this.setState({ highlightedMessageIds });

    elixirChatWidget.setUnreadCount(unseenRepliesToCurrentClient.length);
  };

  resetUnseenRepliesCount = () => {
    const { elixirChatWidget } = this.props;
    const allRepliesToCurrentClient = this.getRepliesToCurrentClient();
    const latestReplyToCurrentClient = _last(allRepliesToCurrentClient);
    if (latestReplyToCurrentClient) {
      localStorage.setItem('elixirchat-latest-unseen-reply', latestReplyToCurrentClient.id);
    }
    elixirChatWidget.setUnreadCount(0);
    this.setState({ highlightedMessageIds: [] });
  };

  onTextareaChange = (stateChange) => {
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
    const {
      elixirChatWidget,
      onImagePreviewOpen,
      isImagePreviewOpen,
    } = this.props;

    const {
      messages,
      highlightedMessageIds,
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
      currentlyTypingUsers,
      isLoading,
      isLoadingError,
      isDraggingAttachments,
      widgetTitle,
      areOperatorsOnline,
      areNotificationsMuted,
    } = this.state;

    return (
      <div className="elixirchat-chat-container" ref={this.container} onClick={this.resetUnseenRepliesCount}>

        <h2 className="elixirchat-chat-header">
          {widgetTitle && (
            <Fragment>
              {areOperatorsOnline && (
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
            onClick={elixirChatWidget.toggleChatVisibility}>
            <i className="icon-close-thin"/>
          </button>
        </h2>

        {isLoading && (
          <i className="elixirchat-chat-spinner"/>
        )}

        {isLoadingError && (
          <div className="elixirchat-chat-fatal-error">
            Ошибка загрузки. <br/>
            Пожалуйста, перезагрузите
            страницу <span className="elixirchat-chat-fatal-error--nowrap">или напишите</span> администратору
            на support@elixir.chat.
          </div>
        )}

        {(!isLoading && !isLoadingError) && (
          <Fragment>
            <div className="elixirchat-chat-scroll" ref={this.scrollBlock} onScroll={this.onMessagesScroll}>
              <ChatMessages
                onLoadPreviousMessages={this.loadPreviousMessages}
                onScreenshotRequestFulfilled={this.onScreenshotRequestFulfilled}
                onImagePreviewOpen={onImagePreviewOpen}
                onReplyMessage={this.onReplyMessage}
                onSubmitRetry={this.onSubmitRetry}
                messages={messages}
                highlightedMessageIds={highlightedMessageIds}
                elixirChatWidget={elixirChatWidget}/>
            </div>

            <ChatTextarea
              onMessageSubmit={this.onMessageSubmit}
              onChange={this.onTextareaChange}
              messages={messages}
              textareaText={textareaText}
              isImagePreviewOpen={isImagePreviewOpen}
              textareaResponseToMessageId={textareaResponseToMessageId}
              textareaAttachments={textareaAttachments}
              currentlyTypingUsers={currentlyTypingUsers}
              onVerticalResize={this.onTextareaVerticalResize}
              elixirChatWidget={elixirChatWidget}/>
          </Fragment>
        )}

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
