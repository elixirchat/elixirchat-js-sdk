import React, { Component, Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IJoinRoomChannel } from '../../sdk/ElixirChat';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { cn, _last } from '../../utilsCommon';
import {
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

class WelcomeScreenComponent extends Component<IWelcomeScreenProps, IWelcomeScreenState> {

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

  getMuteTooltipMessage = () => {
    const { widgetIsMuted } = this.state;
    return widgetIsMuted
      ? this.props.intl.formatMessage({ id: 'unmute' })
      : this.props.intl.formatMessage({ id: 'mute' });
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
        <Tooltip className="elixirchat-welcome-screen__mute-tooltip" title={this.getMuteTooltipMessage()}>
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
              <i className="elixirchat-welcome-screen__status-online"/>
              {' '}
              <FormattedMessage id="online" />
            </Fragment>
          )}
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
          <FormattedMessage id="message_us" />
        </button>

        {Boolean(widgetChannels.length) && (
          <div className="elixirchat-welcome-screen__channels">
            <div className="elixirchat-welcome-screen__channels-title">
              <FormattedMessage id="other_support_channels" />
            </div>
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

export const WelcomeScreen = injectIntl(WelcomeScreenComponent);
