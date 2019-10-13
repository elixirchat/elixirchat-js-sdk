import 'babel-polyfill';
import { getJSONFromLocalStorage, logEvent } from '../utilsCommon';
import { renderWidgetReactComponent } from './DefaultWidget/Widget';
import { IFontExtractorExtractParams } from './FontExtractor';
import {
  WIDGET_IFRAME_READY, WIDGET_POPUP_BLUR,
  WIDGET_POPUP_CLOSE, WIDGET_POPUP_FOCUS,
  WIDGET_POPUP_OPEN,
  WIDGET_POPUP_TOGGLE,
  WIDGET_RENDERED,
} from './ElixirChatWidgetEventTypes';
import {
  MESSAGES_FETCH_HISTORY_ERROR,
  MESSAGES_FETCH_HISTORY_SUCCESS,
  MESSAGES_HISTORY_SET
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
  extractFontsFromParentWindow?: Array<IFontExtractorExtractParams>;
}

export class ElixirChatWidget extends ElixirChat {

  public container: HTMLElement;
  public iframeStyles: string;
  public extractFontsFromParentWindow: Array<IFontExtractorExtractParams>;

  public isWidgetPopupOpen: boolean = false;
  public isWidgetIFrameReady: boolean = false;
  public isWidgetRendered: boolean = false;
  public isWidgetPopupFocused: boolean = false;

  public widgetReactComponent: any;
  public widgetIFrameWindow: Window = {};
  public widgetIFrameDocument: Document = {};

  public togglePopup = (): void => {
    this.isWidgetPopupOpen = !this.isWidgetPopupOpen;
    this.onToggleChatFocus(this.isWidgetPopupOpen);
    localStorage.setItem('elixirchat-widget-is-visible', JSON.stringify(this.isWidgetPopupOpen));

    logEvent(this.debug, (this.isWidgetPopupOpen ? 'Opened' : 'Closed') + ' widget popup');
    this.triggerEvent(WIDGET_POPUP_TOGGLE, this.isWidgetPopupOpen);
    this.triggerEvent(this.isWidgetPopupOpen ? WIDGET_POPUP_OPEN : WIDGET_POPUP_CLOSE);
  };

  protected onToggleChatFocus = (isFocused) => {
    if (isFocused !== this.isWidgetPopupFocused) {
      this.isWidgetPopupFocused = isFocused;
      if (this.isWidgetPopupFocused) {
        this.triggerEvent(WIDGET_POPUP_FOCUS);
      }
      else {
        this.triggerEvent(WIDGET_POPUP_BLUR);
      }
    }
  };

  public appendWidget = async ({ container, iframeStyles, extractFontsFromParentWindow }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, iframeStyles, extractFontsFromParentWindow }, 'error');
      return;
    }

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

      const isWidgetVisible = getJSONFromLocalStorage('elixirchat-widget-is-visible', false);
      if (isWidgetVisible) {
        this.togglePopup();
      }
    });

    this.on([MESSAGES_HISTORY_SET, MESSAGES_FETCH_HISTORY_ERROR], () => {
      this.isWidgetRendered = true;
      this.triggerEvent(WIDGET_RENDERED);
    });

    this.container = container;
    this.iframeStyles = iframeStyles || '';
    this.extractFontsFromParentWindow = extractFontsFromParentWindow || [];
    this.widgetReactComponent = renderWidgetReactComponent(this.container, this);

    logEvent(this.debug, 'Appended ElixirChat default widget', { container });
    return this.widgetReactComponent;
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
