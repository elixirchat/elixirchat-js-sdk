import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/ru'
import widgetMessagesStyles from './iframeStyles/DefaultWidgetMessagesStyles';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: any;
  messages: Array<any>;
}

export interface IDefaultWidgetMessagesState {
  messages: Array<any>;
}

export class DefaultWidgetMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  scrollBlock: { current: HTMLElement } = React.createRef();

  state = {
    messages: [],
  };

  componentDidMount(): void {
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);
    this.props.elixirChatWidget.injectIframeStyles(widgetMessagesStyles);
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.messages.length !== this.props.messages.length) {
      console.log('___ update messages', this.props);
      const messageListHasUserScroll = this.messageListHasUserScroll();
      this.setState({
        messages: this.processMessages(this.props.messages)
      }, () => {
        if (!messageListHasUserScroll) {
          this.scrollToBottom();
        }
      });
    }
  }

  processMessages = (messages) => {
    const reversedMessages = [...messages].reverse();
    return reversedMessages.map((message, i) => {
      const previousMessage = reversedMessages[i - 1];
      if (previousMessage) {
        const isDayEarlier = dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));
        if (isDayEarlier) {
          message.prependDateTitle = true;
        }
      }
      message.isSentByMe = this.props.elixirChatWidget.client.id === message.sender.foreignId;
      return message;
    });
  };

  onMessagesScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    if (scrollBlock.scrollTop <= 0) {
      const initialScrollHeight = scrollBlock.scrollHeight;
      this.props.onLoadPreviousMessages(() => {
        setTimeout(() => {
          scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
        }, 0);
      });
    }
  };

  messageListHasUserScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    return scrollBlock.scrollTop !== scrollBlock.scrollHeight - scrollBlock.offsetHeight;
  };

  scrollToBottom = () => {
    this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
  };

  render(): void {

    const { elixirChatWidget } = this.props;
    const { messages } = this.state;

    return (
      <div className="elixirchat-chat-messages" ref={this.scrollBlock} onScroll={this.onMessagesScroll}>
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
              'elixirchat-chat-messages__item--by-me': message.isSentByMe,
              'elixirchat-chat-messages__item--by-agent': message.sender.__typename === 'Employee',
            })}>
              <div className="elixirchat-chat-messages__balloon">
                <div className="elixirchat-chat-messages__sender">
                  {message.isSentByMe ? 'Я' : message.sender.firstName + ' ' + message.sender.lastName}
                </div>
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
