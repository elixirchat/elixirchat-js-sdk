import React, { Component } from 'react';
import cn from 'classnames';
import { ONLINE_STATUS_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';
import {IOnlineStatusParams} from '../../sdk/OnlineStatusSubscription';
import {exposeComponentToGlobalScope} from '../../utilsWidget';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  widgetMainTitle: string;
  widgetIsMuted: boolean;
  onlineStatus: IOnlineStatusParams;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  state = {
    widgetMainTitle: '',
    widgetIsMuted: false,
    onlineStatus: {
      isOnline: false,
      workHoursStartAt: null,
    },
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope('Chat', this, elixirChatWidget);

    elixirChatWidget.on(WIDGET_DATA_SET, () => {
      const { widgetMainTitle, widgetIsMuted } = elixirChatWidget;
      this.setState({
        widgetMainTitle,
        widgetIsMuted,
      });
    });
    elixirChatWidget.on(ONLINE_STATUS_CHANGE, onlineStatus => {
      this.setState({ onlineStatus });
    });
    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, widgetIsMuted => {
      this.setState({ widgetIsMuted });
    });
  }

  render() {
    const { elixirChatWidget, className } = this.props;
    const {
      widgetMainTitle,
      widgetIsMuted,
      onlineStatus,
    } = this.state;

    return (
      <div className={cn('elixirchat-chat-container', className)}>
        <div className="elixirchat-chat-header">
          <i className="elixirchat-chat-header__back icon-arrow-left"
            onClick={() => elixirChatWidget.navigateTo('welcome-screen')}/>

          <span className="elixirchat-chat-header__title" title={'Версия ' + process.env.ELIXIRCHAT_VERSION}>
            {widgetMainTitle}
          </span>

          <i className={cn({
            'elixirchat-chat-header__indicator': true,
            'elixirchat-chat-header__indicator--offline': !onlineStatus.isOnline,
          })}/>

          <button className="elixirchat-chat-header__mute"
            onClick={() => widgetIsMuted ? elixirChatWidget.unmute() : elixirChatWidget.mute()}
            title={widgetIsMuted ? 'Включить звук уведомлений' : 'Выключить звук уведомлений'}>
            <i className={widgetIsMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
          </button>

          <button className="elixirchat-chat-header__close"
            title="Закрыть чат"
            onClick={elixirChatWidget.closePopup}>
            <i className="icon-close-thin"/>
          </button>
        </div>

        <ChatMessages elixirChatWidget={elixirChatWidget}/>
        <ChatTextarea elixirChatWidget={elixirChatWidget}/>
      </div>
    );
  }
}
