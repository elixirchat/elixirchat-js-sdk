import { ElixirChatWidget } from '../ElixirChatWidget';
import { generateFontFaceCSS } from './FontExtractor';

// CSS
import IconsCSS from 'bundle-text:../dist/styles/Icons.css';
import AlertCSS from 'bundle-text:../dist/styles/Alert.css';
import TooltipCSS from 'bundle-text:../dist/styles/Tooltip.css';
import ChatCSS from 'bundle-text:../dist/styles/Chat.css';
import ChatMessagesCSS from 'bundle-text:../dist/styles/ChatMessages.css';
import RatingCSS from 'bundle-text:../dist/styles/Rating.css';
import ChatTextareaCSS from 'bundle-text:../dist/styles/ChatTextarea.css';
import MessageSearchCSS from 'bundle-text:../dist/styles/MessageSearch.css';
import WelcomeScreenCSS from 'bundle-text:../dist/styles/WelcomeScreen.css';
import FormattedMarkdownCSS from 'bundle-text:../dist/styles/FormattedMarkdown.css';
import FullScreenPreviewCSS from 'bundle-text:../dist/styles/FullScreenPreview.css';
import RatingCommentModalCSS from 'bundle-text:../dist/styles/RatingCommentModal.css';
import WidgetOutsideIFrameCSS from 'bundle-text:../dist/styles/WidgetOutsideIFrame.css';
import WidgetInsideIFrameCSS from 'bundle-text:../dist/styles/WidgetInsideIFrame.css';

// Fonts
import graphikBoldUrl from './DefaultWidget/assets/fonts/Graphik-Bold-Web.woff?url';
import graphikMediumUrl from './DefaultWidget/assets/fonts/Graphik-Medium-Web.woff?url';
import graphikRegularUrl from './DefaultWidget/assets/fonts/Graphik-Regular-Web.woff?url';
import graphikRegularItalicUrl from './DefaultWidget/assets/fonts/Graphik-RegularItalic-Web.woff?url';
import elixirchatIconsUrl from './DefaultWidget/assets/fonts/elixirchat-icons.woff?url';

// SVG иконки
import whatsappSvgUrl from './DefaultWidget/assets/images/channel-whatsapp.svg?url';
import telegramSvgUrl from './DefaultWidget/assets/images/channel-telegram.svg?url';
import facebookSvgUrl from './DefaultWidget/assets/images/channel-facebook.svg?url';
import viberSvgUrl from './DefaultWidget/assets/images/channel-viber.svg?url';
import vkontakteSvgUrl from './DefaultWidget/assets/images/channel-vk.svg?url';

// Аудио
import notificationSoundUrl from './DefaultWidget/assets/audio/notification.mp3?url';

export class WidgetAssets {

  public outsideIframeStyles = '';
  public insideIframeStyles = '';
  public styles: Record<string, string> = {};
  public assets: Record<string, Record<string, string>> = {};

  constructor(elixirChatWidget: ElixirChatWidget){
    const styles = this.getStyles();
    const assets = this.getAssets();
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

  getStyles = () => ({
    Icons: IconsCSS,
    Alert: AlertCSS,
    Tooltip: TooltipCSS,
    Chat: ChatCSS,
    ChatMessages: ChatMessagesCSS,
    Rating: RatingCSS,
    ChatTextarea: ChatTextareaCSS,
    MessageSearch: MessageSearchCSS,
    WelcomeScreen: WelcomeScreenCSS,
    FormattedMarkdown: FormattedMarkdownCSS,
    FullScreenPreview: FullScreenPreviewCSS,
    RatingCommentModal: RatingCommentModalCSS,
    WidgetOutsideIFrame: WidgetOutsideIFrameCSS,
    WidgetInsideIFrame: WidgetInsideIFrameCSS,
  });

  getAssets = () => ({
    woff: {
      graphikBold: graphikBoldUrl,
      graphikMedium: graphikMediumUrl,
      graphikRegular: graphikRegularUrl,
      graphikRegularItalic: graphikRegularItalicUrl,
      elixirchatIcons: elixirchatIconsUrl,
    },
    svg: {
      whatsapp: whatsappSvgUrl,
      telegram: telegramSvgUrl,
      facebook: facebookSvgUrl,
      viber: viberSvgUrl,
      vkontakte: vkontakteSvgUrl,
    },
    mp3: {
      notificationSound: notificationSoundUrl,
    },
  });

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
    const cssRules = [];
    for (const iconName in svgIcons) {
      cssRules.push(
        `.svg-icon-${iconName} { background-image: url("${svgIcons[iconName]}"); }`
      );
    }
    return cssRules.join('\n');
  };
}
