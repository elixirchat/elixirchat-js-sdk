import React, { Component } from 'react';
import { createPortal } from 'react-dom';

export class FrameWrapper extends Component {

  iframeContentContainer = null;
  iframe = React.createRef();

  state = {
    isIframeReady: false,
  };

  componentDidMount(){
    const { onFrameReady } = this.props;
    this.onIframeReady().then(iframeDocument => {
      this.iframeContentContainer = iframeDocument.createElement('main');
      iframeDocument.body.appendChild(this.iframeContentContainer);
      this.setState({ isIframeReady: true });
      onFrameReady(iframeDocument);
    });
  }

  onIframeReady = () => {
    return new Promise((resolve) => {
      let iframeElement = this.iframe.current;
      let iframeDocument = iframeElement.contentWindow.document;

      if (iframeDocument.readyState === 'complete') {
        resolve(iframeDocument);
      }
      else {
        iframeElement.addEventListener('load', (e) => {
          iframeElement = e.target;
          iframeDocument = e.target.contentWindow.document;
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
