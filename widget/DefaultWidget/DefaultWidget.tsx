import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
      elixirChatWidget.fetchMessageHistory(5).then(messages => {
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

  onLoadMoreClick = (): void => {
    const { messages } = this.state;

    const lastMessageCursor = messages[messages.length - 1].cursor;
    this.props.elixirChatWidget.fetchMessageHistory(5, lastMessageCursor).then(history => {
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

    const reversedMessages = [...messages].reverse();

    return (
      <div className="elixirchat-chat-container" ref={this.container}>
        <h3 className="elixirchat-chat-header">Room: {room.title} (ID: {room.id})</h3>
        <h3 className="elixirchat-chat-header">
          Client: {client.firstName} {client.lastName} (ID: {client.id})
        </h3>

        <textarea className="elixirchat-chat-textarea"
          placeholder="Your message..."
          onChange={this.onTextareaChange}
          value={typedText}>
        </textarea>

        <div className="elixirchat-chat-textarea">{currentlyTypingUsers.length} user(s) typing...</div>
        <button className="elixirchat-chat-submit" onClick={this.onSendMessageClick}>Submit</button>

        <ul className="elixirchat-chat-messages">
          {reversedMessages.map(message => (
            <li className="elixirchat-chat-message" key={message.id}>
              <b>{message.sender.firstName}</b>: {message.text}&nbsp;
              <button onClick={() => this.onReplyClick(message.id)}>Reply</button>
            </li>
          ))}
        </ul>
        <button onClick={this.onLoadMoreClick}>Load more...</button>

        {Boolean(replyToId) && (
          <blockquote className="elixirchat-chat-reply-to">Reply to: ${replyToId}</blockquote>
        )}
        <button onClick={this.onScreenShotClick}>Screenshot</button>
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
