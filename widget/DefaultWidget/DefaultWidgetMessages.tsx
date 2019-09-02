import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/ru'
import { DefaultWidgetMessagesStyles } from './styles';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: any;
  messages: Array<any>;
  onLoadPreviousMessages: any;
}

export interface IDefaultWidgetMessagesState {
  messages: Array<any>;
}

export class DefaultWidgetMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    messages: [],
  };

  componentDidMount(): void {
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);
    this.props.elixirChatWidget.injectIframeStyles(DefaultWidgetMessagesStyles);
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.messages.length !== this.props.messages.length) {
      this.setState({
        messages: this.processMessages(this.props.messages)
      });
    }
  }

  processMessages = (messages) => {
    return messages.map((message, i) => {
      const previousMessage = messages[i - 1];
      if (previousMessage) {
        const isDayEarlier = dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));
        if (isDayEarlier) {
          message.prependDateTitle = true;
        }
      }
      return message;
    });
  };

  render(): void {
    const { messages } = this.state;
    window.__messages = messages;

    return (
      <div className="elixirchat-chat-messages">
        {messages.map(message => (
          <Fragment key={message.id}>
            {message.prependDateTitle && (
              <div className="elixirchat-chat-messages__date-title">
                {dayjs(message.timestamp).calendar(null, { // TODO: handle US date format e.g. "2:30 PM, July 10"
                  sameDay: '[Сегодня, ] D MMMM',
                  lastDay: '[Вчера, ] D MMMM',
                  lastWeek: 'D MMMM',
                  sameElse: 'D MMMM',
                })}
              </div>
            )}
            <div className={cn({
              'elixirchat-chat-messages__item': true,
              'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
              'elixirchat-chat-messages__item--by-agent': message.sender.isOperator,
            })}>
              <div className="elixirchat-chat-messages__balloon">
                <div className="elixirchat-chat-messages__sender">
                  {message.sender.isCurrentClient ? 'Я' : (message.sender.firstName || '') + ' ' + (message.sender.lastName || '')}
                </div>
                {Boolean(message.responseToMessage) && (
                  <div className="elixirchat-chat-messages__reply-to">
                    <i className="elixirchat-chat-messages__reply-to-icon"/>
                    {message.responseToMessage.sender.firstName}&nbsp;
                    {message.responseToMessage.sender.lastName}&nbsp;
                    <span title={message.responseToMessage.text}>
                        {message.responseToMessage.text.substr(0, 100)}
                      </span>
                  </div>
                )}
                <div className="elixirchat-chat-messages__text">{message.text}</div>
              </div>
              <div className="elixirchat-chat-messages__timestamp">
                {dayjs(message.timestamp).format('H:mm, D MMMM') /* TODO: handle US date format e.g. "2:30 PM, July 10" */}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
