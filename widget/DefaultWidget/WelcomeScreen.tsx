import React, { Component, Fragment } from 'react';
import { IJoinRoomChannel } from '../../sdk/ElixirChat';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { cn, _last } from '../../utilsCommon';
import {
  humanizeUpcomingDate,
  humanizeTimezoneName,
  getAvatarColorByUserId,
  exposeComponentToGlobalScope,
} from '../../utilsWidget';
import { Tooltip } from './Tooltip';

export interface IWelcomeScreenProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWelcomeScreenState {
  widgetTitle: string;
  widgetLogo: string;
  widgetChannels: Array<IJoinRoomChannel>;
  widgetIsMuted: boolean;
  employeeAvatars: Array<{ url: string, initials: string }>;
  employeesCount: number;
  onlineStatus: IOnlineStatusParams;
}

export class WelcomeScreen extends Component<IWelcomeScreenProps, IWelcomeScreenState> {

  state = {
    widgetTitle: '',
    widgetChannels: [],
    widgetLogo: '',
    widgetIsMuted: false,
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
        widgetTitle,
        widgetLogo,
        widgetChannels,
        widgetIsMuted,
        onlineStatus,
        joinRoomData,
      } = elixirChatWidget;

      const { employeeAvatars, employeesCount } = this.generateEmployeeList(joinRoomData);

      this.setState({
        widgetTitle,
        widgetLogo,
        widgetChannels,
        widgetIsMuted,
        onlineStatus,
        employeeAvatars,
        employeesCount,
      });
    });

    elixirChatWidget.on(WIDGET_MUTE_TOGGLE, widgetIsMuted => {
      this.setState({ widgetIsMuted });
    });
  }

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

  render() {
    const { elixirChatWidget } = this.props;
    const {
      widgetTitle,
      widgetLogo,
      widgetChannels,
      widgetIsMuted,
      employeeAvatars,
      employeesCount,
      onlineStatus,
    } = this.state;

    return (
      <div className="elixirchat-welcome-screen__container">

        <Tooltip className="elixirchat-welcome-screen__mute-tooltip" title={widgetIsMuted
          ? 'Включить звук уведомлений'
          : 'Выключить звук уведомлений'}>
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

        <h1 className="elixirchat-welcome-screen__title">{widgetTitle}</h1>

        <div className="elixirchat-welcome-screen__status">
          {onlineStatus.isOnline && (
            <Fragment>
              <i className="elixirchat-welcome-screen__status-online"/> Сейчас в сети
            </Fragment>
          )}
        </div>

        <div>
          🎄<br/>
          31 декабря, 1, 2 и 3 января у Службы заботы Хантфлоу выходные. С 4 по 8 января мы будем помогать вам, но время ответа может быть увеличено до часа
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
          Написать в чат
        </button>

        {Boolean(widgetChannels.length) && (
          <div className="elixirchat-welcome-screen__channels">
            <div className="elixirchat-welcome-screen__channels-title">Поддержка в других каналах</div>
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
