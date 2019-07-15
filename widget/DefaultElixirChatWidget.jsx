import { h, render, Component } from 'preact';

export class DefaultElixirChatWidget extends Component {

  elixirChatWidget = null;

  state = {
    messages: [],
    replyToId: null,
  };

  componentDidMount(){
    const { elixirChatWidget } = this.props;
    console.log('componentDidMount', elixirChatWidget);

    elixirChatWidget.onConnectSuccess(() => {
      elixirChatWidget.fetchMessageHistory(5).then(messages => {
        this.setState({ messages });
      });
    });
  }

  onClick = () => {
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
    return (
      <div className="container">
        <h1>MyComponent:</h1>
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
        <button onClick={this.onClick}>Screenshot</button>
      </div>
    );
  }
}

export function appendDefaultElixirChatWidget(container, elixirChatWidget) {
  let component;
  render(
    <DefaultElixirChatWidget
      elixirChatWidget={elixirChatWidget}
      ref={(widget) => {component = widget}} />,
    container
  );
  return component;
}
