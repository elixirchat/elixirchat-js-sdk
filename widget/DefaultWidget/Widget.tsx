import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
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

import {
  UNREAD_COUNTER_MESSAGES_CHANGE,
  UNREAD_COUNTER_REPLIES_CHANGE,
  UNREAD_COUNTER_SUBSCRIBE_SUCCESS,
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
  unreadRepliesCount: number;
  detectedBrowser: string;
  outsideIframeStyles: string;
  insideIframeStyles: string;
  widgetView: string;
  widgetViewIsAnimating: null | string;
  widgetIsPopupOpen: boolean;
  widgetIsPopupOpeningAnimation: boolean;
  widgetIsButtonHidden: boolean;
}

export class Widget extends Component<IWidgetProps, IWidgetState> {

  state = {
    unreadMessagesCount: 0,
    unreadRepliesCount: 0,
    detectedBrowser: null,
    outsideIframeStyles: '',
    insideIframeStyles: '',
    widgetView: '',
    widgetViewIsAnimating: null,
    widgetIsPopupOpen: false,
    widgetIsPopupOpeningAnimation: false,
    widgetIsButtonHidden: false,

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
    elixirChatWidget.on(UNREAD_COUNTER_SUBSCRIBE_SUCCESS, this.playNotificationOnNewUnreadReplies);
    elixirChatWidget.on(WIDGET_NAVIGATE_TO, this.onViewChange);
    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, this.onPopupToggle);

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
    this.setState({ widgetViewIsAnimating: true });
    setTimeout(() => {
      this.setState({
        widgetView,
        widgetViewIsAnimating: false
      });
    }, 400);
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
    notification.play().then(() => {
      notification.pause();
      notification.currentTime = 0;
    });
    if (e.target.tagName !== 'TEXTAREA') { // In Firefox, click on textarea doesn't unlock autoplay
      e.currentTarget.removeEventListener(e.type, this.unlockNotificationSoundAutoplay);
    }
  };

  playNotificationSound = () => {
    const notification = new Audio(this.widgetAssets.assets.mp3.notificationSound);
    try {
      notification.play();
    }
    catch (e) {
      console.error('Unable to play notification sound before any action was taken by the user in the current browser tab');
    }
  };

  playNotificationOnNewUnreadReplies = (unreadCounterInitialState) => {
    const { elixirChatWidget } = this.props;
    this.setState({ unreadRepliesCount: unreadCounterInitialState.unreadRepliesCount });

    elixirChatWidget.on(UNREAD_COUNTER_REPLIES_CHANGE, (unreadRepliesCount) => {
      if (unreadRepliesCount > this.state.unreadRepliesCount && !elixirChatWidget.widgetIsMuted) {
        this.playNotificationSound();
      }
      this.setState({ unreadRepliesCount });
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
            <style dangerouslySetInnerHTML={{ __html: insideIframeStyles }}/>

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
