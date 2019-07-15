import ElixirChat from '../src';
import { appendDefaultElixirChatWidget } from './DefaultElixirChatWidget.tsx';
import { logEvent } from '../utils';
// import stylesToInject from './test.css';

// console.log('___ stylesToInject fff', stylesToInject);

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
    // button.class = stylesToInject.fff;
    button.innerText = 'Click me';
    container.appendChild(button);
    button.addEventListener('click', this.toggleChatWindowVisibility);
    if (this.widgetCallToActionButton) {
      this.widgetCallToActionButton.remove();
    }
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
    iframe.contentWindow.document.body.appendChild(document.createElement('main'));
    if (this.widgetIframe) {
      this.widgetIframe.remove();
    }
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
    this.toggleChatWindowVisibility(); // TODO: remove

    const iframeContainer = <HTMLElement>this.widgetIframe.contentWindow.document.querySelector('main');
    this.injectWidgetStyles(iframeContainer, styles);
    this.widgetComponent = appendDefaultElixirChatWidget(iframeContainer, this);
  };
}
