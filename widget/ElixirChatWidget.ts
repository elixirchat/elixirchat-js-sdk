import 'babel-polyfill';
import { logEvent } from '../utilsCommon';
import { insertElement, generateFontFaceRule } from '../utilsWidget';
// import { appendWidgetIframeContent } from './DefaultWidget/Chat';
import { renderWidget, renderIframeContent } from './DefaultWidget/Widget';
import styles from './DefaultWidget/styles';
import assets from './DefaultWidget/assets';

console.log('___ styles', styles);

let ElixirChat = window.ElixirChat;
if (process.env.NODE_ENV === 'development') {
  ElixirChat = require('../sdk').default;
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

export interface IElixirChatWidgetAppendWidgetConfig {
  container: HTMLElement;
  iframeStyles?: string;
  visibleByDefault?: boolean;
}

export class ElixirChatWidget extends ElixirChat {

  public container: HTMLElement;
  public iframeStyles: string;
  public visibleByDefault: boolean;
  public imagePreviewHorizontalPaddings: number = 100;
  public imagePreviewVerticalPaddings: number = 120;

  public widgetUnreadCount: number;
  public widgetIsVisible: boolean = false;
  public widgetImagePreviewIsVisible: boolean = false;

  public widgetChatReactComponent: any = {};
  public widgetChatIframe: HTMLIFrameElement;
  public widgetButton: HTMLElement;
  public widgetImagePreview: HTMLElement;
  public widgetImagePreviewImg: HTMLImageElement;

  protected onToggleChatVisibilityCallbacks: Array<(isOpen: boolean) => void> = [];

  protected injectGlobalStyles(styles: string): void {
    insertElement('style', { innerHTML: styles, type: 'text/css' }, this.container);
  }

  protected injectIframeStyles(styles: string): void {
    const iframeContainer = <HTMLElement>this.widgetChatIframe.contentWindow.document.querySelector('main');
    insertElement('style', { innerHTML: styles, type: 'text/css' }, iframeContainer);
  }

  protected appendWidgetButton(): void {
    const button = insertElement('button', { className: 'elixirchat-widget-button' }, this.container);
    insertElement('span', { className: 'elixirchat-widget-button-counter' }, button);

    button.addEventListener('click', this.toggleChatVisibility);
    this.widgetButton = button;

    this.injectGlobalStyles([
      generateFontFaceRule('Graphik', 'normal', assets.fontGraphikRegularWeb),
      generateFontFaceRule('elixirchat-icons', null, assets.fontElixirchatIcons),
    ].join('\n'));
    this.injectGlobalStyles(styles.Widget, this.container);
    this.injectGlobalStyles(styles.icons, this.container);
  }

  protected appendChatIframe(): void {
    return new Promise((resolve) => {

      const iframe = <HTMLIFrameElement>document.createElement('iframe');
      iframe.className = 'elixirchat-widget-iframe';
      iframe.hidden = true;

      iframe.onload = () => {
        iframe.contentWindow.document.body.appendChild(insertElement('main'));
        if (this.widgetChatIframe) {
          this.widgetChatIframe.remove();
        }
        this.widgetChatIframe = iframe;

        const iframeContainer = <HTMLElement>iframe.contentWindow.document.querySelector('main');
        this.widgetChatReactComponent = appendWidgetIframeContent(iframeContainer, this);

        this.injectIframeStyles([
          generateFontFaceRule('Graphik', 'normal', assets.fontGraphikRegularWeb),
          generateFontFaceRule('Graphik', 'bold', assets.fontGraphikBoldWeb),
          generateFontFaceRule('elixirchat-icons', null, assets.fontElixirchatIcons),
        ].join('\n'));
        this.injectIframeStyles(this.iframeStyles);
        this.injectIframeStyles(styles.icons);

        resolve();
      };

      this.container.appendChild(iframe);
    });
  }

  protected appendImagePreview(): void {
    const container = insertElement('div', { className: 'elixirchat-widget-image-preview' }, this.container);
    const inner = insertElement('div', { className: 'elixirchat-widget-image-preview__inner' }, container);
    const img = insertElement('img', { className: 'elixirchat-widget-image-preview__img' }, inner);

    const imagePreviewImgClassNameLoading = 'elixirchat-widget-image-preview__img--loading';

    container.onclick = () => this.closeImagePreview();
    img.onload = () => {
      img.classList.remove(imagePreviewImgClassNameLoading);
    };
    this.widgetImagePreview = container;
    this.widgetImagePreviewImg = img;
  }

  protected calculateImagePreviewSize(imageNativeWidth, imageNativeHeight): { width: number, height: number } {
    const maxImageWidth = window.innerWidth - this.imagePreviewHorizontalPaddings; // window viewport width minus horizontal paddings
    let width = imageNativeWidth;
    let height = imageNativeHeight;
    if (imageNativeWidth > maxImageWidth) {
      const ratio = maxImageWidth / imageNativeWidth;
      width = maxImageWidth;
      height = Math.round(imageNativeHeight * ratio);
    }
    return { width, height };
  }

  protected calculateImagePreviewTopMargin(imageDisplayHeight): number {
    const availableVerticalSpace = window.innerHeight - this.imagePreviewVerticalPaddings;
    if (availableVerticalSpace < imageDisplayHeight) {
      return 0;
    }
    else {
      return (availableVerticalSpace - imageDisplayHeight) / 2;
    }
  }

  protected openImagePreview(previewData): void {
    const { width, height, url, name } = previewData;
    const displaySize = this.calculateImagePreviewSize(width, height);

    this.widgetImagePreviewImg.style.marginTop = this.calculateImagePreviewTopMargin(displaySize.height) + 'px';
    this.widgetImagePreviewImg.width = displaySize.width;
    this.widgetImagePreviewImg.height = displaySize.height;
    this.widgetImagePreviewImg.src = url;
    this.widgetImagePreviewImg.alt = name;
    this.widgetImagePreviewImg.classList.add('elixirchat-widget-image-preview__img--loading');

    this.widgetImagePreviewIsVisible = true;
    this.widgetImagePreview.classList.add('elixirchat-widget-image-preview--visible');
  }

  protected closeImagePreview(): void {
    this.widgetImagePreviewIsVisible = false;
    this.widgetImagePreview.classList.remove('elixirchat-widget-image-preview--visible');
  }

  public setUnreadCount = (count: number): void => {
    const counter: HTMLElement = this.widgetButton.querySelector('.elixirchat-widget-button-counter');
    const classNameHasUnread = 'elixirchat-widget-button-counter--has-unread';
    this.widgetUnreadCount = +count || 0;

    if (count) {
      counter.classList.add(classNameHasUnread);
      counter.innerText = count;
    }
    else {
      counter.classList.remove(classNameHasUnread);
      counter.innerText = '';
    }
  };

  public toggleChatVisibility = (): void => {
    const iframeClassNameOpening = 'elixirchat-widget-iframe--opening';
    const iframeClassNameVisible = 'elixirchat-widget-iframe--visible';
    const buttonClassNameVisible = 'elixirchat-widget-button--visible';

    this.widgetIsVisible = !this.widgetIsVisible;
    if (this.widgetIsVisible) {
      this.widgetButton.classList.add(buttonClassNameVisible);
      this.widgetChatIframe.classList.add(iframeClassNameOpening, iframeClassNameVisible);
      setTimeout(() => {
        this.widgetChatIframe.classList.remove(iframeClassNameOpening);
      }, 0);
    }
    else {
      this.widgetButton.classList.remove(buttonClassNameVisible);
      this.widgetChatIframe.classList.remove(iframeClassNameVisible);
    }
    this.onToggleChatVisibilityCallbacks.forEach(callback => callback(this.widgetIsVisible));
  };

  public onToggleChatVisibility = (callback) => {
    this.onToggleChatVisibilityCallbacks.push(callback);
  };

  public appendWidget = async ({ container, iframeStyles = '', visibleByDefault = false }: IElixirChatWidgetAppendWidgetConfig): void => {
    if (!(container instanceof HTMLElement)) {
      const errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
      logEvent(this.debug, errorMessage, { container, iframeStyles }, 'error');
      return;
    }

    this.container = container;
    this.iframeStyles = iframeStyles;
    this.visibleByDefault = visibleByDefault;

    this.widgetChatReactComponent = renderWidget(this.container, this);

    // await this.appendChatIframe();
    // this.appendWidgetButton();
    // this.appendImagePreview();

    // if (this.visibleByDefault) {
    //   this.toggleChatVisibility();
    // }

    window.__this = this;

    logEvent(this.debug, 'Appended ElixirChat default widget', { container });
    return this.widgetChatReactComponent;
  };
}

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
