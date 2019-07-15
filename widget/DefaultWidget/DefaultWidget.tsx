import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DefaultWidgetMessages } from './DefaultWidgetMessages';
import widgetIframeStyles from './DefaultWidgetIframeStyles';

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
    replyToId: null,
    currentlyTypingUsers: [],
    typedText: '',
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.injectIframeStyles(widgetIframeStyles);

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

  onScreenShotClick = (): void => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.takeScreenshot().then(screenshot => {
      console.log('Screenshot', screenshot.file);
      this.setState({
        test: screenshot.file.name,
      });
    });
  };

  onReplyClick = (messageId): void => {
    this.setState({
      replyToId: messageId
    });
  };

  onTextareaChange = (e): void => {
    this.props.elixirChatWidget.dispatchTypedText(e.target.value);
    this.setState({
      typedText: e.target.value,
    });
  };

  onLoadMore = (): void => {
    const { messages } = this.state;

    const lastMessageCursor = messages[messages.length - 1].cursor;
    this.props.elixirChatWidget.fetchMessageHistory(this.messageChunkSize, lastMessageCursor).then(history => {
      const updatedMessages = [...messages, ...history];
      this.setState({
        messages: updatedMessages,
      });
    });
  };

  onSendMessageClick = (): void => {
    const { typedText, replyToId } = this.state;
    this.props.elixirChatWidget.sendMessage({
      text: typedText,
      responseToMessageId: replyToId,
    });
    this.setState({
      typedText: '',
      replyToId: null,
    });
  };

  render(): void {
    const {
      messages,
      room,
      client,
      replyToId,
      currentlyTypingUsers,
      typedText,
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

        <DefaultWidgetMessages
          elixirChatWidget={elixirChatWidget}
          messages={messages}/>

        <div hidden>
          <textarea className="elixirchat-chat-textarea"
            placeholder="Your message..."
            onChange={this.onTextareaChange}
            value={typedText}>
          </textarea>

          <div className="elixirchat-chat-textarea">{currentlyTypingUsers.length} user(s) typing...</div>
          <button className="elixirchat-chat-submit" onClick={this.onSendMessageClick}>Submit</button>

          <button onClick={this.onLoadMore}>Load more...</button>

          {Boolean(replyToId) && (
            <blockquote className="elixirchat-chat-reply-to">Reply to: ${replyToId}</blockquote>
          )}
          <button onClick={this.onScreenShotClick}>Screenshot</button>
        </div>

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
