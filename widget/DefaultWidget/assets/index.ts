/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single bundle JS file, not copy to /dist folder as separate files
 */

const fs = require('fs');
const dataUrlWoff = 'data:font/woff;base64,';
const dataUrlSvg = 'data:image/svg+xml;base64,';

const GraphikBoldWeb = dataUrlWoff + fs.readFileSync(__dirname + '/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' });
const GraphikRegularWeb = dataUrlWoff + fs.readFileSync(__dirname + '/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' });
const ChatAttachIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-attach-icon-black.svg', { encoding: 'base64' });
const ChatAttachIconBlue = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-attach-icon-blue.svg', { encoding: 'base64' });
const ChatCloseIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-close-icon-black.svg', { encoding: 'base64' });
const ChatRemoveIconBlue = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-remove-icon-blue.svg', { encoding: 'base64' });
const ChatScreenshotIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-screenshot-icon-black.svg', { encoding: 'base64' });
const ChatScreenshotIconBlue = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-screenshot-icon-blue.svg', { encoding: 'base64' });
const ChatTypingIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-typing-icon-black.svg', { encoding: 'base64' });
const WidgetIconChat = dataUrlSvg + fs.readFileSync(__dirname + '/images/widget-icon-chat.svg', { encoding: 'base64' });
const WidgetIconClose = dataUrlSvg + fs.readFileSync(__dirname + '/images/widget-icon-close.svg', { encoding: 'base64' });

export const assetsBase64 = {
  GraphikBoldWeb,
  GraphikRegularWeb,
  ChatAttachIconBlack,
  ChatAttachIconBlue,
  ChatCloseIconBlack,
  ChatRemoveIconBlue,
  ChatScreenshotIconBlack,
  ChatScreenshotIconBlue,
  ChatTypingIconBlack,
  WidgetIconChat,
  WidgetIconClose,
};

/**
 * For older browsers, CSS variables are automatically replaced in CSS with base64 encoded assets
 * @see ElixirChatWidget.replaceCssVariablesWithDataUrls()
 */
export const iframeAssetUrlCssVars = `:root {
  --ChatAttachIconBlack:      url(${ChatAttachIconBlack});
  --ChatAttachIconBlue:       url(${ChatAttachIconBlue});
  --ChatCloseIconBlack:       url(${ChatCloseIconBlack});
  --ChatRemoveIconBlue:       url(${ChatRemoveIconBlue});
  --ChatScreenshotIconBlack:  url(${ChatScreenshotIconBlack});
  --ChatScreenshotIconBlue:   url(${ChatScreenshotIconBlue});
  --ChatTypingIconBlack:      url(${ChatTypingIconBlack});
}`;
export const globalAssetUrlCssVars = `:root {
  --WidgetIconChat:           url(${WidgetIconChat});
  --WidgetIconClose:          url(${WidgetIconClose});
}`;
