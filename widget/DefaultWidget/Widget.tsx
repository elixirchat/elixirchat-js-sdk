import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { UNREAD_MESSAGES_CHANGE } from '../../sdk/ElixirChatEventTypes';
import { FONTS_EXTRACTED, WIDGET_NAVIGATE_TO, WIDGET_POPUP_TOGGLE } from '../ElixirChatWidgetEventTypes';
import { detectBrowser } from '../../utilsCommon';
import { generateSVGIconRules, unlockNotificationSoundAutoplay } from '../../utilsWidget';
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
  isButtonHidden: boolean,
  isPopupOpen: boolean,
  isPopupOpeningAnimation: boolean,
  unreadMessagesCount: number,
  detectedBrowser: string,
  outsideIframeCSS: string;
  insideIframeCSS: string;
  currentView: { view: string, animation?: null | string },
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    isButtonHidden: false,
    isPopupOpen: false,
    isPopupOpeningAnimation: false,
    unreadMessagesCount: 0,
    detectedBrowser: null,
    outsideIframeCSS: null,
    insideIframeCSS: null,
    currentView: {},
  };

  fontExtractor: FontExtractor;

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    const { widgetIsButtonHidden, unreadMessagesCount } = elixirChatWidget;
    const { outsideIframeCSS, insideIframeCSS } = this.generateCSS();

    this.setState({
      insideIframeCSS,
      outsideIframeCSS,
      unreadMessagesCount,
      isButtonHidden: widgetIsButtonHidden,
      detectedBrowser: detectBrowser(),
    });

    this.fontExtractor = new FontExtractor(elixirChatWidget, window);

    elixirChatWidget.on(FONTS_EXTRACTED, extractedFontFaceCSS => {
      this.setState({
        insideIframeCSS: insideIframeCSS + '\n\n' + extractedFontFaceCSS,
      });
    });

    document.body.addEventListener('click', unlockNotificationSoundAutoplay);

    elixirChatWidget.on(WIDGET_NAVIGATE_TO, currentView => {
      this.setState({ currentView });
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
        src: assets.fontElixirchatIcons,
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
        fontStyle: 'normal',
        src: assets.fontGraphikRegular,
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
        fontStyle: 'italic',
        src: assets.fontGraphikRegularItalic,
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '500',
        src: assets.fontGraphikMedium,
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'bold',
        src: assets.fontGraphikRegular,
      },
    ]);
  };

  renderSvgIconsCSS = () => {
    const svgIconsCSS = generateSVGIconRules('svg-icon-', {
      whatsapp: assets.iconWhatsapp,
      telegram: assets.iconTelegram,
      facebook: assets.iconFacebook,
      skype: assets.iconSkype,
      viber: assets.iconViber,
      vk: assets.iconVK,
    });
    this.setState({ svgIconsCSS });
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

  onPopupToggle = () => {
    this.setState({
      isPopupOpen: !this.state.isPopupOpen,
      isPopupOpeningAnimation: true,
    });
    setTimeout(() => {
      this.setState({ isPopupOpeningAnimation: false });
    });
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      isButtonHidden,
      isPopupOpen,
      isPopupOpeningAnimation,
      unreadMessagesCount,
      outsideIframeCSS,
      insideIframeCSS,
      detectedBrowser,
      currentView,
    } = this.state;

    const visibleUnreadMessagesCount = unreadMessagesCount > 99 ? '99+' : unreadMessagesCount;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeCSS }}/>

        {!isButtonHidden && (
          <button className={cn({
            'elixirchat-widget-button': true,
            'elixirchat-widget-button--widget-open': isPopupOpen,
          })} onClick={() => isPopupOpen ? elixirChatWidget.closePopup() : elixirChatWidget.openPopup()}>
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
          'elixirchat-widget-iframe--visible': isPopupOpen,
          'elixirchat-widget-iframe--opening': isPopupOpeningAnimation,
        })}>
          <Fragment>
            <style dangerouslySetInnerHTML={{ __html: insideIframeCSS }}/>
            {currentView.view === 'chat' && (
              <Chat className={`elixirchat-browser--${detectedBrowser}`} elixirChatWidget={elixirChatWidget}/>
            )}
            {currentView.view === 'welcome-screen' && (
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
