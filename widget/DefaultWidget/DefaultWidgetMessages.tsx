import React, { Component } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: any;
  messages: Array<any>;
}

export interface IDefaultWidgetMessagesState {}

export class DefaultWidgetMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  scrollBlock: { current: HTMLElement } = React.createRef();

  state = {};

  componentDidMount(): void {
    dayjs.locale('ru');
    window.dayjs = dayjs;
  }

  render(): void {

    const { messages, elixirChatWidget } = this.props;

    console.log('___ elixirChatWidget.client', elixirChatWidget.client);

    const reversedMessages = [...messages].reverse();

    return (
      <div className="elixirchat-chat-messages" ref={this.scrollBlock}>

        <div className="elixirchat-chat-messages__date-title">Вчера, 14 мая</div>

        {reversedMessages.map(message => (
          <div className={cn({
            'elixirchat-chat-messages__item': true,
            'elixirchat-chat-messages__item--by-me': elixirChatWidget.client.id === message.sender.foreignId,
            'elixirchat-chat-messages__item--by-agent': message.sender.__typename === 'Employee',
          })} key={message.id}>
            <div className="elixirchat-chat-messages__balloon">
              <div className="elixirchat-chat-messages__sender">
                {message.sender.firstName} {message.sender.lastName}
              </div>
              <div className="elixirchat-chat-messages__text">{message.text}</div>
            </div>
            <div className="elixirchat-chat-messages__timestamp">
              {dayjs(message.timestamp).format('H:mm, D MMMM')}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
