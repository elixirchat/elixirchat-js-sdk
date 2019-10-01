import 'babel-polyfill';
import { logEvent } from '../utilsCommon';
import { renderWidgetReactComponent } from './DefaultWidget/Widget';

console.log('process.env.NODE_ENV 555', process, __dirname);
console.log('process.env.NODE_ENV 666', process.env);
console.log('process.env.NODE_ENV 777', process.env.NODE_ENV);
console.log('process.env.NODE_ENV 888 1', process.env.IS_BUILDING_STATIC);
console.log('----- yyy 222', process.env.IS_BUILDING_STATIC);

let ElixirChat = window.ElixirChat;
if (!window.ElixirChat) {
  window.__require = require;
  ElixirChat = require('../sdk').default;
  console.log('require ElixirChat', ElixirChat);
  // ElixirChat = require(__dirname + '/../sdk').default;
  // ElixirChat = require('/Users/egorvinogradov/elixir/elixirchat-promo/static/node_modules/elixirchat-js-sdk/sdk').default;
}
if (!ElixirChat) {
  logEvent(
    true,
    'Cannot find ElixirChat SDK. Are you sure you imported SDK (ether via "import" or via the <script/> tag)?\n' +
    'See: https://github.com/elixirchat/elixirchat-js-sdk#add-default-widget', {
      NODE_ENV: process.env.NODE_ENV
    }, 'error'
  );
}

export interface IElixirChatWidgetAppendWidgetConfig {
  container: HTMLElement;
  iframeStyles?: string;
  visibleByDefault?: boolean;
}

export class ElixirChatWidget extends ElixirChat {

  public container: HTMLElement;
  public iframeStyles: string;
  public visibleByDefault: boolean;

  public widgetUnreadCount: number;
  public widgetIsVisible: boolean = false;
  public widgetIsIFrameReady: boolean = false;
  public widgetIsIFrameContentMounted: boolean = false;

  public widgetChatReactComponent: any = {};
  public widgetIFrameDocument: Document = {};

  protected onToggleChatVisibilityCallbacks: Array<(isOpen: boolean) => void> = [];
  protected onSetUnreadCountCallbacks: Array<(count: boolean) => void> = [];
  protected onIFrameReadyCallbacks: Array<() => void> = [];
  protected onIFrameContentMountedCallbacks: Array<() => void> = [];

  public setUnreadCount = (count: number): void => {
    this.widgetUnreadCount = +count || 0;
    this.onSetUnreadCountCallbacks.forEach(callback => callback(this.widgetUnreadCount));
  };

  public onSetUnreadCount = (callback) => {
    this.onSetUnreadCountCallbacks.push(callback);
  };

  public toggleChatVisibility = async (): void => {
    this.widgetIsVisible = !this.widgetIsVisible;
    const callbacks = this.onToggleChatVisibilityCallbacks;
    for (let i = 0; i < callbacks.length; i++) {
      await callbacks[i](this.widgetIsVisible);
    }
  };

  public onToggleChatVisibility = (callback) => {
    this.onToggleChatVisibilityCallbacks.push(callback);
  };

  public setIFrameReady = async (iframeDocument): void => {
    this.widgetIsIFrameReady = true;
    this.widgetIFrameDocument = iframeDocument;

    const callbacks = this.onIFrameReadyCallbacks;
    for (let i = 0; i < callbacks.length; i++) {
      await callbacks[i]();
    }
  };

  public onIFrameReady = (callback) => {
    this.onIFrameReadyCallbacks.push(callback);
    if (this.widgetIsIFrameReady) {
      callback();
    }
  };

  public setIFrameContentMounted = async (): void => {
    this.widgetIsIFrameContentMounted = true;

    const callbacks = this.onIFrameContentMountedCallbacks;
    for (let i = 0; i < callbacks.length; i++) {
      await callbacks[i]();
    }
  };

  public onIFrameContentMounted = (callback) => {
    this.onIFrameContentMountedCallbacks.push(callback);
    if (this.widgetIsIFrameContentMounted) {
      callback();
    }
  };

  public appendWidget = async ({ container, iframeStyles = '', visibleByDefault = false }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, iframeStyles, visibleByDefault }, 'error');
      return;
    }

    this.container = container;
    this.iframeStyles = iframeStyles || '';
    this.visibleByDefault = visibleByDefault;
    this.widgetChatReactComponent = renderWidgetReactComponent(this.container, this);

    this.onIFrameReady(() => {
      if (this.visibleByDefault) {
        this.toggleChatVisibility();
      }
    });

    logEvent(this.debug, 'Appended ElixirChat default widget', { container });
    return this.widgetChatReactComponent;
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
