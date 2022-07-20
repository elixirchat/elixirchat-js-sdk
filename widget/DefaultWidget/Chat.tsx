import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { ONLINE_STATUS_CHANGE } from '../../sdk/ElixirChatEventTypes';
import {
  WIDGET_DATA_SET,
  WIDGET_MUTE_TOGGLE,
  WIDGET_SEARCH_TOGGLE
} from '../ElixirChatWidgetEventTypes';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';
import { Tooltip } from './Tooltip';
import { cn } from '../../utilsCommon';
import { exposeComponentToGlobalScope } from '../../utilsWidget';

type IntlArgId = {
  id: string
}

type IntlArgVersion = {
  version?: string
}

export interface IDefaultWidgetProps {
  elixirChatWidget: any;
  intl: {
    formatMessage: (arg: IntlArgId, version?: IntlArgVersion) => string,
  };
  className?: string
}

export interface IDefaultWidgetState {
  widgetTitle: string;
  widgetIsMuted: boolean;
  onlineStatus: IOnlineStatusParams;
  widgetIsSearchOpen: boolean;
}

class ChatComponent extends Component<IDefaultWidgetProps, IDefaultWidgetState> {

  state = {
    widgetTitle: '',
    widgetIsMuted: false,
    onlineStatus: {
      isOnline: false,
      workHoursStartAt: null,
    },
    // Search
    widgetIsSearchOpen: false,
  };

  chatMessages = React.createRef();

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope(this, elixirChatWidget);

    elixirChatWidget.on(WIDGET_DATA_SET, () => {
      const { widgetTitle, widgetIsMuted, onlineStatus, widgetIsSearchOpen } = elixirChatWidget;
      this.setState({
        widgetTitle,
        widgetIsMuted,
        onlineStatus,
        widgetIsSearchOpen,
      });
    });
    elixirChatWidget.on(ONLINE_STATUS_CHANGE, onlineStatus => {
      this.setState({ onlineStatus });
    });
    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, widgetIsMuted => {
      this.setState({ widgetIsMuted });
    });
    elixirChatWidget.on(WIDGET_SEARCH_TOGGLE, widgetIsSearchOpen => {
      this.setState({ widgetIsSearchOpen });
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

  getMuteTooltipMessage = () => {
    const { widgetIsMuted } = this.state;
    return widgetIsMuted
      ? this.props.intl.formatMessage({ id: 'unmute' })
      : this.props.intl.formatMessage({ id: 'mute' });
  };

  getVersionStr = () => {
    return this.props.intl.formatMessage({ id: 'version' }, { version: process.env.ELIXIRCHAT_VERSION });
  };

  /**
   * Search
   */

  /** Search **/

  onToggleSearchForm = () => {
    const state = this.state.widgetIsSearchOpen;
    const { elixirChatWidget } = this.props;

    if (state) {
      elixirChatWidget.closeSearch();
    } else {
      elixirChatWidget.openSearch();
    }
  };

  render() {
    const { elixirChatWidget, className } = this.props;
    const {
      widgetTitle,
      widgetIsMuted,
      onlineStatus,
      widgetIsSearchOpen
    } = this.state;

    return (
      <div className={cn('elixirchat-chat-container', className)}>
        <div className="elixirchat-chat-header">
          <div className="elixirchat-chat-header__column">
            <button className="elixirchat-chat-header__button" onClick={this.onBackButtonClick}>
              <i className="icon-arrow-left"/>
            </button>

            {onlineStatus.isOnline && (
              <i className="elixirchat-chat-header__indicator"/>
            )}

            <span className="elixirchat-chat-header__title" title={this.getVersionStr()}>
            {widgetTitle}
          </span>
          </div>

          <div className="elixirchat-chat-header__column">
            <button
              className={cn({
                'elixirchat-chat-header__button': true,
                'elixirchat-chat-header__button-search': true,
                'elixirchat-chat-header__button-search_active': widgetIsSearchOpen,
              })}
              onClick={this.onToggleSearchForm}>
              <i className={cn({
                'icon-search': true,
                'elixirchat-widget-icon__header-search_active': widgetIsSearchOpen,
              })}/>
            </button>

            
              <button className="elixirchat-chat-header__button"
                      onClick={() => widgetIsMuted ? elixirChatWidget.unmute() : elixirChatWidget.mute()}>
                <Tooltip className="elixirchat-chat-header__mute-tooltip" title={this.getMuteTooltipMessage()}>
                <i className={widgetIsMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
                  
              </button>

            <button className="elixirchat-chat-header__button" onClick={elixirChatWidget.closePopup}>
              <i className="icon-close-thin"/>
            </button>
          </div>
        </div>
        <ChatMessages elixirChatWidget={elixirChatWidget} ref={this.chatMessages}/>
        <ChatTextarea elixirChatWidget={elixirChatWidget} textAreaActiveState={!widgetIsSearchOpen}/>
      </div>
    );
  }
}

export const Chat = injectIntl(ChatComponent);
