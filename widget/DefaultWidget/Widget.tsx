import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { ElixirChatWidget } from '../ElixirChatWidget';
import { FontExtractor, generateFontFaceCSS } from '../FontExtractor';
import { WidgetAssets } from '../WidgetAssets';
import { Alert } from './Alert';
import { Chat } from './Chat';
import { IFrameWrapper } from './IFrameWrapper';
import { WelcomeScreen } from './WelcomeScreen';
import { FullScreenPreview } from './FullScreenPreview';
import { exposeComponentToGlobalScope } from '../../utilsWidget';
import { cn, detectBrowser } from '../../utilsCommon';
import trl from './trl.json';

import {
  UNREAD_COUNTER_MESSAGES_CHANGE,
  UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES,
} from '../../sdk/ElixirChatEventTypes';

import {
  WIDGET_DATA_SET,
  WIDGET_NAVIGATE_TO,
  WIDGET_POPUP_TOGGLE,
} from '../ElixirChatWidgetEventTypes';


export interface IWidgetProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IWidgetState {
  unreadMessagesCount: number;
  detectedBrowser: string;
  outsideIframeStyles: string;
  insideIframeStyles: string;
  widgetView: string;
  widgetViewAnimation: null | string;
  widgetIsPopupOpen: boolean;
  widgetIsPopupOpeningAnimation: boolean;
  widgetIsButtonHidden: boolean;
  searchFormShow: boolean;
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    unreadMessagesCount: 0,
    detectedBrowser: null,
    outsideIframeStyles: '',
    insideIframeStyles: '',
    widgetView: '',
    widgetViewAnimation: null,
    widgetIsPopupOpen: false,
    widgetIsPopupOpeningAnimation: false,
    widgetIsButtonHidden: true,
    searchFormShow: true,
  };

  fontExtractor: FontExtractor;
  widgetAssets: WidgetAssets;

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope(this, elixirChatWidget);

    this.widgetAssets = new WidgetAssets(elixirChatWidget);
    this.fontExtractor = new FontExtractor(elixirChatWidget.widgetConfig.fonts, window);
    this.fontExtractor.extract(fontRules => {
      this.appendToStyles({
        insideIframeStyles: generateFontFaceCSS(fontRules),
      });
    });

    const { outsideIframeStyles, insideIframeStyles } = this.widgetAssets;
    this.appendToStyles({ outsideIframeStyles, insideIframeStyles });

    elixirChatWidget.on(WIDGET_DATA_SET, () => {
      const { widgetIsButtonHidden, widgetIsPopupOpen, widgetView } = elixirChatWidget;
      this.setState({ widgetIsButtonHidden, widgetIsPopupOpen, widgetView });
    });

    elixirChatWidget.on(UNREAD_COUNTER_MESSAGES_CHANGE, unreadMessagesCount => {
      this.setState({ unreadMessagesCount });
    });
    elixirChatWidget.on(UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES, this.playNotificationSound);
    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, this.onPopupToggle);
    elixirChatWidget.on(WIDGET_NAVIGATE_TO, this.onViewChange);

    this.setState({ detectedBrowser: detectBrowser() });
    document.body.addEventListener('click', this.unlockNotificationSoundAutoplay);
  }

  appendToStyles = ({ outsideIframeStyles, insideIframeStyles }) => {
    this.setState({
      outsideIframeStyles: this.state.outsideIframeStyles + '\n\n' + (outsideIframeStyles || ''),
      insideIframeStyles: this.state.insideIframeStyles + '\n\n' + (insideIframeStyles || ''),
    });
  };

  onViewChange = (widgetView) => {
    const widgetViewAnimation = widgetView === 'welcome-screen' ? 'slide-right' : 'slide-left';

    this.setState({ widgetViewAnimation });
    setTimeout(() => {
      this.setState({
        widgetView,
        widgetViewAnimation: null
      });
    }, 250);
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

  /**
   * Prevents browser from muting audio autoplay
   * @see https://medium.com/@curtisrobinson/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
   */
  unlockNotificationSoundAutoplay = (e) => {
    const notification = new Audio(this.widgetAssets.assets.mp3.notificationSound);
    notification.volume = 0;
    notification.play().then(() => {
      notification.pause();
      notification.currentTime = 0;
    });
    if (e.target.tagName !== 'TEXTAREA') { // In Firefox, click on textarea doesn't unlock autoplay
      e.currentTarget.removeEventListener(e.type, this.unlockNotificationSoundAutoplay);
    }
  };

  playNotificationSound = () => {
    const { elixirChatWidget } = this.props;
    if (elixirChatWidget.widgetIsMuted) {
      return;
    }
    const notification = new Audio(this.widgetAssets.assets.mp3.notificationSound);
    try {
      notification.play();
    }
    catch (e) {
      console.error('Unable to play notification sound before any action was taken by the user in the current browser tab');
    }
  };

  render() {
    const { elixirChatWidget } = this.props;
    const {
      widgetIsButtonHidden,
      widgetIsPopupOpen,
      widgetIsPopupOpeningAnimation,
      widgetView,
      widgetViewAnimation,
      unreadMessagesCount,
      outsideIframeStyles,
      insideIframeStyles,
      detectedBrowser,
    } = this.state;

    const visibleUnreadMessagesCount = unreadMessagesCount > 99 ? '99+' : unreadMessagesCount;

    return (
      <Fragment>
        <style dangerouslySetInnerHTML={{ __html: outsideIframeStyles }}/>

        {!widgetIsButtonHidden && (
          <button className={cn({
            'elixirchat-widget-button': true,
            'elixirchat-widget-button--widget-open': widgetIsPopupOpen,
          })} onClick={() => elixirChatWidget.togglePopup()}>
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
            <style dangerouslySetInnerHTML={{ __html: insideIframeStyles }}/>
            <style dangerouslySetInnerHTML={{ __html: elixirChatWidget.widgetConfig.iframeCSS }}/>

            <div className={cn({
              'elixirchat-widget-view': true,
              'elixirchat-widget-view--animating-slide-left': widgetViewAnimation === 'slide-left',
              'elixirchat-widget-view--animating-slide-right': widgetViewAnimation === 'slide-right',
              ['elixirchat-browser--' + detectedBrowser]: true,
            })}>
              {widgetView === 'chat' && (
                <Chat elixirChatWidget={elixirChatWidget}/>
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
  const { client: { locale } } = elixirChatWidget;
  const messages = Object.fromEntries(
    Object.entries(trl).map(([key, value]) => [key, value[locale]])
  );
  let component;
  ReactDOM.render((
    <IntlProvider messages={messages} locale={locale} defaultLocale={locale}>
      <Widget ref={(widget) => {component = widget}} elixirChatWidget={elixirChatWidget} />
    </IntlProvider>
  ), container);
  return component;
}
