import 'babel-polyfill';
import { getJSONFromLocalStorage, logEvent } from '../utilsCommon';
import { renderWidgetReactComponent } from './DefaultWidget/Widget';
import { IFontExtractorExtractParams } from './FontExtractor';
import {
  WIDGET_IFRAME_READY,
  WIDGET_MUTE, WIDGET_NAVIGATE_TO,
  WIDGET_POPUP_BLUR,
  WIDGET_POPUP_CLOSE,
  WIDGET_POPUP_FOCUS,
  WIDGET_POPUP_OPEN,
  WIDGET_POPUP_TOGGLE,
  WIDGET_RENDERED,
  WIDGET_UNMUTE,
} from './ElixirChatWidgetEventTypes';

import {
  MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS,
  JOINED_ROOM,
} from '../sdk/ElixirChatEventTypes';

let ElixirChat = window.ElixirChat;
if (!ElixirChat) {
  ElixirChat = require('../dist/sdk').default;
  /**
   * dist/sdk.js is generated on fly depending on the context:
   *
   *  - When developing SDK locally (npm run dev), dist/sdk.js exports sdk/ElixirChat.ts
   *    @see bin/dev.sh
   *
   *  - When building SDK locally (npm run build), dist/sdk.js is empty
   *    so that sdk.js is not included into default-widget.js bundle
   *    @see bin/build.sh
   *
   *  - When 'elixirchat-js-sdk' in being installed via npm in another project (npm install elixirchat-js-sdk),
   *    dist/sdk.js exports build/sdk.js so that sdk.js IS included into default-widget.js bundle
   *    and it'd be possible to use `import ElixirChatWidget from 'elixirchat-js-sdk/widget'`
   *    @see bin/postinstall.sh
   */
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
  hideDefaultButton?: boolean;
  supportEmail?: string;
  widgetTitle?: string;
  extractFontsFromParentWindow?: Array<IFontExtractorExtractParams>;
}

export class ElixirChatWidget extends ElixirChat {

  public container: HTMLElement;
  public iframeStyles: string;
  public extractFontsFromParentWindow: Array<IFontExtractorExtractParams>;
  public hideDefaultButton: boolean;
  public supportEmail: string;
  public widgetTitle: string = '';
  public defaultWidgetTitle: string = 'Служба поддержки';

  public defaultSupportEmail: string = 'support@elixir.chat';
  public isWidgetPopupOpen: boolean = false;
  public isWidgetPopupFocused: boolean = false;
  public isWidgetRendered: boolean = false;
  public isWidgetMuted: boolean = false;
  public isWidgetIFrameReady: boolean = false;

  public widgetReactComponent: any;
  public widgetIFrameWindow: Window = {};
  public widgetIFrameDocument: Document = {};
  public widgetDefaultView: string = 'welcome-screen';

  protected initializeWidget(): void {
    this.on(WIDGET_IFRAME_READY, (iframeWindow) => {
      this.isWidgetIFrameReady = true;
      this.widgetIFrameWindow = iframeWindow;
      this.widgetIFrameDocument = iframeWindow.document;

      this.widgetIFrameWindow.addEventListener('focus', () => {
        this.onToggleChatFocus(true);
      });
      this.widgetIFrameWindow.addEventListener('blur', () => {
        this.onToggleChatFocus(false);
      });
      const isWidgetMuted = getJSONFromLocalStorage('elixirchat-notifications-muted', false);
      if (isWidgetMuted) {
        this.toggleMute();
      }
      const isWidgetVisible = getJSONFromLocalStorage('elixirchat-widget-is-visible', false);
      if (isWidgetVisible && !this.isWidgetPopupOpen) {
        this.togglePopup();
      }
      this.setInitialWidgetView();
    });

    this.on(JOINED_ROOM, joinRoom => {
      if (this.shouldPopUp && !this.isWidgetPopupOpen) {
        this.togglePopup();
      }
      if (!this.widgetTitle) {
        this.widgetTitle = joinRoom.company.widgetTitle || this.defaultWidgetTitle;
      }
    });

    this.on(MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS, () => {
      this.isWidgetRendered = true;
      this.triggerEvent(WIDGET_RENDERED);
    });
  }

  public togglePopup = (): void => {
    this.isWidgetPopupOpen = !this.isWidgetPopupOpen;
    this.onToggleChatFocus(this.isWidgetPopupOpen);
    localStorage.setItem('elixirchat-widget-is-visible', JSON.stringify(this.isWidgetPopupOpen));

    logEvent(this.debug, (this.isWidgetPopupOpen ? 'Opened' : 'Closed') + ' widget popup');
    this.triggerEvent(WIDGET_POPUP_TOGGLE, this.isWidgetPopupOpen);
    this.triggerEvent(this.isWidgetPopupOpen ? WIDGET_POPUP_OPEN : WIDGET_POPUP_CLOSE);
  };

  public toggleMute = () => {
    this.isWidgetMuted = !this.isWidgetMuted;
    localStorage.setItem('elixirchat-notifications-muted', JSON.stringify(this.isWidgetMuted));
    logEvent(this.debug, (this.isWidgetMuted ? 'Muted' : 'Unmuted') + ' widget');
    this.triggerEvent(this.isWidgetMuted ? WIDGET_MUTE: WIDGET_UNMUTE);
  };

  protected onToggleChatFocus = (isFocused) => {
    if (isFocused !== this.isWidgetPopupFocused) {
      this.isWidgetPopupFocused = isFocused;
      this.triggerEvent(this.isWidgetPopupFocused ? WIDGET_POPUP_FOCUS: WIDGET_POPUP_BLUR);
    }
  };

  public navigateTo = (params) => {
    this.triggerEvent(WIDGET_NAVIGATE_TO, params);
    localStorage.setItem('elixirchat-current-view', params.view);
  };

  protected setInitialWidgetView(){
    const view = getJSONFromLocalStorage('elixirchat-current-view') || this.widgetDefaultView;
    this.navigateTo({ view, animation: null });
  };

  public appendWidget = async (config: IElixirChatWidgetAppendWidgetConfig): void => {
    const {
      container,
      iframeStyles,
      extractFontsFromParentWindow,
      hideDefaultButton,
      supportEmail,
      widgetTitle,
    } = config;

    if (!this.isInitialized) {
      const errorMessage = 'SDK has not been initialized yet';
      logEvent(this.debug, errorMessage, config, 'error');
      throw errorMessage;
    }
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, config, 'error');
      throw errorMessage;
    }
    if (typeof window !== 'undefined') {
      window.elixirChatWidget = this;
    }

    this.initializeWidget();

    this.container = container;
    this.iframeStyles = iframeStyles || '';
    this.extractFontsFromParentWindow = extractFontsFromParentWindow || [];
    this.hideDefaultButton = hideDefaultButton || false;
    this.supportEmail = supportEmail || this.defaultSupportEmail;
    if (widgetTitle) {
      this.widgetTitle = widgetTitle;
    }

    this.widgetReactComponent = renderWidgetReactComponent(this.container, this);

    logEvent(this.debug, 'Appended ElixirChat default widget', { container });
    return this.widgetReactComponent;
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
