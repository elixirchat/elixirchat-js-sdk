import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { generateFontFaceRule } from '../../utilsWidget';
import { Chat } from './Chat';
import { Frame } from './Frame';
import styles from './styles';
import assets from './assets';

export interface IWidgetProps {
  elixirChatWidget: any;
}

export interface IWidgetState {
  isIFrameOpen: boolean;
  isIFrameOpeningAnimation: boolean;
  outsideIframeStyles: null | string;
  insideIframeStyles: null | string;
  unreadCount: number;
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    isIFrameOpen: false,
    isIFrameOpeningAnimation: false,
    outsideIframeStyles: null,
    insideIframeStyles: null,
    unreadCount: 0,
  };

  componentDidMount() {
    console.log('___ mount');

    const { elixirChatWidget } = this.props;
    const { outsideIframeStyles, insideIframeStyles } = this.generateStyles();

    this.setState({
      outsideIframeStyles,
      insideIframeStyles,
    });

    elixirChatWidget.onToggleChatVisibility(this.onButtonClick);
    elixirChatWidget.onSetUnreadCount((unreadCount) => this.setState({ unreadCount }));
  }

  componentDidUpdate(prevProps) {
    console.log('___ update');
  }

  generateStyles = () => {
    const { elixirChatWidget } = this.props;
    const fontFaceGraphikNormal = generateFontFaceRule('Graphik', 'normal', assets.fontGraphikRegularWeb);
    const fontFaceGraphikBold = generateFontFaceRule('Graphik', 'bold', assets.fontGraphikBoldWeb);
    const fontFaceElixirIcons = generateFontFaceRule('elixirchat-icons', null, assets.fontElixirchatIcons);

    const outsideIframeStyles = [
      styles.icons,
      styles.Widget,
      styles.ImagePreview,
      fontFaceGraphikNormal,
      fontFaceElixirIcons,
    ].join('\n');

    const insideIframeStyles = [
      styles.icons,
      styles.Chat,
      styles.ChatMessages,
      styles.ChatTextarea,
      fontFaceGraphikNormal,
      fontFaceGraphikBold,
      fontFaceElixirIcons,
      elixirChatWidget.iframeStyles,
    ].join('\n');

    return {
      outsideIframeStyles,
      insideIframeStyles,
    };
  };

  onButtonClick = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.toggleChatVisibility({ noCallback: true });

    this.setState({
      isIFrameOpen: !this.state.isIFrameOpen,
      isIFrameOpeningAnimation: true,
    });
    setTimeout(() => {
      this.setState({ isIFrameOpeningAnimation: false });
    });
  };

  render(): void {
    const { elixirChatWidget } = this.props;
    const {
      isIFrameOpen,
      isIFrameOpeningAnimation,
      outsideIframeStyles,
      insideIframeStyles,
      unreadCount,
    } = this.state;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeStyles }}/>
        <button className="elixirchat-widget-button" onClick={this.onButtonClick}>
          <span className={cn({
            'elixirchat-widget-button-counter': true,
            'elixirchat-widget-button-counter--has-unread': unreadCount,
          })}>{Boolean(unreadCount) && unreadCount}</span>
        </button>

        <Frame className={cn({
          'elixirchat-widget-iframe': true,
          'elixirchat-widget-iframe--visible': isIFrameOpen,
          'elixirchat-widget-iframe--opening': isIFrameOpeningAnimation,
        })}>
          <Fragment>
            <style dangerouslySetInnerHTML={{ __html: insideIframeStyles }}/>
            <Chat elixirChatWidget={elixirChatWidget} />
          </Fragment>
        </Frame>
      </Fragment>
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
