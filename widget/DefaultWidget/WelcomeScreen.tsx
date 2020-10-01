import React, { Component, Fragment } from 'react';
import { IJoinRoomChannel } from '../../sdk/ElixirChat';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { WIDGET_DATA_SET } from '../ElixirChatWidgetEventTypes';
import { UNREAD_COUNTER_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
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
  widgetMainTitle: string;
  widgetChatSubtitle: string;
  widgetChannels: Array<IJoinRoomChannel>;
  widgetCompanyLogoUrl: string;
  unreadMessagesCount: number;
  employeeAvatars: Array<{ url: string, initials: string }>;
  employeesCount: number;
  onlineStatus: IOnlineStatusParams;
}

export class WelcomeScreen extends Component<IWelcomeScreenProps, IWelcomeScreenState> {

  state = {
    widgetMainTitle: '',
    widgetChatSubtitle: '',
    widgetChannels: [],
    widgetCompanyLogoUrl: '',
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
        widgetMainTitle,
        widgetChatSubtitle,
        widgetCompanyLogoUrl,
        widgetChannels,
        onlineStatus,
        unreadMessagesCount,
        joinRoomData,
      } = elixirChatWidget;

      const { employeeAvatars, employeesCount } = this.generateEmployeeList(joinRoomData);

      this.setState({
        widgetMainTitle,
        widgetChatSubtitle,
        widgetCompanyLogoUrl,
        widgetChannels,
        onlineStatus,
        unreadMessagesCount,
        employeeAvatars,
        employeesCount,
      });
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
      const idLetterDict = 'АВЕКМНОРСТ';
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
          Онлайн <i className="elixirchat-welcome-screen-top__status-online"/>
        </Fragment>
      );
    }
    else {
      return (
        <Fragment>
          Оффлайн <i className="elixirchat-welcome-screen-top__status-offline"/>
          {Boolean(workHoursStartAt) && (
            <div className="elixirchat-welcome-screen-top__status-details">
              Ответим {humanizeUpcomingDate(workHoursStartAt)} {humanizeTimezoneName(workHoursStartAt)}
            </div>
          )}
        </Fragment>
      );
    }
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      widgetMainTitle,
      widgetChatSubtitle,
      widgetCompanyLogoUrl,
      widgetChannels,
      unreadMessagesCount,
      employeeAvatars,
      employeesCount,
      onlineStatus,
    } = this.state;

    const visibleUnreadMessagesCount = unreadMessagesCount > 99 ? '99+' : unreadMessagesCount;

    return (
      <div className="elixirchat-welcome-screen-container">

        <i className="icon-close-thin elixirchat-welcome-screen-close"
          onClick={elixirChatWidget.closePopup}/>

        <div className="elixirchat-welcome-screen-top">
          <div style={{ backgroundImage: `url(${widgetCompanyLogoUrl})` }} className={cn({
            'elixirchat-welcome-screen-top__logo': true,
            'elixirchat-welcome-screen-top__logo--default': !widgetCompanyLogoUrl,
          })}>
            <i className="icon-logo"/>
          </div>
          <h1 className="elixirchat-welcome-screen-top__title">{widgetMainTitle}</h1>
          <div className="elixirchat-welcome-screen-top__status">
            {this.generateOnlineStatusMessage(onlineStatus)}
          </div>
        </div>

        <div className="elixirchat-welcome-screen-operators">
          <div className="elixirchat-welcome-screen-operators__title">
            {widgetChatSubtitle}
          </div>
          {Boolean(employeeAvatars.length) && (
            <ul className="elixirchat-welcome-screen-operators__list">
              {employeeAvatars.map((avatar, i) => (
                <li key={i}
                  style={avatar.url ? { backgroundImage: `url(${avatar.url})` } : { backgroundColor: avatar.color }}
                  className={cn({
                    'elixirchat-welcome-screen-operators__item': true,
                    'elixirchat-welcome-screen-operators__item--avatar': avatar.url,
                  })}>
                  {!Boolean(avatar.url) && avatar.initials}
                </li>
              ))}
              {employeesCount > employeeAvatars.length && (
                <li className="elixirchat-welcome-screen-operators__item elixirchat-welcome-screen-operators__item--counter">
                  +{employeesCount - employeeAvatars.length}
                </li>
              )}
            </ul>
          )}
          <button className="elixirchat-welcome-screen-operators__button"
            onClick={() => elixirChatWidget.navigateTo('chat')}>
            Написать в поддержку
            {Boolean(visibleUnreadMessagesCount) && (
              <span className="elixirchat-welcome-screen-operators__button-counter">
                {visibleUnreadMessagesCount}
              </span>
            )}
          </button>
        </div>

        {Boolean(widgetChannels.length) && (
          <div className="elixirchat-welcome-screen-channels">
            <div className="elixirchat-welcome-screen-channels__title">Поддержка в других каналах</div>
            <ul className="elixirchat-welcome-screen-channels__list">
              {widgetChannels.map(channel => (
                <li key={channel.type} className="elixirchat-welcome-screen-channels__item">
                  <a className={`elixirchat-welcome-screen-channels__link svg-icon-${channel.type}`}
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
