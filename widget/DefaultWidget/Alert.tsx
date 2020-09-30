import React, { Component, Fragment } from 'react';
import { ERROR_ALERT_SHOW } from '../../sdk/ElixirChatEventTypes';
import { WIDGET_POPUP_OPEN } from '../ElixirChatWidgetEventTypes';
import { cn, normalizeErrorStack } from '../../utilsCommon';
import { exposeComponentToGlobalScope } from '../../utilsWidget';
import { extractErrorMessage } from '../../sdk/GraphQLClient';

export interface IDefaultWidgetAlertProps {
  elixirChatWidget: any;
}

export interface IDefaultWidgetAlertState {}

export class Alert extends Component<IDefaultWidgetAlertProps, IDefaultWidgetAlertState> {

  state = {
    isOpen: false,
    isExpanded: false,
    emailText: '',
    errorDetails: '',
    errorStack: '',
    alertData: {},
  };

  messageBlock = React.createRef();

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.on(ERROR_ALERT_SHOW, this.onAlertShow);
    exposeComponentToGlobalScope('Alert', this, elixirChatWidget);
  }

  onAlertShow = (alertData) => {
    const { isOpen } = this.state;
    if (isOpen) {
      return;
    }

    const errorStack = normalizeErrorStack(new Error().stack, 18);
    const errorDetails = this.generateErrorDetails(alertData);
    const emailText = this.generateEmailText(alertData, errorDetails, errorStack);
    this.setState({
      isOpen: true,
      errorDetails,
      errorStack,
      emailText,
      alertData,
    }, () => {
      this.waitForPopupToOpen(this.setErrorBlockHeight);
    });
  };

  waitForPopupToOpen = (callback) => {
    const { elixirChatWidget } = this.props;
    if (elixirChatWidget.widgetIsPopupOpen) {
      callback();
    }
    else {
      elixirChatWidget.on(WIDGET_POPUP_OPEN, callback);
    }
  };

  setErrorBlockHeight = () => {
    // Needed for CSS height transition to work
    const { isOpen } = this.state;
    if (isOpen) {
      requestAnimationFrame(() => {
        try {
          this.messageBlock.current.style.height = this.messageBlock.current.offsetHeight + 'px';
        }
        catch (e) {}
      });
    }
  };

  resetErrorBlockHeight = () => {
    try {
      this.messageBlock.current.style.height = 'auto';
    }
    catch (e) {}
  };

  generateErrorDetails = (alertData) => {
    const { customMessage, error } = alertData || {};
    const networkFailureKeys = [
      'Failed to fetch',
      'NetworkError when attempting to fetch resource'
    ];
    const networkFailureMessage = 'Не удается связаться с сервером.\n Убедитесь, что у вас хорошее интернет-соединение, и ваша сеть не блокирует запросы к серверу.';
    for (let i = 0; i < networkFailureKeys.length; i++) {
      if ((error?.message || '').toLowerCase().includes( networkFailureKeys[i].toLowerCase() )) {
        return networkFailureMessage;
      }
    }
    return customMessage || extractErrorMessage(error);
  };

  trimEachRow = (text) => {
    return text
      .split(/\n/)
      .map(row => row.trim())
      .join('\n');
  };

  generateEmailText = (alertData, errorDetails, errorStack) => {
    const { elixirChatWidget } = this.props;
    const { client: { firstName, lastName, id } } = elixirChatWidget;

    return this.trimEachRow(`Чат поддержки не загружается. Появляется сообщение:
      «${errorDetails}»

      Мои данные:
      ${firstName} ${lastName} (ID: ${id})

      Технические данные:
      Error: ${alertData.customMessage || extractErrorMessage(alertData.error)}
      Timestamp: ${new Date().toString()}
      User-agent: ${navigator.userAgent}
      Screen: ${screen.availWidth}x${screen.availHeight}
      Device pixel ratio: ${devicePixelRatio}

      Трассировка стека:
      ${errorStack}`);
  };

  generateMailToHref = () => {
    const { elixirChatWidget } = this.props;
    const { emailText } = this.state;
    const subject = 'Ошибка в чате поддержки';
    return `mailto:${elixirChatWidget.widgetSupportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText)}`;
  };

  onRetryClick = () => {
    const { alertData } = this.state;
    if (alertData.retryCallback) {
      this.resetErrorBlockHeight();
      this.setState({ isOpen: false });
      alertData.retryCallback();
    }
  };

  onCloseClick = () => {
    this.resetErrorBlockHeight();
    this.setState({
      isOpen: false,
      isExpanded: false,
    });
  };

  onCollapseClick = () => {
    this.setState({ isExpanded: false });
  };

  onExpandToEmailClick = () => {
    this.setState({ isExpanded: true });
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      emailText,
      errorDetails,
      isExpanded,
      isOpen,
    } = this.state;

    return (
      <div className={cn({
        'elixirchat-alert': true,
        'elixirchat-alert--open': isOpen,
        'elixirchat-alert--expanded': isExpanded,
      })}>
        <span className="elixirchat-alert__background"/>
        <div className="elixirchat-alert__block" ref={this.messageBlock}>
          {!isExpanded && (
            <Fragment>
              <h3 className="elixirchat-alert__header-title">Ошибка</h3>
              <i className="elixirchat-alert__header-icon icon-close-thin"
                onClick={this.onCloseClick}/>
              <span className="elixirchat-alert__message">
                {errorDetails.slice(0, 300)}{errorDetails.length > 300 ? '…' : ''}
              </span>
              <div className="elixirchat-alert__button-block">
                <button className="elixirchat-alert__retry-button" onClick={this.onRetryClick}>
                  Попробовать еще раз
                </button>
                <span className="elixirchat-alert__expand-link" onClick={this.onExpandToEmailClick}>
                  Связаться по email
                </span>
              </div>
            </Fragment>
          )}

          {isExpanded && (
            <Fragment>
              <h3 className="elixirchat-alert__header-title">Сообщение об ошибке</h3>
              <i className="elixirchat-alert__header-icon icon-close-thin"
                onClick={this.onCollapseClick}/>
              <textarea className="elixirchat-alert__error-text"
                value={emailText}
                onChange={e => this.setState({ emailText: e.target.value })}/>
              <a className="elixirchat-alert__send-email-button"
                href={this.generateMailToHref()}
                target="_blank">
                Отправить на {elixirChatWidget.widgetSupportEmail}
              </a>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
