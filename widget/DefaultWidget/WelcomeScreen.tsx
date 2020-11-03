import React, { Component, Fragment } from 'react';
import { IJoinRoomChannel } from '../../sdk/ElixirChat';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { i18n } from './i18n';
import { UNREAD_COUNTER_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { Tooltip } from './Tooltip';

import { cn, _last } from '../../utilsCommon';
import {
  humanizeUpcomingDate,
  humanizeTimezoneName,
  getAvatarColorByUserId,
  exposeComponentToGlobalScope,
} from '../../utilsWidget';

export interface IWelcomeScreenProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWelcomeScreenState {
  widgetLogo: string;
  widgetChannels: Array<IJoinRoomChannel>;
  widgetIsMuted: boolean;
  unreadMessagesCount: number;
  employeeAvatars: Array<{ url: string, initials: string }>;
  employeesCount: number;
  onlineStatus: IOnlineStatusParams;
}

export class WelcomeScreen extends Component<IWelcomeScreenProps, IWelcomeScreenState> {

  state = {
    widgetChannels: [],
    widgetLogo: '',
    widgetIsMuted: false,
    unreadMessagesCount: 0,
    employeeAvatars: [],
    employeesCount: 0,
    onlineStatus: {
      isOnline: false,
      workHoursStartAt: null,
    },
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope(this, elixirChatWidget);

    elixirChatWidget.on(WIDGET_DATA_SET, () => {
      const {
        widgetLogo,
        widgetChannels,
        widgetIsMuted,
        onlineStatus,
        unreadMessagesCount,
        joinRoomData,
      } = elixirChatWidget;

      const { employeeAvatars, employeesCount } = this.generateEmployeeList(joinRoomData);

      this.setState({
        widgetLogo,
        widgetChannels,
        widgetIsMuted,
        onlineStatus,
        unreadMessagesCount,
        employeeAvatars,
        employeesCount,
      });
    });

    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, widgetIsMuted => {
      this.setState({ widgetIsMuted });
    });

    elixirChatWidget.on(UNREAD_COUNTER_MESSAGES_CHANGE, this.updateUnreadCount);
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.off(UNREAD_COUNTER_MESSAGES_CHANGE, this.updateUnreadCount);
  }

  updateUnreadCount = (unreadMessagesCount) => {
    this.setState({ unreadMessagesCount });
  };

  generateEmployeeList = ({ employeesCount, employees }) => {
    const displayLimit = Math.min(5, employeesCount);
    const employeeAvatars = employees
      .map(this.generateEmployeeAvatar)
      .sort((a,b) => {
        return a.url > b.url ? -1 : 1;
      })
      .slice(0, displayLimit);

    return {
      employeeAvatars,
      employeesCount,
    }
  };

  generateEmployeeAvatar = (employee) => {
    let url = employee.avatar?.url;
    let color = getAvatarColorByUserId(employee?.id);
    let initials = (employee?.firstName || '').toString().replace(/[^a-zа-я]/ig, '')[0]?.toUpperCase();

    if (!initials) {
      const idLetterDict = i18n.agents_initials_dict;
      const idLetterIndex = +_last((employee?.id || '').toString().replace(/[^0-9]+/ig, ''));
      const normalizedIndex = idLetterIndex > -1 ? idLetterIndex : Math.round( Math.random() * (idLetterDict.length - 1) );
      initials = idLetterDict[ normalizedIndex ];
    }
    return { url, color, initials, employee };
  };

  generateOnlineStatusMessage = (onlineStatus) => {
    const { isOnline, workHoursStartAt } = onlineStatus;
    if (isOnline) {
      return (
        <Fragment>
          <i className="elixirchat-welcome-screen__status-online"/> {i18n.status_online}
        </Fragment>
      );
    }
    else {
      return (
        <Fragment>
          <i className="elixirchat-welcome-screen__status-offline"/> {i18n.status_offline}
          {Boolean(workHoursStartAt) && (
            <div className="elixirchat-welcome-screen__status-details">
              {i18n.status_offline_will_reply_at} {humanizeUpcomingDate(workHoursStartAt)} {humanizeTimezoneName(workHoursStartAt)}
            </div>
          )}
        </Fragment>
      );
    }
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      widgetLogo,
      widgetChannels,
      widgetIsMuted,
      unreadMessagesCount,
      employeeAvatars,
      employeesCount,
      onlineStatus,
    } = this.state;

    const visibleUnreadMessagesCount = unreadMessagesCount > 99 ? '99+' : unreadMessagesCount;

    return (
      <div className="elixirchat-welcome-screen__container">

        <Tooltip className="elixirchat-welcome-screen__mute-tooltip" title={widgetIsMuted ? i18n.sound_on : i18n.sound_off}>
          <button className="elixirchat-welcome-screen__mute"
            onClick={() => widgetIsMuted ? elixirChatWidget.unmute() : elixirChatWidget.mute()}>
            <i className={widgetIsMuted ? 'icon-speaker-mute' : 'icon-speaker'}/>
          </button>
        </Tooltip>

        <button className="elixirchat-welcome-screen__close" onClick={elixirChatWidget.closePopup}>
          <i className="icon-close-thin"/>
        </button>

        <div style={{ backgroundImage: `url(${widgetLogo})` }} className={cn({
          'elixirchat-welcome-screen__logo': true,
          'elixirchat-welcome-screen__logo--default': !widgetLogo,
        })}>
          <i className="icon-logo"/>
        </div>

        <h1 className="elixirchat-welcome-screen__title">
          {i18n.caption_main}
        </h1>

        <div className="elixirchat-welcome-screen__status">
          {this.generateOnlineStatusMessage(onlineStatus)}
        </div>

        {Boolean(employeeAvatars.length) && (
          <ul className="elixirchat-welcome-screen__operators">
            {employeeAvatars.map((avatar, i) => (
              <li key={i}
                style={avatar.url ? { backgroundImage: `url(${avatar.url})` } : { backgroundColor: avatar.color }}
                className={cn({
                  'elixirchat-welcome-screen__operators-item': true,
                  'elixirchat-welcome-screen__operators-item--avatar': avatar.url,
                })}>
                {!Boolean(avatar.url) && avatar.initials}
              </li>
            ))}
            {employeesCount > employeeAvatars.length && (
              <li className="elixirchat-welcome-screen__operators-item elixirchat-welcome-screen__operators-item--counter">
                +{employeesCount - employeeAvatars.length}
              </li>
            )}
          </ul>
        )}

        <button className="elixirchat-welcome-screen__chat-button"
          onClick={() => elixirChatWidget.navigateTo('chat')}>
          {i18n.caption_chat_button}
          {Boolean(visibleUnreadMessagesCount) && (
            <span className="elixirchat-welcome-screen__chat-button-counter">
              {visibleUnreadMessagesCount}
            </span>
          )}
        </button>

        {Boolean(widgetChannels.length) && (
          <div className="elixirchat-welcome-screen__channels">
            <div className="elixirchat-welcome-screen__channels-title">{i18n.caption_other_channels}</div>
            <ul className="elixirchat-welcome-screen__channels-list">
              {widgetChannels.map(channel => (
                <li key={channel.type} className={cn({
                  'elixirchat-welcome-screen__channels-item': true,
                  [`elixirchat-welcome-screen__channels-item--${channel.type}`]: true,
                })}>
                  <a className={`elixirchat-welcome-screen__channels-link svg-icon-${channel.type}`}
                    href={channel.url}
                    target="_blank">
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    );
  }
}
