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
const ChatReplyRightIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-reply-right-icon-black.svg', { encoding: 'base64' });
const ChatReplyRightIconWhite = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-reply-right-icon-white.svg', { encoding: 'base64' });
const ChatReplyRightIconBlue = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-reply-right-icon-blue.svg', { encoding: 'base64' });
const ChatScreenshotIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-screenshot-icon-black.svg', { encoding: 'base64' });
const ChatScreenshotIconBlue = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-screenshot-icon-blue.svg', { encoding: 'base64' });
const ChatScreenshotIconWhite = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-screenshot-icon-white.svg', { encoding: 'base64' });
const ChatTypingIconBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/chat-typing-icon-black.svg', { encoding: 'base64' });
const WidgetIconChat = dataUrlSvg + fs.readFileSync(__dirname + '/images/widget-icon-chat.svg', { encoding: 'base64' });
const WidgetIconClose = dataUrlSvg + fs.readFileSync(__dirname + '/images/widget-icon-close.svg', { encoding: 'base64' });
const SpinnerXsBlack = dataUrlSvg + fs.readFileSync(__dirname + '/images/spinner-xs-black.svg', { encoding: 'base64' });

export const assetsBase64 = {
  GraphikBoldWeb,
  GraphikRegularWeb,
  ChatAttachIconBlack,
  ChatAttachIconBlue,
  ChatCloseIconBlack,
  ChatRemoveIconBlue,
  ChatReplyRightIconBlack,
  ChatReplyRightIconWhite,
  ChatReplyRightIconBlue,
  ChatScreenshotIconBlack,
  ChatScreenshotIconBlue,
  ChatScreenshotIconWhite,
  ChatTypingIconBlack,
  WidgetIconChat,
  WidgetIconClose,
  SpinnerXsBlack,
};

/**
 * For older browsers, CSS variables are automatically replaced in CSS with base64 encoded assets
 * @see ElixirChatWidget.replaceCssVariablesWithDataUrls()
 */
export const iframeAssetUrlCssVars = `:root {
  --ElixirChatChatAttachIconBlack:      url(${ChatAttachIconBlack});
  --ElixirChatChatAttachIconBlue:       url(${ChatAttachIconBlue});
  --ElixirChatChatCloseIconBlack:       url(${ChatCloseIconBlack});
  --ElixirChatChatRemoveIconBlue:       url(${ChatRemoveIconBlue});
  --ElixirChatReplyRightIconBlack:      url(${ChatReplyRightIconBlack});
  --ElixirChatReplyRightIconWhite:      url(${ChatReplyRightIconWhite});
  --ElixirChatReplyRightIconBlue:       url(${ChatReplyRightIconBlue});
  --ElixirChatChatScreenshotIconBlack:  url(${ChatScreenshotIconBlack});
  --ElixirChatChatScreenshotIconBlue:   url(${ChatScreenshotIconBlue});
  --ElixirChatChatScreenshotIconWhite:  url(${ChatScreenshotIconWhite});
  --ElixirChatChatTypingIconBlack:      url(${ChatTypingIconBlack});
  --ElixirChatSpinnerXsBlack:           url(${SpinnerXsBlack});
}`;
export const globalAssetUrlCssVars = `:root {
  --ElixirChatWidgetIconChat:           url(${WidgetIconChat});
  --ElixirChatWidgetIconClose:          url(${WidgetIconClose});
}`;
