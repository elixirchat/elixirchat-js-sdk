import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Chat } from './Chat';
import { Frame } from './Frame';

export interface IWidgetProps {
  elixirChatWidget: any;
}

export interface IWidgetState {
  isIFrameOpen: boolean;
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    isIFrameOpen: false,
  };

  componentDidMount() {
    console.log('___ mount');
  }

  componentDidUpdate(prevProps) {
    console.log('___ update');
  }

  onButtonClick = () => {
    this.setState({
      isIFrameOpen: !this.state.isIFrameOpen,
    });
  };

  render(): void {
    const { elixirChatWidget } = this.props;
    const { isIFrameOpen } = this.state;

    return (
      <div>
        <Frame hidden={!isIFrameOpen}>
          <Chat elixirChatWidget={elixirChatWidget} />
        </Frame>
        <button onClick={this.onButtonClick}>Button</button>
      </div>
    );
  }
}


export function renderWidgetReactComponent(container, elixirChatWidget) {
  let component;
  ReactDOM.render((
    <Widget ref={(widget) => {component = widget}} elixirChatWidget={elixirChatWidget} />
  ), container);
  return component;
}
