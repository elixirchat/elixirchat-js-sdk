import { ElixirChatWidget } from '@widget/ElixirChatWidget';
import { generateFontFaceCSS } from '@widget/FontExtractor';

function stripBOM(css: string): string {
  return css.replace(/^\uFEFF/, '');
}

// CSS
import IconsCSS from '@root/dist/styles/Icons.css?raw';
import AlertCSS from '@root/dist/styles/Alert.css?raw';
import TooltipCSS from '@root/dist/styles/Tooltip.css?raw';
import ChatCSS from '@root/dist/styles/Chat.css?raw';
import ChatMessagesCSS from '@root/dist/styles/ChatMessages.css?raw';
import RatingCSS from '@root/dist/styles/Rating.css?raw';
import ChatTextareaCSS from '@root/dist/styles/ChatTextarea.css?raw';
import MessageSearchCSS from '@root/dist/styles/MessageSearch.css?raw';
import WelcomeScreenCSS from '@root/dist/styles/WelcomeScreen.css?raw';
import FormattedMarkdownCSS from '@root/dist/styles/FormattedMarkdown.css?raw';
import FullScreenPreviewCSS from '@root/dist/styles/FullScreenPreview.css?raw';
import RatingCommentModalCSS from '@root/dist/styles/RatingCommentModal.css?raw';
import WidgetOutsideIFrameCSS from '@root/dist/styles/WidgetOutsideIFrame.css?raw';
import WidgetInsideIFrameCSS from '@root/dist/styles/WidgetInsideIFrame.css?raw';

// Assets
import graphikBoldUrl from '@defaultWidget/assets/fonts/Graphik-Bold-Web.woff?inline';
import graphikMediumUrl from '@defaultWidget/assets/fonts/Graphik-Medium-Web.woff?inline';
import graphikRegularUrl from '@defaultWidget/assets/fonts/Graphik-Regular-Web.woff?inline';
import graphikRegularItalicUrl from '@defaultWidget/assets/fonts/Graphik-RegularItalic-Web.woff?inline';
import elixirchatIconsUrl from '@defaultWidget/assets/fonts/elixirchat-icons.woff?inline';
import whatsappSvgUrl from '@defaultWidget/assets/images/channel-whatsapp.svg?inline';
import telegramSvgUrl from '@defaultWidget/assets/images/channel-telegram.svg?inline';
import facebookSvgUrl from '@defaultWidget/assets/images/channel-facebook.svg?inline';
import viberSvgUrl from '@defaultWidget/assets/images/channel-viber.svg?inline';
import vkontakteSvgUrl from '@defaultWidget/assets/images/channel-vk.svg?inline';
import notificationSoundUrl from '@defaultWidget/assets/audio/notification.mp3?inline';

function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1] || '';
}

export class WidgetAssets {

  public outsideIframeStyles = '';
  public insideIframeStyles = '';
  public styles: Record<string, string> = {};
  public assets: Record<string, Record<string, string>> = {};

  constructor(elixirChatWidget: ElixirChatWidget){
    const styles = this.importCSSFiles();
    const assets = this.importAssetFiles();
    const fontFaceCSS = this.generateFontFaceCSS(assets.woff);
    const svgIconsCSS = this.generateSvgIconsCSS(assets.svg);

    this.styles = styles;
    this.assets = assets;

    this.outsideIframeStyles = [
      fontFaceCSS,
      styles.Icons,
      styles.FullScreenPreview,
      styles.WidgetOutsideIFrame,
    ].join('\n');

    this.insideIframeStyles = [
      fontFaceCSS,
      svgIconsCSS,
      styles.Icons,
      styles.Alert,
      styles.Tooltip,
      styles.Chat,
      styles.ChatMessages,
      styles.Rating,
      styles.ChatTextarea,
      styles.MessageSearch,
      styles.WelcomeScreen,
      styles.FormattedMarkdown,
      styles.RatingCommentModal,
      styles.WidgetInsideIFrame,
    ].join('\n');
  }

