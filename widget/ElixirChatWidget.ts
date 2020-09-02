import 'babel-polyfill';
import {_find, getJSONFromLocalStorage, logEvent, setToLocalStorage} from '../utilsCommon';
import { renderWidgetReactComponent } from './DefaultWidget/Widget';
import { IFontRule } from './FontExtractor';
import {
  WIDGET_IFRAME_READY,
  WIDGET_MUTE_TOGGLE,
  WIDGET_POPUP_TOGGLE,
  WIDGET_NAVIGATE_TO,
  WIDGET_DATA_SET,
  // WIDGET_RENDERED,
} from './ElixirChatWidgetEventTypes';

import {
  // MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS,
  JOIN_ROOM_SUCCESS,
} from '../sdk/ElixirChatEventTypes';
import {IJoinRoomChannel, IJoinRoomData} from '../sdk/ElixirChat';


let ElixirChat = window.ElixirChat;
if (!ElixirChat) {
  ElixirChat = require('../dist/sdk').default;
  /**
   * dist/sdk.js is generated on fly depending on the context:
   *
   *  - When developing SDK locally (npm run dev), dist/sdk.js exports sdk/ElixirChat.ts
   *    @see bin/dev.sh
   *
   *  - When building SDK locally (npm run build), dist/sdk.js is empty
   *    so that sdk.js is not included into default-widget.js bundle
   *    @see bin/build.sh
   *
   *  - When 'elixirchat-js-sdk' in being installed via npm in another project (npm install elixirchat-js-sdk),
   *    dist/sdk.js exports build/sdk.js so that sdk.js IS included into default-widget.js bundle
   *    and it'd be possible to use `import ElixirChatWidget from 'elixirchat-js-sdk/widget'`
   *    @see bin/postinstall.sh
   */
}

if (!ElixirChat) {
  logEvent(
    true,
    'Cannot find ElixirChat SDK. Are you sure you imported SDK (ether via "import" or via the <script/> tag)?\n' +
    'See: https://github.com/elixirchat/elixirchat-js-sdk#add-default-widget', {
      NODE_ENV: process.env.NODE_ENV
    }, 'error'
  );
}

export interface IElixirChatWidgetConfig {
  container: HTMLElement;
  email?: string;
  mainTitle?: string;
  chatSubtitle?: string;
  fonts?: Array<IFontRule>;
  enabledChannels?: Array<string>;
  companyLogoUrl?: string;
  hideDefaultButton?: boolean;
  iframeCSS?: string;
}

export class ElixirChatWidget extends ElixirChat {

  public widgetConfig: IElixirChatWidgetConfig = {};
  public widgetIsMuted: boolean;
  public widgetIsPopupOpen: boolean;
  public widgetIsButtonHidden: boolean;
  public widgetView: string;
  public widgetMainTitle: string;
  public widgetChatSubtitle: string;
  public widgetCompanyLogoUrl: string | null;
  public widgetSupportEmail: string;
  public widgetChannels: Array<IJoinRoomChannel>;

  public widgetDefaultParams = {
    isMuted: false,
    isPopupOpen: false,
    isButtonHidden: false,
    view: 'welcome-screen',
    mainTitle: 'Служба поддержки',
    chatSubtitle: 'Как мы можем вам помочь?',
    supportEmail: 'support@elixir.chat',
  };

  public widgetComponents: any = {};
  public widgetIFrameDocument: Document = {};


  public appendWidget = async (widgetConfig: IElixirChatWidgetConfig): void => {
    this.widgetConfig = widgetConfig || {};
    const container = this.widgetConfig.container;

    if (typeof window !== 'undefined') {
      window.elixirChatWidget = this;
    }
    if (!this.isInitialized) {
      const errorMessage = 'ElixirChat SDK has not been initialized yet';
      this.logError(errorMessage);
      throw errorMessage;
    }
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      this.logError(errorMessage, this.widgetConfig);
      throw errorMessage;
    }

