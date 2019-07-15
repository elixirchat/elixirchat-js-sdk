import React, { Component } from 'react';

export interface IDefaultWidgetMessagesProps {
  messages: Array<any>;
}

export interface IDefaultWidgetMessagesState {}

export class DefaultWidgetMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  container: { current: HTMLElement } = React.createRef();

  state = {};

  render(): void {

    const { messages } = this.props;
    const reversedMessages = [...messages].reverse();

    return (
      <div className="elixirchat-chat-messages" ref={this.container}>
        {reversedMessages.map(message => (
          <div className="elixirchat-chat-messages__item" key={message.id}>
            <b>{message.sender.firstName}</b>: {message.text}&nbsp;
            <button onClick={() => this.onReplyClick(message.id)}>Reply</button>
          </div>
        ))}
      </div>
    );
  }
}
