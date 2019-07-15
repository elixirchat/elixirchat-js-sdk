import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './DefaultElixirChatWidgetStyles';
// import styled from 'styled-components';
// import injectStyles, { InlineStylerProvider } from 'react-inline-styler'
// import stylesToInject from './DefaultElixirChatWidget.scss';






export interface IDefaultElixirChatWidgetProps {
  elixirChatWidget: any;
}

export interface IDefaultElixirChatWidgetState {
  messages: Array<any>;
  replyToId: string;
}

const styles2 = {
  header: {
    color: 'red',
    fontSize: 8,
  },
};

// const Input = styled.input `
//   width: 200px;
//   height: 120px;
//   border-radius: 5px;
//   border: 1px solid #cecece;
//   box-sizing: border-box;
// `;
// const Button = styled.button `
//   width: ${props => props.width};
//   border: none;
//   color: ${props => props.btnColor};
//   outline: none;
//   cursor:pointer;
//   border-radius: 5px;
//   padding: 10px 15px;
// `;


// console.log('___ styles', styled);

export class DefaultElixirChatWidget extends Component<IDefaultElixirChatWidgetProps, IDefaultElixirChatWidgetState> {

  protected container: { current: HTMLElement } = React.createRef();

  state: any = {
    messages: [],
    replyToId: null,
  };

  componentDidMount(): void {
    const { elixirChatWidget } = this.props;
    console.log('componentDidMount', elixirChatWidget);
    this.injectIframeStyles(styles);

    elixirChatWidget.onConnectSuccess(() => {
      elixirChatWidget.fetchMessageHistory(5).then(messages => {
        this.setState({ messages });
      });
    });
  }

  protected injectIframeStyles(styles){
    // const
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles;
    this.container.current.appendChild(style);
  }

  onScreenShotClick = (): void => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.takeScreenshot().then(screenshot => {
      console.log('Screenshot', screenshot.file);
      this.setState({
        test: screenshot.file.name,
      });
    });
  };

  onReplyClick = (messageId) => {
    this.setState({
      replyToId: messageId
    });
  };

  render() {
    const { messages, replyToId } = this.state;

    // const {
    //   zzz,
    // } = this.props.styles;

    console.warn('___ render', '///', this.props);

    return (
      <div ref={this.container}>
        {/*<h1 style={styles.header} className="header">MyComponent:</h1>*/}
        <h1 className="zzz">MyComponent:</h1>
        <ul>
          {messages.map(message => (
            <li key={message.id}>
              <b>{message.sender.firstName}</b>: {message.text}&nbsp;
              <button onClick={() => this.onReplyClick(message.id)}>Reply</button>
            </li>
          ))}
        </ul>
        {Boolean(replyToId) && (
          <blockquote>Reply to: ${replyToId}</blockquote>
        )}
        <button onClick={this.onScreenShotClick}>Screenshot</button>
      </div>
    );
  }
}


// const StyledDefaultElixirChatWidget = injectStyles(stylesToInject)(DefaultElixirChatWidget)
// window.__StyledDefaultElixirChatWidget = StyledDefaultElixirChatWidget;

// export function appendDefaultElixirChatWidget(container, elixirChatWidget) {
//   let component;
//   ReactDOM.render((
//     <InlineStylerProvider>
//       <StyledDefaultElixirChatWidget elixirChatWidget={elixirChatWidget} ref={(widget) => {component = widget}} />
//     </InlineStylerProvider>
//   ), container);
//   return component;
// }


export function appendDefaultElixirChatWidget(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <DefaultElixirChatWidget elixirChatWidget={elixirChatWidget} ref={(widget) => {component = widget}} />
  ), container);
  return component;
}
