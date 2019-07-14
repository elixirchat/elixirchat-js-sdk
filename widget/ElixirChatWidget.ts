import { h, render } from 'preact';
import ElixirChat from '../src';
import { MyComponent } from './DefaultElixirChatWidget.jsx';
import { logEvent } from '../utils';

export interface IElixirChatWidgetAppendWidgetConfig {
  container: HTMLElement;
  styles?: string;
}

export class ElixirChatWidget extends ElixirChat {

  public renderWidget = (): HTMLElement => {
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '100px';
    el.style.background = 'yellow';
    el.innerHTML = '<span class="test">Test</span>';
    el.onclick = () => {
      console.log('___ on click');
      this.takeScreenshot().then(screenshot => {
        console.log('___ screenshot taken', screenshot.file);
      });
    };
    return el;
  };

  public appendWidget = ({ container, styles }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!container || !(container instanceof HTMLElement)) {
      logEvent(this.debug, 'You must provide an HTMLElement as a "container" option to appendWidget() method', {
        container,
        styles
      }, 'error');
      return;
    }

    this.onTyping((people) => {
      console.log('___ on typing....', people);
    });

    const widget = this.renderWidget();
    console.warn('___ append', container, { styles, widget }, {MyComponent});
    // container.appendChild(widget);
    render(MyComponent({ prop1: '222', prop2: '333' }), container);

    if (styles) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  };
}

// export default ElixirChatWidget;
