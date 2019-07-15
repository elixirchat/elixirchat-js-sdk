import ElixirChat from '../src';
import { appendDefaultElixirChatWidget } from './DefaultElixirChatWidget.jsx';
import { logEvent } from '../utils';

export interface IElixirChatWidgetAppendWidgetConfig {
  container: HTMLElement;
  styles?: string;
}

export class ElixirChatWidget extends ElixirChat {

  widgetIsVisible: boolean = false;
  widgetComponent: any = {};
  widgetIframe: HTMLIFrameElement;
  widgetCallToActionButton: HTMLElement;

  protected injectWidgetStyles(container: HTMLElement, styles: string): void {
    if (styles) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = styles;
      container.appendChild(style);
    }
  }

  protected appendCallToActionButton(container: HTMLElement){
    const button = document.createElement('button');
    button.innerText = 'Click me';
    container.appendChild(button);
    button.addEventListener('click', this.toggleChatWindowVisibility);
    this.widgetCallToActionButton = button;
  }

  protected toggleChatWindowVisibility = () => {
    this.widgetIsVisible = !this.widgetIsVisible;
    this.widgetIframe.hidden = !this.widgetIsVisible;
  };

  protected appendChatIframe(container: HTMLElement){
    const iframe = document.createElement('iframe');
    iframe.hidden = true;
    container.appendChild(iframe);
    this.widgetIframe = iframe;
  }

  public appendWidget = ({ container, styles }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, styles }, 'error');
      return;
    }

    this.appendChatIframe(container);
    this.appendCallToActionButton(container);

    const iframeContainer = this.widgetIframe.contentWindow.document.body;
    this.injectWidgetStyles(iframeContainer, styles);
    this.widgetComponent = appendDefaultElixirChatWidget(iframeContainer, this);
  };
}
