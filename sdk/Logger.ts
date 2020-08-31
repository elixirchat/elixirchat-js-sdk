import * as Sentry from '@sentry/browser';
import { ElixirChat, IElixirChatUser } from './ElixirChat';

export class Logger {

  private elixirChat: ElixirChat;

  public isDebug: boolean = false;
  public isSentryInitialized: boolean = false;
  public scopeClient: IElixirChatUser = {};
  public nodeEnv: string;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    const { sentryUrl, apiUrl, debug } = elixirChat.config;

    this.elixirChat = elixirChat;
    this.isDebug = debug;
    this.nodeEnv = process.env.NODE_ENV;

    if (sentryUrl && debug && this.nodeEnv !== 'development') {
      const host = new URL(apiUrl).host;
      Sentry.init({ dsn: sentryUrl });
      Sentry.configureScope(scope => {
        scope.setExtra('hostname', host);
      });
      this.isSentryInitialized = true;
    }
  }

  private sendErrorToSentry(message: string, data?: any): void {
    // TODO: squeeze large data before sending
    // TODO: send in chunks on interval, not immediately (use window.requestIdleCallback()?)
    if (this.isSentryInitialized) {
      Sentry.withScope(scope => {
        scope.setExtras(data);
        Sentry.captureMessage(message);
      });
    }
  };

  private getTimestamp(): string {
    const now = new Date();
    return [
      now.getHours().toString().padStart(2, '0'),
      now.getMinutes().toString().padStart(2, '0'),
      now.getSeconds().toString().padStart(2, '0'),
    ].join(':');
  };

  private writeConsoleMessage(message: string, data: any, color: string = ''): void {
    const messageConsoleStyle = `font-weight: bold; color: ${color};`;
    const infoButtonConsoleStyle = `font-weight: normal; text-decoration: underline; color: ${color};`;
    const arrowConsoleStyle = `font: 10px Arial; padding-left: 3px; color: ${color};`;
    const additionalDataConsoleStyle = `font-weight: bold;`;

    console.groupCollapsed(`%c${this.getTimestamp()} ${message} %cInfo%c▾`, messageConsoleStyle, infoButtonConsoleStyle, arrowConsoleStyle);

    if (data && typeof data === 'object' && !(data instanceof Array)) {
      for (let key in data) {
        console.log(`%c${key}:\n`, additionalDataConsoleStyle, data[key], '\n');
      }
    }
    else {
      console.log('%c\nData:\n', additionalDataConsoleStyle, data);
    }
    console.log('%c\nStacktrace:', additionalDataConsoleStyle);
    console.trace();
    console.groupEnd();
  };

  public logInfo = (text: string, data?: any): void => {
    if (this.isDebug) {
      this.writeConsoleMessage(text, data);
    }
  };

  public logError = (text: string, data?: any): void => {
    if (this.isDebug) {
      this.sendErrorToSentry(text, data);
      this.writeConsoleMessage(text, data, '#EB3223');
    }
  };

  public logEvent = (text: string, data?: any): void => {
    if (this.isDebug) {
      const isErrorEvent = /_ERROR$/i.test(text);
      if (isErrorEvent) {
        this.sendErrorToSentry(text, data);
      }
      this.writeConsoleMessage(text, data, isErrorEvent ? '#EBA4A7' : '#5EE9EB');
    }
  };

  public setClient = (client: IElixirChatUser): void => {
    this.scopeClient = client;

    if (this.isSentryInitialized) {
      const clientUsername = [client.firstName, client.lastName].filter(word => word).join(' ');

      Sentry.configureScope(scope => {
        scope.setUser({
          id: client.id,
          username: clientUsername,
        });
      });
    }
  };
}
