import React, { Component, Fragment } from 'react';
import { _get, _last, randomDigitStringId } from '../../utilsCommon';
import cn from 'classnames';
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
  widgetTitle: string;
  areOperatorsOnline: boolean;
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
    widgetTitle: '',
    areOperatorsOnline: false,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.onIFrameReady(() => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
    });

    elixirChatWidget.onConnectSuccess(() => {
      this.setState({ widgetTitle: elixirChatWidget.widgetTitle });

      elixirChatWidget.fetchMessageHistory(this.messageChunkSize)
        .then(async messages => {
          if (messages.length < this.messageChunkSize) {
            messages = [this.generateNewClientPlaceholderMessage(), ...messages];
          }
          await this.setState({ messages, isLoading: false });
          this.scrollToBottom();
          this.updateUnseenRepliesCount();
          elixirChatWidget.setIFrameContentMounted();
        })
        .catch(async e => {
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
        playNotificationSound();
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
      console.log('%c__ IS ONLINE CHANGED', 'color: green', isOnline); // TODO: remove
      this.setState({ areOperatorsOnline });
    });
  }

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

  generateNewClientPlaceholderMessage = () => {
    return {
      id: randomDigitStringId(6),
      timestamp: new Date().toISOString(),
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
        const { responseToMessage } = message;
        return responseToMessage && responseToMessage.sender.id === elixirChatWidget.elixirChatClientId;
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
      widgetTitle,
      areOperatorsOnline,
    } = this.state;

    return (
      <div className="elixirchat-chat-container" ref={this.container} onClick={this.resetUnseenRepliesCount}>

        <h2 className="elixirchat-chat-header">
          {widgetTitle && (
            <Fragment>
              <i className={cn({
                'elixirchat-chat-header__indicator': true,
                'elixirchat-chat-header__indicator--online': areOperatorsOnline,
              })}/>
              {widgetTitle}
              {!areOperatorsOnline && ' (не в сети)'}
            </Fragment>
          )}
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
            {/* TODO: add webmaster email from config */}
            Ошибка загрузки. <br/>
            Пожалуйста, перезагрузите
            страницу <span className="elixirchat-chat-fatal-error--nowrap">или свяжитесь с</span> администратором.
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
      </div>
    );
  }
}
