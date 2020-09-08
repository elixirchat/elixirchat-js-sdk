import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import {
  // ERROR_ALERT_HIDE,
  ERROR_ALERT_SHOW, ONLINE_STATUS_CHANGE} from '../../sdk/ElixirChatEventTypes';
import {WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE} from '../ElixirChatWidgetEventTypes';
import { ChatMessages } from './ChatMessages';
import { ChatTextarea } from './ChatTextarea';
import { IOnlineStatusParams } from '../../sdk/OnlineStatusSubscription';
import { exposeComponentToGlobalScope } from '../../utilsWidget';
import {getErrorMessageFromResponse} from '../../sdk/GraphQLClient';
import {normalizeErrorStack, trimEachRow} from '../../utilsCommon';

export interface IDefaultWidgetAlertProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetAlertState {

}

export class Alert extends Component<IDefaultWidgetAlertProps, IDefaultWidgetAlertState> {

  state = {
    isOpen: false,
    isOpeningAnimation: false,
    isExpanded: false,
    emailText: '',
    errorMessage: '',
    errorStack: '',
    rawError: null,
    retryCallback: null,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.on(ERROR_ALERT_SHOW, data => {
      const { customMessage, error, retryCallback } = data || {};
      this.setState({
        isOpen: true,
        errorMessage: customMessage || getErrorMessageFromResponse(error),
        errorStack: normalizeErrorStack(new Error().stack, 18),
        rawError: error,
        retryCallback,
      });
    });
  }

  generateMailToHref = () => {
    const { elixirChatWidget } = this.props;
    const { errorMessage, errorStack, rawError } = this.state;
    const { client: { firstName, lastName, id } } = elixirChatWidget;
    const subject = 'Ошибка в чате поддержки';

    const body = trimEachRow(`Чат поддержки не загружается. Появляется сообщение:
      «${errorMessage}»
      
      Мои данные:
      ${firstName} ${lastName} (ID: ${id})
      
      Технические данные ошибки:
      ${rawError?.toString?.() || 'Could not invoke toString() method of rawError'}
      User-agent: ${navigator.userAgent}
      Screen: ${screen.availWidth}x${screen.availHeight}
      Device pixel ratio: ${devicePixelRatio}

      Трассировка стека:
      ${errorStack}
    `);
    return `mailto:${elixirChatWidget.widgetSupportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  onCloseClick = () => {
    this.setState({ isOpen: false });
  };

  onCollapseClick = () => {

  };

  onRetryClick = () => {
    const { retryCallback } = this.state;
    if (retryCallback) {
      retryCallback();
      this.setState({ isOpen: false });
    }
  };

  onExpandToEmailClick = () => {};

  render() {
    const { elixirChatWidget } = this.props;
    const { errorMessage, emailText, isExpanded } = this.state;

    return (
      <div className="elixirchat-alert">
        {isExpanded && (
          <Fragment>
            <div className="elixirchat-alert__header">
              <h3 className="elixirchat-alert__header-title">Ошибка</h3>
              <span className="elixirchat-alert__header-button">
                <i className="elixirchat-alert__header-icon icon-close-thin" onClick={this.onCloseClick}/>
              </span>
            </div>
            {errorMessage}
            <div>
              <button className="elixirchat-alert__" onClick={this.onRetryClick}>
                <i className="icon-close-thin"/>
                Еще раз
              </button>
              <button className="elixirchat-alert__" onClick={this.onExpandToEmailClick}>
                Связаться по email
              </button>
            </div>
          </Fragment>
        )}

        {!isExpanded && (
          <Fragment>
            <div className="elixirchat-alert__header">
              <h3 className="elixirchat-alert__header-title">Сообщение об ошибке</h3>
              <span className="elixirchat-alert__header-button">
                <i className="elixirchat-alert__header-icon icon-close-thin" onClick={this.onCollapseClick}/>
              </span>
            </div>
            <textarea className="elixirchat-alert__"
              value={emailText}
              onChange={e => this.setState({ emailText: e.target.value })}/>
            <a className="elixirchat-alert__"
              href={this.generateMailToHref()}
              target="_blank">
              Написать на {elixirChatWidget.widgetSupportEmail}
            </a>
          </Fragment>
        )}
      </div>
    );
  }
}
