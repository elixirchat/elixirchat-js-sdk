import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { JOIN_ROOM_SUCCESS, UNREAD_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import {FONTS_EXTRACTED, WIDGET_DATA_SET, WIDGET_NAVIGATE_TO, WIDGET_POPUP_TOGGLE} from '../ElixirChatWidgetEventTypes';
import { detectBrowser } from '../../utilsCommon';
import {
  base64toBlobUrl,
  exposeComponentToGlobalScope,
  generateSvgIconsCSS,
  unlockNotificationSoundAutoplay
} from '../../utilsWidget';
import { generateFontFaceCSS, FontExtractor } from '../FontExtractor';
import { Chat } from './Chat';
import { IFrameWrapper } from './IFrameWrapper';
import { WelcomeScreen } from './WelcomeScreen';
import { FullScreenPreview } from './FullScreenPreview';
import styles from './styles';
import assets from './assets';

export interface IWidgetProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWidgetState {
  unreadMessagesCount: number;
  detectedBrowser: string;
  outsideIframeCSS: string;
  insideIframeCSS: string;
  widgetView: string;
  widgetIsPopupOpen: boolean;
  widgetIsPopupOpeningAnimation: boolean;
  widgetIsButtonHidden: boolean;
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    unreadMessagesCount: 0,
    detectedBrowser: null,
    outsideIframeCSS: null,
    insideIframeCSS: null,
    widgetView: '',
    widgetIsPopupOpen: false,
    widgetIsPopupOpeningAnimation: false,
    widgetIsButtonHidden: false,
  };

  fontExtractor: FontExtractor;

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    const { outsideIframeCSS, insideIframeCSS } = this.generateCSS();
    exposeComponentToGlobalScope('Widget', this, elixirChatWidget);

    this.fontExtractor = new FontExtractor(elixirChatWidget, window);

    this.setState({
      insideIframeCSS,
      outsideIframeCSS,
      detectedBrowser: detectBrowser(),
    });

    elixirChatWidget.on(FONTS_EXTRACTED, extractedFontFaceCSS => {
      this.setState({
        insideIframeCSS: insideIframeCSS + '\n\n' + extractedFontFaceCSS,
      });
    });

    elixirChatWidget.on(WIDGET_DATA_SET, () => {
      const {
        widgetIsButtonHidden,
        widgetIsPopupOpen,
        widgetView,
        unreadMessagesCount,
      } = elixirChatWidget;

      this.setState({
        unreadMessagesCount,
        widgetView,
        widgetIsPopupOpen,
        widgetIsButtonHidden,
      });
    });

    document.body.addEventListener('click', unlockNotificationSoundAutoplay);

    elixirChatWidget.on(WIDGET_NAVIGATE_TO, ({ view, animation }) => {
      // TODO: show animation
      this.setState({ widgetView: view });
    });
    elixirChatWidget.on(UNREAD_MESSAGES_CHANGE, unreadMessagesCount => {
      this.setState({ unreadMessagesCount });
    });
    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, this.onPopupToggle);
  }

  renderDefaultFontCSS = () => {
    return generateFontFaceCSS([
      {
        fontFamily: 'elixirchat-icons',
        format: 'woff',
        src: base64toBlobUrl(assets.fontElixirchatIcons),
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
        fontStyle: 'normal',
        format: 'woff',
        src: base64toBlobUrl(assets.fontGraphikRegular),
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
        fontStyle: 'italic',
        format: 'woff',
        src: base64toBlobUrl(assets.fontGraphikRegularItalic),
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '500',
        format: 'woff',
        src: base64toBlobUrl(assets.fontGraphikMedium),
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'bold',
        format: 'woff',
        src: base64toBlobUrl(assets.fontGraphikBold),
      },
    ]);
  };

  renderSvgIconsCSS = () => {
    return generateSvgIconsCSS('svg-icon-', {
      whatsapp: base64toBlobUrl(assets.iconWhatsapp),
      telegram: base64toBlobUrl(assets.iconTelegram),
      facebook: base64toBlobUrl(assets.iconFacebook),
      skype: base64toBlobUrl(assets.iconSkype),
      viber: base64toBlobUrl(assets.iconViber),
      vkontakte: base64toBlobUrl(assets.iconVK),
    });
  };

  generateCSS = () => {
    const { elixirChatWidget } = this.props;
    const defaultFontFaceCSS = this.renderDefaultFontCSS();
    const svgIconsCSS = this.renderSvgIconsCSS();

    const outsideIframeCSS = [
      defaultFontFaceCSS,
      styles.icons,
      styles.Widget,
      styles.FullScreenPreview,
    ].join('\n');

    const insideIframeCSS = [
      elixirChatWidget.widgetConfig.iframeCSS,
      defaultFontFaceCSS,
      svgIconsCSS,
      styles.icons,
      styles.WelcomeScreen,
      styles.Chat,
      styles.ChatMessages,
      styles.ChatTextarea,
    ].join('\n');

    return {
      outsideIframeCSS,
      insideIframeCSS,
    };
  };

  onPopupToggle = (widgetIsPopupOpen) => {
    this.setState({
      widgetIsPopupOpen,
      widgetIsPopupOpeningAnimation: true,
    });
    setTimeout(() => {
      this.setState({ widgetIsPopupOpeningAnimation: false });
    });
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      widgetIsButtonHidden,
      widgetIsPopupOpen,
      widgetIsPopupOpeningAnimation,
      widgetView,
      unreadMessagesCount,
      outsideIframeCSS,
      insideIframeCSS,
      detectedBrowser,
    } = this.state;

    const visibleUnreadMessagesCount = unreadMessagesCount > 99 ? '99+' : unreadMessagesCount;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeCSS }}/>

        {!widgetIsButtonHidden && (
          <button className={cn({
            'elixirchat-widget-button': true,
            'elixirchat-widget-button--widget-open': widgetIsPopupOpen,
          })} onClick={() => widgetIsPopupOpen ? elixirChatWidget.closePopup() : elixirChatWidget.openPopup()}>
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
          'elixirchat-widget-iframe--visible': widgetIsPopupOpen,
          'elixirchat-widget-iframe--opening': widgetIsPopupOpeningAnimation,
        })}>
          <Fragment>
            <style dangerouslySetInnerHTML={{ __html: insideIframeCSS }}/>

            {/*TODO: animation*/}

            {widgetView === 'chat' && (
              <Chat className={`elixirchat-browser--${detectedBrowser}`} elixirChatWidget={elixirChatWidget}/>
            )}
            {widgetView === 'welcome-screen' && (
              <WelcomeScreen elixirChatWidget={elixirChatWidget}/>
            )}
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
