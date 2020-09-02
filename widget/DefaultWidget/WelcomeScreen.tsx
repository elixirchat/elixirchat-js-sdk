import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import { IJoinRoomChannel } from '../../sdk/ElixirChat';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { WIDGET_DATA_SET } from '../ElixirChatWidgetEventTypes';
import { UNREAD_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import {
  exposeComponentToGlobalScope,
  humanizeTimezoneName,
  humanizeUpcomingDate,
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
  employeesCount: number;
  employeeAvatars: Array<{ url: string, initials: string }>;
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
    exposeComponentToGlobalScope('WelcomeScreen', this, elixirChatWidget);

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
    elixirChatWidget.on(UNREAD_MESSAGES_CHANGE, unreadMessagesCount => {
      this.setState({ unreadMessagesCount });
    });
  }

  generateEmployeeList = ({ employeesCount, employees }) => {
    const displayLimit = Math.min(5, employeesCount);

    let employeeAvatars = employees
      .filter(employee => employee.avatar?.url)
      .map((employee): any => {
        return {
          url: employee.avatar?.url,
          initials: '',
        };
      })
      .slice(0, displayLimit);

    if (employeeAvatars.length < displayLimit) {
      const textAvatars = employees
        .filter(employee => !employee.avatar?.url)
        .map((employee): any => {
          return {
            url: '',
            initials: this.generateEmployeeInitials(employee),
          };
        })
        .slice(0, displayLimit - employeeAvatars.length);

      employeeAvatars = [ ...employeeAvatars, ...textAvatars ];
    }
    return {
      employeeAvatars,
      employeesCount,
    }
  };

  generateEmployeeInitials = (employee) => {
    const nameInitial = (employee.firstName || '').replace(/[^a-zа-я]/ig, '')[0];
    const randomLetterDict = 'АВЕКМНОРС';
    const randomLetter = randomLetterDict[ Math.round( Math.random() * (randomLetterDict.length - 1) ) ];
    return (nameInitial || randomLetter).toUpperCase();
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

        <i className="icon-close-thin elixirchat-welcome-screen-close"/>

        <div className="elixirchat-welcome-screen-top">
          <div className="elixirchat-welcome-screen-top__logo" style={{ backgroundImage: `url(${widgetCompanyLogoUrl})` }}/>
          <h1 className="elixirchat-welcome-screen-top__title">{widgetMainTitle}</h1>
          <div className="elixirchat-welcome-screen-top__status">
            {this.generateOnlineStatusMessage(onlineStatus)}
          </div>
        </div>

        <div className="elixirchat-welcome-screen-operators">
          <div className="elixirchat-welcome-screen-operators__title">{widgetChatSubtitle}</div>
          <ul className="elixirchat-welcome-screen-operators__list">
            {employeeAvatars.map((avatar, i) => (
              <li className={cn({
                'elixirchat-welcome-screen-operators__item': true,
                'elixirchat-welcome-screen-operators__item--avatar': avatar.url,
              })}
                key={i}
                style={avatar.url ? { backgroundImage: `url(${avatar.url})` } : null}>
                {avatar.initials}
              </li>
            ))}
            {employeesCount > employeeAvatars.length && (
              <li className="elixirchat-welcome-screen-operators__item">
                +{employeesCount - employeeAvatars.length}
              </li>
            )}
          </ul>
          <button className="elixirchat-welcome-screen-operators__button"
            onClick={() => elixirChatWidget.navigateTo({ view: 'chat', animation: 'slideLeft' })}>
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
