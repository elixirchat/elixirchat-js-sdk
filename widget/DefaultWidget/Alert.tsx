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
    isExpanded: false,
    emailText: '',
    message: '',
    stack: '',
    rawError: null,
    retryCallback: null,
  };

  messageBlock = React.createRef();

  // TODO: remove
  __set_test_data = () => {
    this.onAlertShow({
      // error: { message: 'Failed to fetch lololo', toString: () => 'Failed to fetch lololo' },
      error: { message: '{"errors":[{"message":"Dataloader.GetError","stack":"[{Dataloader, :do_get, 2, [file: \'lib/dataloader.ex\', line: 198]}, {Absinthe.Resolution.Helpers, :\\"-do_dataloader/5-fun-0-\\", 6, [file: \'lib/absinthe/resolution/helpers.ex\', line: 359]}, {Absinthe.Middleware.Dataloader, :get_result, 2, [file: \'lib/absinthe/middleware/dataloader.ex\', line: 37]}, {Absinthe.Phase.Document.Execution.Resolution, :reduce_resolution, 1, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 230]}, {Absinthe.Phase.Document.Execution.Resolution, :do_resolve_field, 3, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 185]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_results, 6, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 114]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_result, 5, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 93]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_results, 6, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 114]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_result, 5, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 93]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_results, 6, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 114]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_result, 5, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 103]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_results, 6, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 114]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_result, 5, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 93]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_results, 6, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 114]}, {Absinthe.Phase.Document.Execution.Resolution, :walk_result, 5, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 93]}, {Absinthe.Phase.Document.Execution.Resolution, :perform_resolution, 3, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 67]}, {Absinthe.Phase.Document.Execution.Resolution, :resolve_current, 3, [file: \'lib/absinthe/phase/document/execution/resolution.ex\', line: 24]}, {Absinthe.Pipeline, :run_phase, 3, [file: \'lib/absinthe/pipeline.ex\', line: 368]}, {Absinthe.Plug, :run_query, 4, [file: \'lib/absinthe/plug.ex\', line: 445]}, {Absinthe.Plug, :call, 2, [file: \'lib/absinthe/plug.ex\', line: 258]}]","status":500}]}', toString: () => 'Failed to fetch lololo' },
      retryCallback: () => {
        console.log('test retry');
        setTimeout(() => {
          this.__set_test_data();
        }, 500);
      },
    });
  };

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

    const { error, retryCallback } = alertData || {};
    const message = this.generateErrorMessage(alertData);
    const stack = normalizeErrorStack(new Error().stack, 18);
    const emailText = this.generateEmailText(error, message, stack);
    this.setState({
      isOpen: true,
      message,
      stack,
      error,
      emailText,
      retryCallback,
    }, () => {
        this.messageBlock.current.style.height = this.messageBlock.current.offsetHeight + 'px';
      requestAnimationFrame(() => {
      });
    });
  };

  generateErrorMessage = (data) => {
    const { customMessage, error } = data || {};
    const networkFailureKeys = [
      'Failed to fetch',
      'NetworkError when attempting to fetch resource'
    ];
    const networkFailureMessage = 'Не удается связаться с сервером.\n Убедитесь, что у вас хорошее интернет-соединение, и ваша сеть не блокирует запросы к серверу.';
    for (let i = 0; i < networkFailureKeys.length; i++) {
      if (error.message.toLowerCase().includes( networkFailureKeys[i].toLowerCase() )) {
        return networkFailureMessage;
      }
    }
    return customMessage || getErrorMessageFromResponse(error);
  };

  generateEmailText = (error, message, stack) => {
    const { elixirChatWidget } = this.props;
    const { client: { firstName, lastName, id } } = elixirChatWidget;

    return trimEachRow(`Чат поддержки не загружается. Появляется сообщение:
      «${message}»

      Мои данные:
      ${firstName} ${lastName} (ID: ${id})

      Технические данные:
      Error: ${error?.toString?.() || ''}
      User-agent: ${navigator.userAgent}
      Screen: ${screen.availWidth}x${screen.availHeight}
      Device pixel ratio: ${devicePixelRatio}

      Трассировка стека:
      ${stack}`);
  };

  generateMailToHref = () => {
    const { elixirChatWidget } = this.props;
    const { emailText } = this.state;
    const subject = 'Ошибка в чате поддержки';
    return `mailto:${elixirChatWidget.widgetSupportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText)}`;
  };

  onRetryClick = () => {
    const { retryCallback } = this.state;
    if (retryCallback) {
      this.setState({ isOpen: false });
      setTimeout(retryCallback, 500);
    }
  };

  onCloseClick = () => {
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
    const { message, emailText, isExpanded, isOpen } = this.state;

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
                {message.slice(0, 300)}{message.length > 300 ? '…' : ''}
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