    this.initializeWidget();
    const reactComponent = renderWidgetReactComponent(container, this);

    this.logInfo('Appended ElixirChat default widget', container);
    return reactComponent;
  };

  private initializeWidget(): void {
    this.on(WIDGET_IFRAME_READY, (iframeWindow) => {
      this.widgetIFrameDocument = iframeWindow.document;
    });

    // TODO: fix
    // this.on(MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS, () => {
    //   this.triggerEvent(WIDGET_RENDERED);
    // });

    // TODO: set some widget data on join_room_error
    this.on(JOIN_ROOM_SUCCESS, joinRoomData => {
      this.setWidgetData(joinRoomData);
      this.togglePopup(this.widgetIsPopupOpen);
      this.toggleMute(this.widgetIsMuted);
      this.navigateTo({ view: this.widgetView });
    });
  }

  private setWidgetData(joinRoomData: IJoinRoomData){
    const {
      view,
      mainTitle,
      chatSubtitle,
      isMuted,
      isPopupOpen,
      isButtonHidden,
      supportEmail,
    } = this.widgetDefaultParams;

    this.widgetIsPopupOpen = joinRoomData.isPopupOpen || getJSONFromLocalStorage('elixirchat-widget-is-visible', isPopupOpen);
    this.widgetMainTitle = this.widgetConfig.mainTitle || joinRoomData.mainTitle || mainTitle;
    this.widgetChatSubtitle = this.widgetConfig.chatSubtitle || joinRoomData.chatSubtitle || chatSubtitle;
    this.widgetCompanyLogoUrl = this.widgetConfig.companyLogoUrl || joinRoomData.logoUrl || null;

    this.widgetIsMuted = getJSONFromLocalStorage('elixirchat-notifications-muted', isMuted);
    this.widgetIsButtonHidden = this.widgetConfig.hideDefaultButton || isButtonHidden;
    this.widgetSupportEmail = this.widgetConfig.email || supportEmail;
    this.widgetView = getJSONFromLocalStorage('elixirchat-current-view', view);

    console.log('__ yyy', getJSONFromLocalStorage('elixirchat-current-view'), '///', view);

    this.widgetChannels = (this.widgetConfig.enabledChannels || []).map(channelType => {
      const normalizedChannelType = channelType?.toLowerCase?.();
      return _find(joinRoomData.channels, { type: normalizedChannelType });
    });

    this.triggerEvent(WIDGET_DATA_SET, this, { firedOnce: true });
  }

  public togglePopup(isOpen: boolean): void {
    if (this.widgetIsPopupOpen !== isOpen) {
      this.widgetIsPopupOpen = isOpen;
      setToLocalStorage('elixirchat-widget-is-visible', isOpen);
      this.logInfo((isOpen ? 'Opened' : 'Closed') + ' widget popup');
      this.triggerEvent(WIDGET_POPUP_TOGGLE, isOpen);
    }
  };

  private toggleMute(isMuted: boolean): void {
    if (this.widgetIsMuted !== isMuted) {
      this.widgetIsMuted = isMuted;
      setToLocalStorage('elixirchat-notifications-muted', isMuted);
      this.logInfo((isMuted ? 'Muted' : 'Unmuted') + ' widget popup');
      this.triggerEvent(WIDGET_MUTE_TOGGLE, isMuted);
    }
  };

  public openPopup = (): void => {
    this.togglePopup(true);
  };

  public closePopup = (): void => {
    this.togglePopup(false);
  };

  public mute = (): void => {
    this.toggleMute(true);
  };

  public unmute = (): void => {
    this.toggleMute(false);
  };

  public navigateTo = (params: { view: string, animation?: string }) => {
    if (params?.view !== this.widgetView) {
      this.widgetView = params.view;
      setToLocalStorage('elixirchat-current-view', params.view);
      this.triggerEvent(WIDGET_NAVIGATE_TO, params);
    }
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
