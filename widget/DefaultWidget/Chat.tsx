import React, { Component } from 'react';
import { ONLINE_STATUS_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';
import { Tooltip } from './Tooltip';
import { cn } from '../../utilsCommon';
import { exposeComponentToGlobalScope } from '../../utilsWidget';
import { i18n } from './i18n';

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetState {
  widgetIsMuted: boolean;
  onlineStatus: IOnlineStatusParams;
}

export class Chat extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  state = {
    widgetIsMuted: false,
    onlineStatus: {
      isOnline: false,
      workHoursStartAt: null,
    },
  };

  chatMessages = React.createRef();

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope(this, elixirChatWidget);

    elixirChatWidget.on(WIDGET_DATA_SET, () => {
      const { widgetIsMuted, onlineStatus } = elixirChatWidget;
      this.setState({ widgetIsMuted, onlineStatus });
    });
    elixirChatWidget.on(ONLINE_STATUS_CHANGE, onlineStatus => {
      this.setState({ onlineStatus });
    });
    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, widgetIsMuted => {
      this.setState({ widgetIsMuted });
    });
  }

  onBackButtonClick = () => {
    const { elixirChatWidget } = this.props;
    try {
      elixirChatWidget.widgetChatScrollY = this.chatMessages.current.scrollBlock.current.scrollTop;
    }
    catch (e) {}
    elixirChatWidget.navigateTo('welcome-screen');
  };

  render() {
    const { elixirChatWidget, className } = this.props;
    const { widgetIsMuted, onlineStatus } = this.state;

    return (
      <div className={cn('elixirchat-chat-container', className)}>
        <div className="elixirchat-chat-header">

          <i className="elixirchat-chat-header__back icon-arrow-left"
            onClick={this.onBackButtonClick}/>

          <i className={cn({
            'elixirchat-chat-header__indicator': true,
            'elixirchat-chat-header__indicator--offline': !onlineStatus.isOnline,
          })}/>

          <span className="elixirchat-chat-header__title" title={i18n.version + ' ' + process.env.ELIXIRCHAT_VERSION}>
            {i18n.caption_main}
          </span>

          <Tooltip className="elixirchat-chat-header__mute-tooltip" title={widgetIsMuted ? i18n.sound_on : i18n.sound_off}>
            <button className="elixirchat-chat-header__mute"
              onClick={() => widgetIsMuted ? elixirChatWidget.unmute() : elixirChatWidget.mute()}>
              <i className={widgetIsMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
            </button>
          </Tooltip>

          <button className="elixirchat-chat-header__close" onClick={elixirChatWidget.closePopup}>
            <i className="icon-close-thin"/>
          </button>
        </div>

        <ChatMessages elixirChatWidget={elixirChatWidget} ref={this.chatMessages}/>
        <ChatTextarea elixirChatWidget={elixirChatWidget}/>
      </div>
    );
  }
}
