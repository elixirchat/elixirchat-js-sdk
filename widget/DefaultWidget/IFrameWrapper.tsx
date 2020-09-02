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

    this.onIframeReady().then(iframeDocument => {
      this.iframeContentContainer = iframeDocument.createElement('main');
      iframeDocument.body.appendChild(this.iframeContentContainer);

      this.setState({ isIframeReady: true }, () => {
        elixirChatWidget.triggerEvent(WIDGET_IFRAME_READY, iframeDocument, { firedOnce: true });
      });
    });
  }

  onIframeReady = () => {
    return new Promise((resolve) => {
      let iframeElement: HTMLIFrameElement = this.iframe.current;
      let iframeDocument = iframeElement.contentWindow.document;

      if (iframeDocument.readyState === 'complete') {
        resolve(iframeDocument);
      }
      else {
        iframeElement.addEventListener('load', (e) => {
          iframeElement = e.target;
          iframeDocument = iframeElement.contentWindow.document;
          resolve(iframeDocument);
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
