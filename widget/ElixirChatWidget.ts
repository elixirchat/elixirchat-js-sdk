import 'babel-polyfill';
import { logEvent } from '../utilsCommon';
import { renderWidgetReactComponent } from './DefaultWidget/Widget';

let ElixirChat = window.ElixirChat;
if (process.env.NODE_ENV === 'development') {
  ElixirChat = require('../sdk').default;
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

  public widgetChatReactComponent: any = {};
  public widgetIFrameDocument: Document = {};

  protected onToggleChatVisibilityCallbacks: Array<(isOpen: boolean) => void> = [];
  protected onSetUnreadCountCallbacks: Array<(count: boolean) => void> = [];

  public setUnreadCount = (count: number): void => {
    this.widgetUnreadCount = +count || 0;
    this.onSetUnreadCountCallbacks.forEach(callback => callback(this.widgetUnreadCount));
  };

  public onSetUnreadCount = (callback) => {
    this.onSetUnreadCountCallbacks.push(callback);
  };

  public toggleChatVisibility = (params: { isSilent: boolean } = {}): void => {
    this.widgetIsVisible = !this.widgetIsVisible;
    this.onToggleChatVisibilityCallbacks.forEach(callback => callback(this.widgetIsVisible, params.isSilent));
  };

  public onToggleChatVisibility = (callback) => {
    this.onToggleChatVisibilityCallbacks.push(callback);
  };

  public appendWidget = async ({ container, iframeStyles = '', visibleByDefault = false }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, iframeStyles }, 'error');
      return;
    }

    this.container = container;
    this.visibleByDefault = visibleByDefault;
    this.widgetChatReactComponent = renderWidgetReactComponent(this.container, this);
    this.iframeStyles = iframeStyles || '';

    if (this.visibleByDefault) {
      this.toggleChatVisibility();
    }

    logEvent(this.debug, 'Appended ElixirChat default widget', { container });
    return this.widgetChatReactComponent;
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
