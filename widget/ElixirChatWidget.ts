import { logEvent } from '../utilsCommon';
import {
  insertElement,
  parseCssVariables,
  replaceCssVariables,
  generateFontFaceRule,
  areCssVariablesSupported,
} from '../utilsWidget';
import { appendDefaultElixirChatWidget } from './DefaultWidget/DefaultWidget';
import { assetsBase64, globalAssetUrlCssVars, iframeAssetUrlCssVars } from './DefaultWidget/assets';
import { DefaultWidgetGlobalStyles } from './DefaultWidget/styles';

let ElixirChat = window.ElixirChat;
if (process.env.NODE_ENV === 'development') {
  ElixirChat = require('../sdk').default;
}
if (!ElixirChat) {
  logEvent(
    true,
    'Cannot find ElixirChat SDK. Are you sure you imported SDK (ether via "import" or via the <script/> tag)?\n' +
    'See: https://github.com/elixirchat/elixirchat-widget#add-default-widget', {
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

  public widgetIsVisible: boolean = false;
  public widgetChatReactComponent: any = {};
  public widgetChatIframe: HTMLIFrameElement;
  public widgetButton: HTMLElement;

  protected onToggleChatVisibilityCallbacks: Array<(isOpen: boolean) => void> = [];

  protected injectGlobalStyles(styles: string): void {
    let cssCode = styles;
    if (!areCssVariablesSupported()) {
      cssCode = replaceCssVariables(styles, parseCssVariables(globalAssetUrlCssVars));
    }
    insertElement('style', { innerHTML: cssCode, type: 'text/css' }, this.container);
  }

  protected injectIframeStyles(styles: string): void {
    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    let cssCode = styles;
    if (!areCssVariablesSupported()) {
      cssCode = replaceCssVariables(styles, parseCssVariables(iframeAssetUrlCssVars));
    }
    insertElement('style', { innerHTML: cssCode, type: 'text/css' }, iframeContainer);
  }

  protected appendWidgetButton(): void {
    const button = insertElement('button', { className: 'elixirchat-widget-button' }, this.container);
    button.addEventListener('click', this.toggleChatVisibility);
    if (this.widgetButton) {
      this.widgetButton.remove();
    }
    this.widgetButton = button;
  }

  protected appendChatIframe(): void {
    const iframe = <HTMLIFrameElement>insertElement('iframe', {
      hidden: true,
      className: 'elixirchat-widget-iframe',
    }, this.container);

    iframe.contentWindow.document.body.appendChild(insertElement('main'));
    if (this.widgetChatIframe) {
      this.widgetChatIframe.remove();
    }
    this.widgetChatIframe = iframe;
  }

  protected addendStyles(): void {
    this.injectGlobalStyles(DefaultWidgetGlobalStyles, this.container);
    this.injectGlobalStyles(globalAssetUrlCssVars, this.container);

    this.injectIframeStyles([
      generateFontFaceRule('Graphik', 'normal', assetsBase64.GraphikRegularWeb),
      generateFontFaceRule('Graphik', 'bold', assetsBase64.GraphikBoldWeb)
    ].join('\n'));
    this.injectIframeStyles(this.iframeStyles);
    this.injectIframeStyles(iframeAssetUrlCssVars);
  }

  public toggleChatVisibility = (): void => {
    const iframeClassNameOpening = 'elixirchat-widget-iframe--opening';
    const buttonClassNameVisible = 'elixirchat-widget-button--visible';
    this.widgetIsVisible = !this.widgetIsVisible;
    this.widgetChatIframe.hidden = !this.widgetIsVisible;
    if (this.widgetIsVisible) {
      this.widgetButton.classList.add(buttonClassNameVisible);
      this.widgetChatIframe.classList.add(iframeClassNameOpening);
      setTimeout(() => {
        this.widgetChatIframe.classList.remove(iframeClassNameOpening);
      }, 0);
    }
    else {
      this.widgetButton.classList.remove(buttonClassNameVisible);
    }
    this.onToggleChatVisibilityCallbacks.forEach(callback => callback(this.widgetIsVisible));
  };

  public onToggleChatVisibility = (callback) => {
    this.onToggleChatVisibilityCallbacks.push(callback);
  };

  public appendWidget = ({ container, iframeStyles = '', visibleByDefault = false }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, iframeStyles }, 'error');
      return;
    }

    this.container = container;
    this.iframeStyles = iframeStyles;
    this.visibleByDefault = visibleByDefault;

    this.appendChatIframe();
    this.appendWidgetButton();

    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    this.widgetChatReactComponent = appendDefaultElixirChatWidget(iframeContainer, this);
    this.addendStyles();

    if (this.visibleByDefault) {
      this.toggleChatVisibility();
    }

    logEvent(this.debug, 'Appended ElixirChat default widget', { container })
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
