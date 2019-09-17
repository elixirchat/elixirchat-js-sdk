import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { _get, _last, _isEqualShallow, randomDigitStringId } from '../../utilsCommon';
import { playNotificationSound, isWebImage } from '../../utilsWidget';
import { IMessage } from '../../sdk/serializers/serializeMessage';
import { DefaultWidgetMessages } from './DefaultWidgetMessages';
import { DefaultWidgetTextarea } from './DefaultWidgetTextarea';
import { DefaultWidgetStyles } from './styles';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  messages: Array<IMessage>;
  room: any;
  client: any;
  currentlyTypingUsers: Array<any>;
  textareaText: string;
  textareaResponseToMessageId: string | null;
  textareaAttachments: Array<{ id: string, file: File, name: string, isScreenshot: boolean }>;
  isLoading: boolean;
  isLoadingError: boolean;
  isLoadingPreviousMessages: boolean;
}

export class DefaultWidget extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  container: { current: HTMLElement } = React.createRef();
  scrollBlock: { current: HTMLElement } = React.createRef();
  messageChunkSize: number = 100; // TODO: reduce to 20 when unread message count implemented in server-side

  state = {
    messages: [],
    room: {},
    client: {},
    currentlyTypingUsers: [],
    textareaText: '',
    textareaResponseToMessageId: null,
    textareaAttachments: [],
    isLoading: true,
    isLoadingError: false,
    isLoadingPreviousMessages: false,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.injectIframeStyles(DefaultWidgetStyles);

    elixirChatWidget.onConnectSuccess(() => {
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize)
        .then(messages => {
          this.setState({ messages, isLoading: false });
          this.scrollToBottom();
          this.updateUnseenRepliesToCurrentClient();
        })
        .catch(() => {
          this.setState({
            isLoading: false,
            isLoadingError: true,
          });
        });
    });

    elixirChatWidget.onConnectError(() => {
      this.setState({
        isLoading: false,
        isLoadingError: true,
      });
    });

    elixirChatWidget.onMessage(message => {
      const messages = [...this.state.messages, message];
      const hasUserScroll = this.hasUserScroll();
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
      this.updateUnseenRepliesToCurrentClient();
    });

    elixirChatWidget.onTyping(currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
    });

    elixirChatWidget.onToggleChatVisibility(this.updateUnseenRepliesToCurrentClient);
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

  onTextareaVerticalResize = (newTextareaHeight: number, options: { scrollToBottom: boolean } = {}) => {
    const hasUserScroll = this.hasUserScroll();
    this.scrollBlock.current.style.bottom = newTextareaHeight + 'px';
    if (!hasUserScroll || options.scrollToBottom) {
      this.scrollToBottom();
    }
  };

  onMessageSubmit = () => {
    const { elixirChatWidget } = this.props;
    const {
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
      messages,
    } = this.state;

    if (textareaText.trim() || textareaAttachments.length) {
      const temporaryMessage = this.generateTemporaryMessage({
        textareaText,
        textareaResponseToMessageId,
        textareaAttachments,
      });
      this.setState({
        messages: [...messages, temporaryMessage],
      });

      elixirChatWidget.sendMessage({
        text: textareaText,
        responseToMessageId: textareaResponseToMessageId,
        attachments: textareaAttachments.map(attachment => attachment.file),
      })
        .catch(() => {
          this.changeMessageById(temporaryMessage.id, {
            isSubmitting: false,
            isSubmissionError: true,
          });
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
      return this.areMessagesEquivalent(message, newMessage);
    }));
    this.changeMessageById(temporaryMessage.id, newMessage);
  };

  areMessagesEquivalent = (message1, message2) => {
    const normalizeMessage = (message) => {
      const attachmentsHash = message.attachments.map(attachment => {
        const originalFileName = _get(attachment, 'originalFileObject.name');
        return originalFileName || attachment.name;
      }).sort().join();

      return {
        text: message.text || '',
        responseToMessageId: _get(message, 'responseToMessage.id') || null,
        attachmentsHash,
      }
    };
    return _isEqualShallow(normalizeMessage(message1), normalizeMessage(message2));
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

  updateUnseenRepliesToCurrentClient = () => {
    const { messages } = this.state;
    const { elixirChatWidget } = this.props;

    const repliesToCurrentClient = messages.filter(message => {
      const { responseToMessage } = message;
      return responseToMessage && responseToMessage.sender.id === elixirChatWidget.elixirChatClientId;
    });

    if (elixirChatWidget.widgetIsVisible) {
      const latestReplyToCurrentClient = _last(repliesToCurrentClient);
      if (latestReplyToCurrentClient) {
        localStorage.setItem('elixirchat-latest-unseen-reply', latestReplyToCurrentClient.id);
      }
      elixirChatWidget.setUnreadCount(0);
    }
    else {
      const latestUnseenReplyId = localStorage.getItem('elixirchat-latest-unseen-reply');
      const latestUnseenReplyIndex = repliesToCurrentClient
        .map(message => message.id)
        .indexOf(latestUnseenReplyId);
      const unseenRepliesToCurrentClient = latestUnseenReplyIndex === -1
        ? repliesToCurrentClient
        : repliesToCurrentClient.slice(latestUnseenReplyIndex + 1);
      elixirChatWidget.setUnreadCount(unseenRepliesToCurrentClient.length);
    }
  };

  onTextareaChange = (stateChange) => {
    this.setState(stateChange);
  };

  onScreenshotRequestFulfilled = (screenshot) => {
    const { textareaText, textareaAttachments } = this.state;
    const newAttachment = {
      id: randomDigitStringId(6),
      name: 'Скриншот экрана',
      file: screenshot.file,
      isScreenshot: true,
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

  render(): void {
    const {
      messages,
      textareaText,
      textareaResponseToMessageId,
      textareaAttachments,
      currentlyTypingUsers,
      isLoading,
      isLoadingError,
    } = this.state;
    const { elixirChatWidget } = this.props;

    window.__this = this;

    return (
      <div className="elixirchat-chat-container" ref={this.container}>

        <h2 className="elixirchat-chat-header">
          <i className="elixirchat-chat-header__indicator"/>
          Служба поддержки
          <button className="elixirchat-chat-header__close"
            title="Закрыть чат"
            onClick={elixirChatWidget.toggleChatVisibility}/>
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
              <DefaultWidgetMessages
                onLoadPreviousMessages={this.loadPreviousMessages}
                onScreenshotRequestFulfilled={this.onScreenshotRequestFulfilled}
                onReplyMessage={this.onReplyMessage}
                elixirChatWidget={elixirChatWidget}
                messages={messages}/>
            </div>

            <DefaultWidgetTextarea
              onMessageSubmit={this.onMessageSubmit}
              onChange={this.onTextareaChange}
              textareaText={textareaText}
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

export function appendWidgetIframeContent(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <DefaultWidget ref={(widget) => {component = widget}} elixirChatWidget={elixirChatWidget} />
  ), container);
  return component;
}
