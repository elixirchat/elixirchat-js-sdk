import { ElixirChatWidget } from '../ElixirChatWidget';
import { generateFontFaceCSS } from './FontExtractor';
const fs = require('fs'); // This is a Parcel limited implementation of "fs", @see https://en.parceljs.org/javascript.html#javascript

export class WidgetAssets {

  public outsideIframeStyles = '';
  public insideIframeStyles = '';
  public styles = {};
  public assets = {};

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
      elixirChatWidget.widgetConfig.iframeCSS || '',
      fontFaceCSS,
      svgIconsCSS,
      styles.Icons,
      styles.Alert,
      styles.Tooltip,
      styles.Chat,
      styles.ChatMessages,
      styles.ChatTextarea,
      styles.WelcomeScreen,
      styles.FormattedMarkdown,
      styles.WidgetInsideIFrame,
    ].join('\n');
  }

  importCSSFiles = () => {
    /**
     * How it works:
     * 1. SCSS files from widget/DefaultWidget/styles are transpiled into dist/styles
     * 2. Then dist/styles/*.css are imported as strings via fs.readFileSync
     *
     * Why?
     * Because all JS, CSS and assets need to be a single JS file (default-widget.min.js).
     * Simply importing CSS files won't merge them into the JS bundle.
     */
    return {
      Icons:                fs.readFileSync(__dirname + '../../dist/styles/Icons.css', 'utf8'),
      Alert:                fs.readFileSync(__dirname + '../../dist/styles/Alert.css', 'utf8'),
      Tooltip:              fs.readFileSync(__dirname + '../../dist/styles/Tooltip.css', 'utf8'),
      Chat:                 fs.readFileSync(__dirname + '../../dist/styles/Chat.css', 'utf8'),
      ChatMessages:         fs.readFileSync(__dirname + '../../dist/styles/ChatMessages.css', 'utf8'),
      ChatTextarea:         fs.readFileSync(__dirname + '../../dist/styles/ChatTextarea.css', 'utf8'),
      WelcomeScreen:        fs.readFileSync(__dirname + '../../dist/styles/WelcomeScreen.css', 'utf8'),
      FormattedMarkdown:    fs.readFileSync(__dirname + '../../dist/styles/FormattedMarkdown.css', 'utf8'),
      FullScreenPreview:    fs.readFileSync(__dirname + '../../dist/styles/FullScreenPreview.css', 'utf8'),
      WidgetOutsideIFrame:  fs.readFileSync(__dirname + '../../dist/styles/WidgetOutsideIFrame.css', 'utf8'),
      WidgetInsideIFrame:   fs.readFileSync(__dirname + '../../dist/styles/WidgetInsideIFrame.css', 'utf8'),
    };
  };

  importAssetFiles = () => {
    /**
     * Assets are imported as base64 via fs.readFileSync and converted into Blob URLs
     *
     * Why?
     * Because all JS, CSS and assets need to be a single JS file (default-widget.min.js).
     * Simply importing CSS files won't merge them into the JS bundle.
     */
    const base64WoffData = {
      graphikBold:          fs.readFileSync(__dirname + '/DefaultWidget/assets/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' }),
      graphikMedium:        fs.readFileSync(__dirname + '/DefaultWidget/assets/fonts/Graphik-Medium-Web.woff', { encoding: 'base64' }),
      graphikRegular:       fs.readFileSync(__dirname + '/DefaultWidget/assets/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' }),
      graphikRegularItalic: fs.readFileSync(__dirname + '/DefaultWidget/assets/fonts/Graphik-RegularItalic-Web.woff', { encoding: 'base64' }),
      elixirchatIcons:      fs.readFileSync(__dirname + '/DefaultWidget/assets/fonts/elixirchat-icons.woff', { encoding: 'base64' }),
    };
    const base64SvgData = {
      whatsapp:             fs.readFileSync(__dirname + '/DefaultWidget/assets/images/channel-whatsapp.svg', { encoding: 'base64' }),
      telegram:             fs.readFileSync(__dirname + '/DefaultWidget/assets/images/channel-telegram.svg', { encoding: 'base64' }),
      facebook:             fs.readFileSync(__dirname + '/DefaultWidget/assets/images/channel-facebook.svg', { encoding: 'base64' }),
      viber:                fs.readFileSync(__dirname + '/DefaultWidget/assets/images/channel-viber.svg', { encoding: 'base64' }),
      vk:                   fs.readFileSync(__dirname + '/DefaultWidget/assets/images/channel-vk.svg', { encoding: 'base64' }),
    };
    const base64Mp3Data = {
      notificationSound:    fs.readFileSync(__dirname + '/DefaultWidget/assets/audio/notification.mp3', { encoding: 'base64' }),
    };
    return {
      woff: this.base64FilesToBlobUrls(base64WoffData, 'woff'),
      svg: this.base64FilesToBlobUrls(base64SvgData, 'svg'),
      mp3: this.base64FilesToBlobUrls(base64Mp3Data, 'mp3'),
    };
  };

  base64FilesToBlobUrls = (base64Data, format) => {
    const contentTypes = {
      woff: 'font/woff',
      svg: 'image/svg+xml',
      mp3: 'audio/mpeg',
    };
    const blobUrls = {};
    for (let key in base64Data) {
      const contentType = contentTypes[format];
      blobUrls[key] = this.singleBase64StringToBlobUrl(base64Data[key], contentType);
    }
    return blobUrls;
  };

  singleBase64StringToBlobUrl = (base64String, contentType, sliceSize = 512) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

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

  generateFontFaceCSS = (fonts) => {
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
        fontWeight: 'normal',
        fontStyle: 'normal',
        src: [{
          url: fonts.graphikRegular,
          format: 'woff',
        }],
      },
      {
        fontFamily: 'Graphik',
        fontWeight: 'normal',
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
        fontWeight: 'bold',
        src: [{
          url: fonts.graphikBold,
          format: 'woff',
        }],
      },
    ]);
  };

  generateSvgIconsCSS = (svgIcons) => {
    const cssRules = [];
    for (let iconName in svgIcons) {
      cssRules.push(
        `.svg-icon-${iconName} { background-image: url("${svgIcons[iconName]}"); }`
      );
    }
    return cssRules.join('\n');
  };
}
