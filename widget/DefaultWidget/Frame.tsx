import React, { Component } from 'react'
import { createPortal } from 'react-dom'

export class Frame extends Component {

  contentRef = null;
  iframe = React.createRef();

  async componentDidMount(){
    console.log('___ frame mount');

    this.waitUntilIframeIsReady();

  }

  waitUntilIframeIsReady = () => {


    const iframeElement = this.iframe.current;
    const iframeDocument = iframeElement.contentWindow.document;

    console.log('___ iframe', this.iframe, iframeDocument.readyState);

    if (iframeDocument.readyState !== 'complete') {
      console.error('___ not complete 222');

      iframeElement.onload = () => {

        console.log('%c___ on load', 'color: green;');


        const iframeContentContainer = iframeDocument.createElement('main');
        iframeDocument.body.appendChild(iframeContentContainer);
        iframeContentContainer.innerText = 'yo';
        this.iframeContentContainer = iframeContentContainer;

      };
    }

    else {
      const iframeContentContainer = iframeDocument.createElement('main');
      iframeDocument.body.appendChild(iframeContentContainer);
      iframeContentContainer.innerText = 'yo 0';
      this.iframeContentContainer = iframeContentContainer;
    }

  };

  componentDidUpdate(){
    console.log('___ frame update');
  }

  // setContentRef = (node) => {
  //   this.contentRef = node.contentWindow.document.body;
  //   console.log('___ frame set ref', node, '-', this.contentRef);
  // };

  setIframeRef = (iframeElement) => {

    iframeElement.onload = () => {
      console.warn('___ frame on load');
    };

    const iframeDocument = iframeElement.contentWindow.document;

    if (iframeDocument.readyState !== 'complete') {
      console.error('___ not complete');
    }


    const iframeContentContainer = iframeDocument.createElement('main');
    iframeDocument.body.appendChild(iframeContentContainer);
    iframeContentContainer.innerText = 'yo';
    this.iframeContentContainer = iframeContentContainer;

    console.log('___ iframeElement', iframeElement, iframeDocument, '///', iframeContentContainer, iframeDocument.readyState);

  };

  onIframeLoad = (e) => {

    const iframeDocument = e.target.contentWindow.document;

    console.log('%c___ frame load', 'color: green;', e.target, '>>>', iframeDocument.readyState);




    const iframeContentContainer = iframeDocument.createElement('main');
    iframeDocument.body.appendChild(iframeContentContainer);
    iframeContentContainer.innerText = 'yo 1';
    this.iframeContentContainer = iframeContentContainer;
  };

  render() {
    const { children, ...props } = this.props;

    window.__zz = React.Children.only(children);
    window.__this1 = this;
    window.__React = React;

    // console.log('___ iframeBody', this.iframe);

    // if (!this.iframe.current) {
    //   return null;
    // }
    // const iframeBody = this.iframe.current.contentWindow.document.body;

    // {this.contentRef && createPortal(React.Children.only(children), this.contentRef)}

    return (
      <iframe {...props} ref={this.iframe}>
        {/*{createPortal(React.Children.only(children), iframeBody)}*/}
      </iframe>
    )
  }
}
