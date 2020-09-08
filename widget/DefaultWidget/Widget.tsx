import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { UNREAD_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import {
  FONTS_EXTRACTED,
  WIDGET_DATA_SET,
  WIDGET_NAVIGATE_TO,
  WIDGET_POPUP_TOGGLE,
} from '../ElixirChatWidgetEventTypes';

import { detectBrowser } from '../../utilsCommon';
import {
  base64toBlobUrl,
  generateSvgIconsCSS,
  exposeComponentToGlobalScope,
  unlockNotificationSoundAutoplay
} from '../../utilsWidget';

import { generateFontFaceCSS, FontExtractor } from '../FontExtractor';
import { Chat } from './Chat';
import { IFrameWrapper } from './IFrameWrapper';
import { WelcomeScreen } from './WelcomeScreen';
import { FullScreenPreview } from './FullScreenPreview';
import styles from './styles';
import assets from './assets';
import {Alert} from './Alert';

export interface IWidgetProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWidgetState {
  unreadMessagesCount: number;
  detectedBrowser: string;
  outsideIframeCSS: string;
  insideIframeCSS: string;
  widgetView: string;
  widgetViewIsAnimating: null | string;
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
    widgetViewIsAnimating: null,
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

    elixirChatWidget.on(FONTS_EXTRACTED, fontRules => {
      this.setState({
        insideIframeCSS: insideIframeCSS + '\n\n' + generateFontFaceCSS(fontRules),
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

    elixirChatWidget.on(WIDGET_NAVIGATE_TO, widgetView => {
      this.setState({ widgetViewIsAnimating: true });
      setTimeout(() => {
        this.setState({
          widgetView,
          widgetViewIsAnimating: false
        });
      }, 400);
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
        src: [{
          url: base64toBlobUrl(assets.fontElixirchatIcons),
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
        fontStyle: 'normal',
        src: [{
          url: base64toBlobUrl(assets.fontGraphikRegular),
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
        fontStyle: 'italic',
        src: [{
          url: base64toBlobUrl(assets.fontGraphikRegularItalic),
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '500',
        src: [{
          url: base64toBlobUrl(assets.fontGraphikMedium),
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'bold',
        src: [{
          url: base64toBlobUrl(assets.fontGraphikBold),
          format: 'woff',
        }],
      },
    ]);
  };

  renderSvgIconsCSS = () => {
    return generateSvgIconsCSS('svg-icon-', {
      whatsapp: base64toBlobUrl(assets.iconWhatsapp),
      telegram: base64toBlobUrl(assets.iconTelegram),
      facebook: base64toBlobUrl(assets.iconFacebook),
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
      styles.WidgetOutsideIFrame,
      styles.FullScreenPreview,
    ].join('\n');

    const insideIframeCSS = [
      elixirChatWidget.widgetConfig.iframeCSS,
      defaultFontFaceCSS,
      svgIconsCSS,
      styles.icons,
      styles.WidgetInsideIFrame,
      styles.WelcomeScreen,
      styles.Alert,
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
      widgetViewIsAnimating,
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
            <div className={cn({
              'elixirchat-widget-view': true,
              'elixirchat-widget-view--animating': widgetViewIsAnimating,
            })}>
              {widgetView === 'chat' && (
                <Chat className={`elixirchat-browser--${detectedBrowser}`} elixirChatWidget={elixirChatWidget}/>
              )}
              {widgetView === 'welcome-screen' && (
                <WelcomeScreen elixirChatWidget={elixirChatWidget}/>
              )}
            </div>
            <Alert elixirChatWidget={elixirChatWidget}/>
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
