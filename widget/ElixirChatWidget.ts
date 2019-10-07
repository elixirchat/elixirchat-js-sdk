import 'babel-polyfill';
import { logEvent } from '../utilsCommon';
import { renderWidgetReactComponent } from './DefaultWidget/Widget';
import { IFontExtractorExtractParams } from './FontExtractor';

let ElixirChat = window.ElixirChat;
if (!ElixirChat) {
  ElixirChat = require('../dist/sdk').default;
  /**
   * dist/sdk.js is generated on fly depending on the context:
   *
   *  - When developing SDK locally, dist/sdk.js exports sdk/ElixirChat.ts
   *  @see bin/dev.sh
   *
   *  - When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
   *  @see bin/build.sh
   *
   *  - When 'elixirchat-js-sdk' in being installed via npm in another project, dist/sdk.js exports build/sdk.js
   *  so that it'd be possible to use `import ElixirChatWidget from 'elixirchat-js-sdk/widget'`
   *  @see bin/postinstall.sh
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

  public widgetIsVisible: boolean = false;
  public widgetIsIFrameReady: boolean = false;
  public widgetIsIFrameContentMounted: boolean = false;

  public widgetChatReactComponent: any = {};
  public widgetIFrameDocument: Document = {};

  protected onToggleChatVisibilityCallbacks: Array<(isOpen: boolean) => void> = [];
  protected onIFrameReadyCallbacks: Array<() => void> = [];
  protected onIFrameContentMountedCallbacks: Array<() => void> = [];

  public toggleChatVisibility = async (): void => {
    this.widgetIsVisible = !this.widgetIsVisible;
    const callbacks = this.onToggleChatVisibilityCallbacks;
    for (let i = 0; i < callbacks.length; i++) {
      await callbacks[i](this.widgetIsVisible);
    }
    localStorage.setItem('elixirchat-widget-is-visible', JSON.stringify(this.widgetIsVisible));
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

  public appendWidget = async ({ container, iframeStyles, extractFontsFromParentWindow }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, iframeStyles, extractFontsFromParentWindow }, 'error');
      return;
    }

    this.container = container;
    this.iframeStyles = iframeStyles || '';
    this.extractFontsFromParentWindow = extractFontsFromParentWindow || [];
    this.widgetChatReactComponent = renderWidgetReactComponent(this.container, this);

    this.onIFrameReady(() => {
      let isWidgetVisible = false;
      try {
        isWidgetVisible = JSON.parse(localStorage.getItem('elixirchat-widget-is-visible'));
      }
      catch (e) {}
      if (isWidgetVisible) {
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
