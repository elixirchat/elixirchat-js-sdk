import ElixirChat from '../src';
import { appendDefaultElixirChatWidget } from './DefaultWidget/DefaultWidget';
import { logEvent, insertElement } from '../utils';
import widgetGlobalStyles from './DefaultWidget/DefaultWidgetGlobalStyles';

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

  protected injectGlobalStyles(styles: string): void {
    if (styles) {
      insertElement('style', { innerHTML: styles, type: 'text/css' }, this.container);
    }
  }

  protected injectIframeStyles(styles: string): void {
    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    if (styles && iframeContainer) {
      let el = insertElement('style', { innerHTML: styles, type: 'text/css' }, iframeContainer);
    }
  }

  protected appendWidgetButton(): void {
    const button = insertElement('button', {
      innerText: 'Click me',
      className: 'elixirchat-widget-button',
    }, this.container);

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

  public toggleChatVisibility = (): void => {
    this.widgetIsVisible = !this.widgetIsVisible;
    this.widgetChatIframe.hidden = !this.widgetIsVisible;
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
    this.toggleChatVisibility(); // TODO: remove

    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    this.widgetChatReactComponent = appendDefaultElixirChatWidget(iframeContainer, this);

    this.injectGlobalStyles(widgetGlobalStyles);
    this.injectIframeStyles(this.styles);
  };
}
