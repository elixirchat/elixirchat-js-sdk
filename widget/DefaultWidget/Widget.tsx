import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { WIDGET_POPUP_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { UNREAD_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { _flatten, detectBrowser } from '../../utilsCommon';
import { generateFontFaceRule, unlockNotificationSoundAutoplay } from '../../utilsWidget';
import { FontExtractor } from '../FontExtractor';
import { Chat } from './Chat';
import { IFrameWrapper } from './IFrameWrapper';
import { FullScreenPreview } from './FullScreenPreview';
import styles from './styles';
import assets from './assets';

export interface IWidgetProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWidgetState {
  detectedBrowser: string | null,
  isIFrameOpen: boolean;
  isIFrameOpeningAnimation: boolean;
  outsideIframeStyles: null | string;
  insideIframeStyles: null | string;
  extractedFontsStyles: null | string;
  customIframeStyles: null | string;
  unreadMessagesCount: number,
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    detectedBrowser: null,
    isDefaultButtonHidden: false,
    isIFrameOpen: false,
    isIFrameOpeningAnimation: false,
    outsideIframeStyles: null,
    insideIframeStyles: null,
    extractedFontsStyles: null,
    customIframeStyles: null,
    unreadMessagesCount: 0,
  };

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    const { outsideIframeStyles, insideIframeStyles } = this.generateStyles();
    document.body.addEventListener('click', unlockNotificationSoundAutoplay);
    window.addEventListener('load', this.onParentWindowLoad);

    this.setState({
      outsideIframeStyles,
      insideIframeStyles,
      customIframeStyles: elixirChatWidget.iframeStyles,
      isDefaultButtonHidden: elixirChatWidget.hideDefaultButton,
      unreadMessagesCount: elixirChatWidget.unreadMessagesCount,
      detectedBrowser: detectBrowser(),
    });

    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, this.onPopupToggle);

    elixirChatWidget.on(UNREAD_MESSAGES_CHANGE, unreadMessagesCount => {
      this.setState({ unreadMessagesCount });
    });
  }

  onParentWindowLoad = () => {
    const { elixirChatWidget: { extractFontsFromParentWindow } } = this.props;

    if (extractFontsFromParentWindow && extractFontsFromParentWindow.length) {
      const fontExtractor = new FontExtractor(document);
      const extractedFonts = _flatten(extractFontsFromParentWindow.map(fontExtractor.extract));
      const extractedFontsStyles = extractedFonts.map(font => font.cssText).join('\n\n');
      this.setState({ extractedFontsStyles });
    }
  };

  generateStyles = () => {
    const fontFaceGraphikRegular = generateFontFaceRule('Graphik', 'normal', 'normal', assets.fontGraphikRegular);
    const fontFaceGraphikRegularItalic = generateFontFaceRule('Graphik', 'normal', 'italic', assets.fontGraphikRegularItalic);
    const fontFaceGraphikMedium = generateFontFaceRule('Graphik', '500', null, assets.fontGraphikMedium);
    const fontFaceGraphikBold = generateFontFaceRule('Graphik', 'bold', null, assets.fontGraphikBold);
    const fontFaceElixirIcons = generateFontFaceRule('elixirchat-icons', null, null, assets.fontElixirchatIcons);

    const outsideIframeStyles = [
      styles.icons,
      styles.Widget,
      styles.FullScreenPreview,
      fontFaceGraphikRegular,
      fontFaceElixirIcons,
    ].join('\n');

    const insideIframeStyles = [
      styles.icons,
      styles.Chat,
      styles.ChatMessages,
      styles.ChatTextarea,
      fontFaceGraphikRegular,
      fontFaceGraphikRegularItalic,
      fontFaceGraphikMedium,
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
      detectedBrowser,
      isIFrameOpen,
      isIFrameOpeningAnimation,
      isDefaultButtonHidden,
      outsideIframeStyles,
      insideIframeStyles,
      extractedFontsStyles,
      customIframeStyles,
      unreadMessagesCount,
    } = this.state;

    const visibleUnreadMessagesCount = unreadMessagesCount > 99 ? '99+' : unreadMessagesCount;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeStyles }}/>

        {!isDefaultButtonHidden && (
          <button className={cn({
            'elixirchat-widget-button': true,
            'elixirchat-widget-button--widget-open': isIFrameOpen,
          })} onClick={elixirChatWidget.togglePopup}>
            <i className="elixirchat-widget-icon icon-logo"/>
            <i className="elixirchat-widget-icon icon-close-thin"/>
            <span className={cn({
              'elixirchat-widget-button-counter': true,
              'elixirchat-widget-button-counter--has-unread': visibleUnreadMessagesCount,
            })}>
              {Boolean(visibleUnreadMessagesCount) && visibleUnreadMessagesCount}
            </span>
          </button>
        )}

        <FullScreenPreview elixirChatWidget={elixirChatWidget}/>

        <IFrameWrapper elixirChatWidget={elixirChatWidget} className={cn({
          'elixirchat-widget-iframe': true,
          'elixirchat-widget-iframe--visible': isIFrameOpen,
          'elixirchat-widget-iframe--opening': isIFrameOpeningAnimation,
        })}>
          <Fragment>
            <style dangerouslySetInnerHTML={{ __html: extractedFontsStyles }}/>
            <style dangerouslySetInnerHTML={{ __html: insideIframeStyles }}/>
            <style dangerouslySetInnerHTML={{ __html: customIframeStyles }}/>
            <Chat className={`elixirchat-browser--${detectedBrowser}`} elixirChatWidget={elixirChatWidget}/>
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
