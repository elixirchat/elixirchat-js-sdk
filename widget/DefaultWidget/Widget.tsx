import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Chat } from './Chat';

export interface IWidgetProps {
}

export interface IWidgetState {
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    isIFrameOpen: false,
  };

  iframe = React.createRef();

  componentDidMount(): void {
    console.log('___ mount');

    this.iframe.current.onload = () => {
      console.log('___ onload event 1', this.iframe.current);
    };

    this.renderIframeContent();
  }

  componentDidUpdate(prevProps) {
    console.log('___ update');
  }

  renderIframeContent = () => {
    const { elixirChatWidget } = this.props;
    // const iframeBody = this.iframe.current.contentWindow.document.querySelector('body');
    const iframeDocument = this.iframe.current.contentWindow.document;
    const container = iframeDocument.createElement('main');
    iframeDocument.body.appendChild(container);

    console.log('___ iframeBody', iframeDocument, container);
    window.__container = container;

    let component;

    ReactDOM.render((
      <Chat ref={(chat) => {component = chat}} elixirChatWidget={elixirChatWidget} />
    ), container);

  };

  onButtonClick = () => {
    this.setState({
      isIFrameOpen: !this.state.isIFrameOpen,
    });
  };

  onIframeReady = () => {
    console.log('___ onload event @@@', this.iframe.current);
  };

  render(): void {
    const { isIFrameOpen } = this.state;

    return (
      <div>
        <iframe onLoadCapture={this.onIframeReady} ref={this.iframe} src="" hidden={!isIFrameOpen}/>
        <button onClick={this.onButtonClick}>Button</button>
      </div>
    );
  }
}


export function renderWidget(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <Widget ref={(widget) => {component = widget}} elixirChatWidget={elixirChatWidget} />
  ), container);
  return component;
}


// export function renderIframeContent(container, elixirChatWidget) {
//   let component;
//   ReactDOM.render((
//     <Chat ref={(chat) => {component = chat}} elixirChatWidget={elixirChatWidget} />
//   ), container);
//   return component;
// }
