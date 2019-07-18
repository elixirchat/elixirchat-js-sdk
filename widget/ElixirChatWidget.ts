import ElixirChat from '../src';
import { logEvent, insertElement } from '../utils';
import { appendDefaultElixirChatWidget } from './DefaultWidget/DefaultWidget';

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

  protected injectIframeStyles(styles: string): void {
    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    if (styles && iframeContainer) {
      insertElement('style', { innerHTML: styles, type: 'text/css' }, iframeContainer);
    }
  }

  protected appendWidgetButton(): void {
    const button = insertElement('button', {
      title: 'Open chat',
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
    setTimeout(() => { this.toggleChatVisibility(); }, 500); // TODO: remove

    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    this.widgetChatReactComponent = appendDefaultElixirChatWidget(iframeContainer, this);

    this.injectIframeStyles(this.styles);
  };
}
