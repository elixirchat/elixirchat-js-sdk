import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import { JOIN_ROOM_SUCCESS, OPERATOR_ONLINE_STATUS_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { WIDGET_MUTE_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  widgetTitle: string;
  areAnyOperatorsOnline: boolean;
  isNotificationSoundMuted: boolean;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  state = {
    widgetTitle: '',
    isNotificationSoundMuted: false,
    areAnyOperatorsOnline: false,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;

    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      this.setState({ widgetTitle: elixirChatWidget.widgetTitle });
    });
    elixirChatWidget.on(OPERATOR_ONLINE_STATUS_CHANGE, areAnyOperatorsOnline => {
      this.setState({ areAnyOperatorsOnline });
    });
    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, isNotificationSoundMuted => {
      this.setState({ isNotificationSoundMuted });
    });
  }

  render() {
    const { elixirChatWidget, className } = this.props;
    const {
      widgetTitle,
      areAnyOperatorsOnline,
      isNotificationSoundMuted,
    } = this.state;

    return (
      <div className={cn('elixirchat-chat-container', className)}>

        <h2 className="elixirchat-chat-header">
          {widgetTitle && (
            <Fragment>
              {areAnyOperatorsOnline && (
                <i className="elixirchat-chat-header__indicator"/>
              )}
              <span title={'Версия ' + process.env.ELIXIRCHAT_VERSION}>
                {widgetTitle}
              </span>
            </Fragment>
          )}

          <button className="elixirchat-chat-header__mute"
            onClick={() => isNotificationSoundMuted ? elixirChatWidget.unmute() : elixirChatWidget.mute()}
            title={isNotificationSoundMuted ? 'Включить звук уведомлений' : 'Выключить звук уведомлений'}>
            <i className={isNotificationSoundMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
          </button>

          <button className="elixirchat-chat-header__close"
            title="Закрыть чат"
            onClick={elixirChatWidget.closePopup}>
            <i className="icon-close-thin"/>
          </button>
        </h2>

        <ChatMessages elixirChatWidget={elixirChatWidget}/>
        <ChatTextarea elixirChatWidget={elixirChatWidget}/>
      </div>
    );
  }
}
