import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import widgetIframeStyles from './DefaultWidgetIframeStyles';

export interface IDefaultElixirChatWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultElixirChatWidgetState {
  messages: Array<any>;
  replyToId: string | null;
}

export class DefaultElixirChatWidget extends Component<IDefaultElixirChatWidgetProps, IDefaultElixirChatWidgetState> {

  container: { current: HTMLElement } = React.createRef();

  state = {
    messages: [],
    replyToId: null,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.injectIframeStyles(widgetIframeStyles);
    elixirChatWidget.onConnectSuccess(() => {
      elixirChatWidget.fetchMessageHistory(5).then(messages => {
        this.setState({ messages });
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

  render(): void {
    const { messages, replyToId } = this.state;

    return (
      <div ref={this.container} className="elixirchat-chat-container">
        <h1 className="zzz">MyComponent:</h1>
        <ul>
          {messages.map(message => (
            <li key={message.id}>
              <b>{message.sender.firstName}</b>: {message.text}&nbsp;
              <button onClick={() => this.onReplyClick(message.id)}>Reply</button>
            </li>
          ))}
        </ul>
        {Boolean(replyToId) && (
          <blockquote>Reply to: ${replyToId}</blockquote>
        )}
        <button onClick={this.onScreenShotClick}>Screenshot</button>
      </div>
    );
  }
}

export function appendDefaultElixirChatWidget(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <DefaultElixirChatWidget elixirChatWidget={elixirChatWidget} ref={(widget) => {component = widget}} />
  ), container);
  return component;
}
