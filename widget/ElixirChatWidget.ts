import { logEvent } from '../utilsSDK';
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

const isDev = true; // TODO: pass flag
let ElixirChat = window.ElixirChat;
if (isDev) {
  ElixirChat = require('../sdk').default;
}

export interface IElixirChatWidgetAppendWidgetConfig {
  container: HTMLElement;
  styles?: string;
}

export class ElixirChatWidget extends ElixirChat {

  public container: HTMLElement;
  public styles: string;

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
    this.injectIframeStyles(this.styles);
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

  public appendWidget = ({ container, styles = '' }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, styles }, 'error');
      return;
    }

    this.container = container;
    this.styles = styles;

    this.appendChatIframe();
    this.appendWidgetButton();

    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    this.widgetChatReactComponent = appendDefaultElixirChatWidget(iframeContainer, this);
    this.addendStyles();

    logEvent(this.debug, 'Appended ElixirChat default widget', { container })
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