  importCSSFiles = (): Record<string, string> => {
    /**
     * How it works:
     * 1. SCSS files from widget/DefaultWidget/styles are transpiled into dist/styles
     * 2. Then dist/styles/*.css are imported as strings via ?raw
     *
     * Why?
     * Because all JS, CSS and assets need to be a single JS file (default-widget.min.js).
     */
    const cssFiles = {
      Icons:                IconsCSS,
      Alert:                AlertCSS,
      Tooltip:              TooltipCSS,
      Chat:                 ChatCSS,
      ChatMessages:         ChatMessagesCSS,
      Rating:               RatingCSS,
      ChatTextarea:         ChatTextareaCSS,
      MessageSearch:        MessageSearchCSS,
      WelcomeScreen:        WelcomeScreenCSS,
      FormattedMarkdown:    FormattedMarkdownCSS,
      FullScreenPreview:    FullScreenPreviewCSS,
      RatingCommentModal:   RatingCommentModalCSS,
      WidgetOutsideIFrame:  WidgetOutsideIFrameCSS,
      WidgetInsideIFrame:   WidgetInsideIFrameCSS,
    };

    return Object.fromEntries(
      Object.entries(cssFiles).map(([key, value]) => [key, stripBOM(value)])
    );
  };

  importAssetFiles = () => {
    /**
     * Assets are imported as data URLs via ?inline.
     * Fonts & SVG: use data URLs directly in CSS (work in iframe, unlike Blob URLs).
     * MP3: convert to Blob URL for use in Audio().
     */
    const fontDataUrls = {
      graphikBold:          graphikBoldUrl as string,
      graphikMedium:        graphikMediumUrl as string,
      graphikRegular:       graphikRegularUrl as string,
      graphikRegularItalic: graphikRegularItalicUrl as string,
      elixirchatIcons:      elixirchatIconsUrl as string,
    };
    const svgDataUrls = {
      whatsapp:             whatsappSvgUrl as string,
      telegram:             telegramSvgUrl as string,
      facebook:             facebookSvgUrl as string,
      viber:                viberSvgUrl as string,
      vkontakte:            vkontakteSvgUrl as string,
    };
    const base64Mp3Data = {
      notificationSound:    dataUrlToBase64(notificationSoundUrl as string),
    };
    return {
      woff: fontDataUrls,
      svg: svgDataUrls,
      mp3: this.base64FilesToBlobUrls(base64Mp3Data, 'mp3'),
    };
  };

  base64FilesToBlobUrls = (base64Data: Record<string, string>, format: 'woff' | 'svg' | 'mp3'): Record<string, string> => {
    const contentTypes: Record<string, string> = {
      woff: 'font/woff',
      svg: 'image/svg+xml',
      mp3: 'audio/mpeg',
    };
    const blobUrls: Record<string, string> = {};
    for (const key in base64Data) {
      const contentType = contentTypes[format];
      blobUrls[key] = this.singleBase64StringToBlobUrl(base64Data[key], contentType);
    }
    return blobUrls;
  };

  singleBase64StringToBlobUrl = (base64String: string, contentType: string, sliceSize = 512): string => {
    const byteCharacters = atob(base64String);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return URL.createObjectURL(blob);
  };

  generateFontFaceCSS = (fonts: Record<string, string>) => {
    return generateFontFaceCSS([
      {
        fontFamily: 'elixirchat-icons',
        src: [{
          url: fonts.elixirchatIcons,
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '400',
        fontStyle: 'normal',
        src: [{
          url: fonts.graphikRegular,
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '400',
        fontStyle: 'italic',
        src: [{
          url: fonts.graphikRegularItalic,
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '500',
        src: [{
          url: fonts.graphikMedium,
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: '700',
        src: [{
          url: fonts.graphikBold,
          format: 'woff',
        }],
      },
    ]);
  };

  generateSvgIconsCSS = (svgIcons: Record<string, string>) => {
    const cssRules: string[] = [];
    for (const iconName in svgIcons) {
      cssRules.push(
        `.svg-icon-${iconName} { background-image: url("${svgIcons[iconName]}"); }`
      );
    }
    return cssRules.join('\n');
  };
}
