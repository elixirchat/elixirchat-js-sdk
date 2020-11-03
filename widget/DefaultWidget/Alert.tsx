import React, { Component, Fragment } from 'react';
import { ERROR_ALERT } from '../../sdk/ElixirChatEventTypes';
import { i18n } from './i18n';
import { cn, normalizeErrorStack } from '../../utilsCommon';
import { exposeComponentToGlobalScope } from '../../utilsWidget';
import { extractErrorMessage } from '../../sdk/GraphQLClient';
import { FormattedMarkdown } from './FormattedMarkdown';

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
    elixirChatWidget.on(ERROR_ALERT, this.onAlertShow);
    exposeComponentToGlobalScope(this, elixirChatWidget);
  }

  onAlertShow = (alertData) => {
    const { elixirChatWidget } = this.props;
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
      elixirChatWidget.waitForPopupToOpen(this.setErrorBlockHeight);
    });
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
    const maxErrorDetailsLength = 300;
    const networkFailureKeys = [
      'Failed to fetch',
      'NetworkError when attempting to fetch resource'
    ];

    const networkFailureMessage = this.trimEachRow(i18n.alert_error_disconnected);
    for (let i = 0; i < networkFailureKeys.length; i++) {
      if ((error?.message || '').toLowerCase().includes( networkFailureKeys[i].toLowerCase() )) {
        return networkFailureMessage;
      }
    }
    const errorDetails = customMessage || extractErrorMessage(error);
    return errorDetails.slice(0, maxErrorDetailsLength) + (errorDetails.length > maxErrorDetailsLength ? '…' : '');
  };

  trimEachRow = (text) => {
    return text
      .trim()
      .split(/\n/)
      .map(row => row.trim())
      .join('\n');
  };

  generateEmailText = (alertData, errorDetails, errorStack) => {
    const { elixirChatWidget } = this.props;
    const { client: { firstName, lastName, id } } = elixirChatWidget;

    return this.trimEachRow(`${i18n.alert_email_intro}
      "${errorDetails}"

      ${i18n.alert_email_user_info_title}
      ${firstName} ${lastName} (ID: ${id})

      ${i18n.alert_email_debug_info_title}
      Error: ${alertData.customMessage || extractErrorMessage(alertData.error)}
      Timestamp: ${new Date().toString()}
      User-agent: ${navigator.userAgent}
      Screen: ${screen.availWidth}x${screen.availHeight}
      Device pixel ratio: ${devicePixelRatio}

      Stack trace:
      ${errorStack}`);
  };

  generateMailToHref = () => {
    const { elixirChatWidget } = this.props;
    const { emailText } = this.state;
    const subject = i18n.alert_email_subject;
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
              <h3 className="elixirchat-alert__header-title">{i18n.alert_title}</h3>
              <i className="elixirchat-alert__header-icon icon-close-thin"
                onClick={this.onCloseClick}/>
              <FormattedMarkdown
                className="elixirchat-alert__message"
                markdown={errorDetails}/>
              <div className="elixirchat-alert__button-block">
                <button className="elixirchat-alert__retry-button" onClick={this.onRetryClick}>
                  {i18n.alert_retry}
                </button>
                <span className="elixirchat-alert__expand-link" onClick={this.onExpandToEmailClick}>
                  {i18n.alert_contact_by_email}
                </span>
              </div>
            </Fragment>
          )}

          {isExpanded && (
            <Fragment>
              <h3 className="elixirchat-alert__header-title">{i18n.alert_email_title}</h3>
              <i className="elixirchat-alert__header-icon icon-close-thin"
                onClick={this.onCollapseClick}/>
              <textarea className="elixirchat-alert__error-text"
                value={emailText}
                onChange={e => this.setState({ emailText: e.target.value })}/>
              <a className="elixirchat-alert__send-email-button"
                href={this.generateMailToHref()}
                target="_blank">
                {i18n.alert_email_send_caption} {elixirChatWidget.widgetSupportEmail}
              </a>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
