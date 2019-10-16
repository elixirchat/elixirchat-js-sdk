import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { WIDGET_IFRAME_READY } from '../ElixirChatWidgetEventTypes';

export interface IIFrameWrapperProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IIFrameWrapperState {
  isIframeReady: boolean;
}

export class IFrameWrapper extends Component<IIFrameWrapperProps, IIFrameWrapperState> {

  iframeContentContainer = null;
  iframe = React.createRef();

  state = {
    isIframeReady: false,
  };

  componentDidMount(){
    const { elixirChatWidget } = this.props;

    this.onIframeReady().then(async (iframeWindow) => {
      this.iframeContentContainer = iframeWindow.document.createElement('main');
      iframeWindow.document.body.appendChild(this.iframeContentContainer);
      await this.setState({ isIframeReady: true });
      elixirChatWidget.triggerEvent(WIDGET_IFRAME_READY, iframeWindow);
    });
  }

  onIframeReady = () => {
    return new Promise((resolve) => {
      let iframeElement: HTMLIFrameElement = this.iframe.current;
      let iframeWindow = iframeElement.contentWindow;

      if (iframeWindow.document.readyState === 'complete') {
        resolve(iframeWindow);
      }
      else {
        iframeElement.addEventListener('load', (e) => {
          iframeElement = e.target;
          iframeWindow = iframeElement.contentWindow;
          resolve(iframeWindow);
        });
      }
    });
  };

  render() {
    const { children, className } = this.props;
    const { isIframeReady } = this.state;

    return (
      <iframe className={className} ref={this.iframe}>
        {isIframeReady && createPortal(React.Children.only(children), this.iframeContentContainer)}
      </iframe>
    )
  }
}
