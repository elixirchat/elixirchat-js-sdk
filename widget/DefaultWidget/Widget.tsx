import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { UNREAD_MESSAGES_CHANGE, UNREAD_REPLIES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { _flatten } from '../../utilsCommon';
import { generateFontFaceRule, unlockNotificationSoundAutoplay } from '../../utilsWidget';
import { FontExtractor } from '../FontExtractor';
import { Chat } from './Chat';
import { IFrameWrapper } from './IFrameWrapper';
import { ImagePreview } from './ImagePreview';
import styles from './styles';
import assets from './assets';
import { WIDGET_POPUP_TOGGLE } from '../ElixirChatWidgetEventTypes';

export interface IWidgetProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWidgetState {
  isIFrameOpen: boolean;
  isIFrameOpeningAnimation: boolean;
  outsideIframeStyles: null | string;
  insideIframeStyles: null | string;
  extractedFontsStyles: null | string;
  customIframeStyles: null | string;
  unreadMessagesCounter: number,
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    isIFrameOpen: false,
    isIFrameOpeningAnimation: false,
    outsideIframeStyles: null,
    insideIframeStyles: null,
    extractedFontsStyles: null,
    customIframeStyles: null,
    unreadMessagesCounter: 0,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    const { outsideIframeStyles, insideIframeStyles } = this.generateStyles();
    document.body.addEventListener('click', unlockNotificationSoundAutoplay);
    window.addEventListener('load', this.onWindowLoad);

    this.setState({
      outsideIframeStyles,
      insideIframeStyles,
      customIframeStyles: elixirChatWidget.iframeStyles,
    });

    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, this.onPopupToggle);

    elixirChatWidget.on(UNREAD_MESSAGES_CHANGE, unreadMessagesCounter => {
      this.setState({ unreadMessagesCounter });
    });
  }

  onWindowLoad = () => {
    const { elixirChatWidget: { extractFontsFromParentWindow } } = this.props;

    if (extractFontsFromParentWindow && extractFontsFromParentWindow.length) {
      const fontExtractor = new FontExtractor(document);
      const extractedFonts = _flatten(extractFontsFromParentWindow.map(fontExtractor.extract));
      const extractedFontsStyles = extractedFonts.map(font => font.cssText).join('\n\n');
      this.setState({ extractedFontsStyles });
    }
  };

  generateStyles = () => {
    const fontFaceGraphikNormal = generateFontFaceRule('Graphik', 'normal', assets.fontGraphikRegularWeb, 'woff');
    const fontFaceGraphikBold = generateFontFaceRule('Graphik', 'bold', assets.fontGraphikBoldWeb, 'woff');
    const fontFaceElixirIcons = generateFontFaceRule('elixirchat-icons', null, assets.fontElixirchatIcons, 'woff');

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
    ].join('\n');

    return {
      outsideIframeStyles,
      insideIframeStyles,
    };
  };

  onPopupToggle = async () => {
    await this.setState({
      isIFrameOpen: !this.state.isIFrameOpen,
      isIFrameOpeningAnimation: true,
    });
    setTimeout(() => {
      this.setState({ isIFrameOpeningAnimation: false });
    });
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      isIFrameOpen,
      isIFrameOpeningAnimation,
      outsideIframeStyles,
      insideIframeStyles,
      extractedFontsStyles,
      customIframeStyles,
      unreadMessagesCounter,
    } = this.state;

    const visibleUnreadMessagesCounter = unreadMessagesCounter > 99 ? '99+' : unreadMessagesCounter;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeStyles }}/>
        <button className="elixirchat-widget-button" onClick={elixirChatWidget.togglePopup}>
          <span className={cn({
            'elixirchat-widget-button-counter': true,
            'elixirchat-widget-button-counter--has-unread': visibleUnreadMessagesCounter,
          })}>
            {Boolean(visibleUnreadMessagesCounter) && visibleUnreadMessagesCounter}
          </span>
        </button>

        <ImagePreview elixirChatWidget={elixirChatWidget}/>

        <IFrameWrapper elixirChatWidget={elixirChatWidget} className={cn({
          'elixirchat-widget-iframe': true,
          'elixirchat-widget-iframe--visible': isIFrameOpen,
          'elixirchat-widget-iframe--opening': isIFrameOpeningAnimation,
        })}>
          <Fragment>
            <style dangerouslySetInnerHTML={{ __html: extractedFontsStyles }}/>
            <style dangerouslySetInnerHTML={{ __html: insideIframeStyles }}/>
            <style dangerouslySetInnerHTML={{ __html: customIframeStyles }}/>
            <Chat elixirChatWidget={elixirChatWidget}/>
          </Fragment>
        </IFrameWrapper>
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
