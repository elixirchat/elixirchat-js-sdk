import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { playNotificationSound } from '../../utils';
import { DefaultWidgetMessages } from './DefaultWidgetMessages';
import { DefaultWidgetTextarea } from './DefaultWidgetTextarea';
import widgetStyles from './iframeStyles/DefaultWidgetStyles';
import './DefaultWidgetGlobalStyles.css';

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
  messageChunkSize: number = 20;

  state = {
    messages: [],
    room: {},
    client: {},
    currentlyTypingUsers: [],
    isLoadingPreviousMessages: false,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.injectIframeStyles(widgetStyles);

    elixirChatWidget.onConnectSuccess(() => {
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize).then(messages => {
        this.setState({ messages });
        this.scrollToBottom();
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
    });

    elixirChatWidget.onTyping(currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
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

  onTextareaVerticalResize = (newTextareaHeight: number, options: { scrollToBottom: boolean }) => {
    const hasUserScroll = this.hasUserScroll();
    this.scrollBlock.current.style.bottom = newTextareaHeight + 'px';
    if (!hasUserScroll || options.scrollToBottom) {
      this.scrollToBottom();
    }
  };

  render(): void {
    const { messages, currentlyTypingUsers } = this.state;
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

        <div className="elixirchat-chat-scroll" ref={this.scrollBlock} onScroll={this.onMessagesScroll}>
          <DefaultWidgetMessages
            onLoadPreviousMessages={this.loadPreviousMessages}
            elixirChatWidget={elixirChatWidget}
            messages={messages}/>
        </div>

        <DefaultWidgetTextarea
          currentlyTypingUsers={currentlyTypingUsers}
          onVerticalResize={this.onTextareaVerticalResize}
          elixirChatWidget={elixirChatWidget}/>
      </div>
    );
  }
}

export function appendDefaultElixirChatWidget(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <DefaultWidget elixirChatWidget={elixirChatWidget} ref={(widget) => {component = widget}} />
  ), container);
  return component;
}
