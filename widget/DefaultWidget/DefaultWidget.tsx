import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { inflect } from '../../utils';
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
  messageChunkSize: number = 50;

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
        this.setState({
          messages,
          room: elixirChatWidget.room,
          client: elixirChatWidget.client,
        });
      });
    });

    elixirChatWidget.onMessage(message => {
      const messages = [message, ...this.state.messages];
      this.setState({
        messages,
      });
    });

    elixirChatWidget.onTyping(currentlyTypingUsers => {
      this.setState({
        currentlyTypingUsers,
      });
    });
  }

  loadPreviousMessages = (callback): void => {
    if (this.state.isLoadingPreviousMessages) {
      return;
    }
    const { messages } = this.state;
    this.setState({ isLoadingPreviousMessages: true });
    const lastMessageCursor = messages[messages.length - 1].cursor;
    this.props.elixirChatWidget.fetchMessageHistory(this.messageChunkSize, lastMessageCursor).then(history => {
      const updatedMessages = [...messages, ...history];
      this.setState({
        messages: updatedMessages,
        isLoadingPreviousMessages: false,
      }, callback);
    });
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

        <DefaultWidgetMessages
          onLoadPreviousMessages={this.loadPreviousMessages}
          elixirChatWidget={elixirChatWidget}
          messages={messages}/>

        {Boolean(currentlyTypingUsers.length) && (
          <div className="elixirchat-chat-typing">
            {inflect('ru-RU', currentlyTypingUsers.length, ['человек пишет...', 'человека пишут...', 'человек пишут...'])}
          </div>
        )}

        <DefaultWidgetTextarea
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
