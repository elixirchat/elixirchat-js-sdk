import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { JOIN_ROOM_SUCCESS, UNREAD_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { WIDGET_DATA_SET } from '../ElixirChatWidgetEventTypes';
import {exposeComponentToGlobalScope, humanizeTimezoneName, humanizeUpcomingDate} from '../../utilsWidget';

export interface IWelcomeScreenProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWelcomeScreenState {
  employeeAvatars: Array<{ url: string, initials: string }>,
}

export class WelcomeScreen extends Component<IWelcomeScreenProps, IWelcomeScreenState> {

  state = {
    preview: {},
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
        joinRoomData,
        widgetMainTitle,
        widgetChatSubtitle,
        widgetChannels,
        widgetCompanyLogoUrl,
        onlineStatus,
        unreadMessagesCount,
      } = elixirChatWidget;

      const { employeeAvatars, employeesCount } = this.generateEmployeeList(joinRoomData);

      this.setState({
        employeeAvatars,
        employeesCount,
        widgetMainTitle,
        widgetChatSubtitle,
        widgetCompanyLogoUrl,
        widgetChannels,
        onlineStatus,
        unreadMessagesCount,
      });
    });
    elixirChatWidget.on(UNREAD_MESSAGES_CHANGE, unreadMessagesCount => {
      this.setState({ unreadMessagesCount });
    });
  }

  componentWillUnmount() {
    const { elixirChatWidget } = this.props;
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
    const { elixirChatWidget } = this.props;
    const base = employee.firstName || employee.id || '';
    const initial = base.replace(/[^a-zа-я]/ig, '')[0];
    return (initial || elixirChatWidget.widgetMainTitle[0]).toUpperCase();
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

    let company_logo = 'https://omnichannel-mock.surge.sh/huntflow-logo.png';

    let __mock_operator_avatars = [
      'https://omnichannel-mock.surge.sh/operator-1.png',
      'https://omnichannel-mock.surge.sh/operator-2.png',
      'https://omnichannel-mock.surge.sh/operator-3.png',
      'https://omnichannel-mock.surge.sh/operator-4.png',
      'https://omnichannel-mock.surge.sh/operator-5.png',
    ];

    let __mock_messengers = [
      { name: 'whatsapp', url: 'https://web.whatsapp.com/send?phone=74950884514&text=%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D0%BD%D0%B5%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D1%8F%D1%8F%20%D1%8D%D1%82%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'telegram', url: 'http://t-do.ru/TextBackSupportBot?start=start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'facebook', url: 'https://www.facebook.com/messages/textback.io' },
      { name: 'vk', url: 'https://vk.me/textback?ref=start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'viber', url: 'viber://pa?chatURI=TextBack&context=start_chat_9987ef6c-5b10-1d23-ec14-017426db6e0b' },
      { name: 'skype', url: 'skype://live:feedback6_2?chat' },
    ];

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
            {Boolean(visibleUnreadMessagesCount) && (
              <Fragment>
                Прочитать пропущенные
                <span className="elixirchat-welcome-screen-operators__button-counter">
                  {visibleUnreadMessagesCount}
                </span>
              </Fragment>
            )}
            {!Boolean(visibleUnreadMessagesCount) && (
              <Fragment>Написать в поддержку</Fragment>
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
