import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { _get, _last, randomDigitStringId } from '../../utilsCommon';
import { playNotificationSound, isWebImage } from '../../utilsWidget';
import { serializeMessage } from '../../sdk/serializers/serializeMessage';
import { serializeFile } from '../../sdk/serializers/serializeFile';
import { DefaultWidgetMessages } from './DefaultWidgetMessages';
import { DefaultWidgetTextarea } from './DefaultWidgetTextarea';
import { DefaultWidgetStyles } from './styles';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  messages: Array<any>;
  room: any;
  client: any;
  replyToId: string | null;
  currentlyTypingUsers: Array<any>;
  typedText: string;
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
      this.setState({ messages });
      playNotificationSound();
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

  onMessageSubmit = ({ typedText, replyToId, attachments }) => {
    const { elixirChatWidget } = this.props;
    const { messages } = this.state;

    if (typedText.trim() || attachments.length) {
      const temporaryMessage = this.generateTemporaryMessage({ typedText, attachments, replyToId });
      this.setState({
        messages: [...messages, temporaryMessage],
      });

      elixirChatWidget.sendMessage({
        text: typedText,
        attachments: attachments.map(attachment => attachment.file),
        responseToMessageId: replyToId,
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

  generateTemporaryMessage = ({ typedText, attachments, replyToId }) => {
    const { elixirChatWidget } = this.props;
    const { messages } = this.state;

    const temporaryMessage = {
      id: randomDigitStringId(6),
      text: typedText.trim() || '',
      timestamp: new Date().toISOString(),
      sender: {
        isOperator: false,
        isCurrentClient: true,
      },
      isSubmitting: true,
      attachments: attachments.map(attachment => {
        const id = randomDigitStringId(6);
        const originalFileObject = attachment.file;
        const url = URL.createObjectURL(originalFileObject);
        const fileData = {
          id,
          url,
          originalFileObject,
          name: attachment.name,
          width: attachment.width,
          height: attachment.height,
          bytesSize: originalFileObject.size,
          contentType: originalFileObject.type,
        };
        if (isWebImage(fileData.contentType) && attachment.width && attachment.height) {
          fileData.thumbnails = [{ id, url }];
        }
        return serializeFile(fileData, {
          apiUrl: elixirChatWidget.apiUrl,
          currentClientId: elixirChatWidget.client.id,
        });
      })
    };
    const responseToMessage = messages.filter(message => _get(message, 'responseToMessage.id') === replyToId)[0];
    if (responseToMessage) {
      temporaryMessage.responseToMessage = {
        id: responseToMessage.id,
        text: responseToMessage.text,
        sender: responseToMessage.sender
      };
    }
    return serializeMessage(temporaryMessage, {
      apiUrl: elixirChatWidget.apiUrl,
      currentClientId: elixirChatWidget.client.id,
    });
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

  render(): void {
    const {
      messages,
      currentlyTypingUsers,
      isLoading,
      isLoadingError,
    } = this.state;
    const { elixirChatWidget } = this.props;

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
                elixirChatWidget={elixirChatWidget}
                messages={messages}/>
            </div>

            <DefaultWidgetTextarea
              onMessageSubmit={this.onMessageSubmit}
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
