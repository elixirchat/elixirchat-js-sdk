import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import { inflect } from '../../utilsWidget';
import {
  WIDGET_MUTE,
  WIDGET_UNMUTE,
  TEXTAREA_VERTICAL_RESIZE,
} from '../ElixirChatWidgetEventTypes';

import {
  JOIN_ROOM_SUCCESS,
  TYPING_STATUS_CHANGE,
  OPERATOR_ONLINE_STATUS_CHANGE,
} from '../../sdk/ElixirChatEventTypes';

import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  widgetTitle: string;
  areAnyOperatorsOnline: boolean;
  isNotificationSoundMuted: boolean;
  currentlyTypingUsers: Array<object>;
  typingBlockBottomOffset: number | null;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  state = {
    widgetTitle: '',
    isNotificationSoundMuted: false,
    areAnyOperatorsOnline: false,
    currentlyTypingUsers: [],
    typingBlockBottomOffset: null,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      this.setState({ widgetTitle: elixirChatWidget.widgetTitle });
    });

    elixirChatWidget.on(WIDGET_MUTE, () => this.setState({ isNotificationSoundMuted: true }));
    elixirChatWidget.on(WIDGET_UNMUTE, () => this.setState({ isNotificationSoundMuted: false }));

    elixirChatWidget.on(OPERATOR_ONLINE_STATUS_CHANGE, areAnyOperatorsOnline => {
      this.setState({ areAnyOperatorsOnline });
    });

    elixirChatWidget.on(TYPING_STATUS_CHANGE, currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
    });

    elixirChatWidget.on(TEXTAREA_VERTICAL_RESIZE, typingBlockBottomOffset => {
      this.setState({ typingBlockBottomOffset });
    });
  }

  render(): void {
    const { elixirChatWidget } = this.props;
    const {
      widgetTitle,
      areAnyOperatorsOnline,
      isNotificationSoundMuted,
      currentlyTypingUsers,
      typingBlockBottomOffset,
    } = this.state;

    const isCurrentlyTyping = Boolean(currentlyTypingUsers.length);

    return (
      <div className="elixirchat-chat-container">

        <h2 className="elixirchat-chat-header">
          {widgetTitle && (
            <Fragment>
              {areAnyOperatorsOnline && (
                <i className="elixirchat-chat-header__indicator"/>
              )}
              {widgetTitle}
            </Fragment>
          )}

          <button className="elixirchat-chat-header__mute"
            onClick={elixirChatWidget.toggleMute}
            title={isNotificationSoundMuted ? 'Включить звук уведомлений' : 'Выключить звук уведомлений'}>
            <i className={isNotificationSoundMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
          </button>

          <button className="elixirchat-chat-header__close"
            title="Закрыть чат"
            onClick={elixirChatWidget.togglePopup}>
            <i className="icon-close-thin"/>
          </button>
        </h2>

        <ChatMessages elixirChatWidget={elixirChatWidget} className={cn({
          'elixirchat-chat--is-typing-visible': isCurrentlyTyping
        })}/>

        <div style={{ bottom: typingBlockBottomOffset }} className={cn({
          'elixirchat-chat-typing': true,
          'elixirchat-chat--is-typing-visible': isCurrentlyTyping,
        })}>
          {isCurrentlyTyping && (
            <Fragment>
              <i className="elixirchat-chat-typing__icon icon-typing"/>
              {inflect('ru-RU', currentlyTypingUsers.length, [
                'человек пишет...',
                'человека пишут...',
                'человек пишут...',
              ])}
            </Fragment>
          )}
        </div>

        <ChatTextarea elixirChatWidget={elixirChatWidget}/>
      </div>
    );
  }
}
