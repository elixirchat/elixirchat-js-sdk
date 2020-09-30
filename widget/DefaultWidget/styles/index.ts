/**
 * SCSS files from widget/DefaultWidget/styles are transpiled into dist/styles
 *
 * Styles are imported as strings via fs.readFileSync in order to include
 * them into a single bundle JS file, not simply copy to /dist folder
 *
 * Note that Parcel bundler utilizes a very limited custom implementation of fs.readFileSync()
 * @see https://en.parceljs.org/javascript.html#javascript
 */

const fs = require('fs');

export default {
  icons:                fs.readFileSync(__dirname + '../../../../dist/styles/icons.css', 'utf8'),
  WidgetOutsideIFrame:  fs.readFileSync(__dirname + '../../../../dist/styles/WidgetOutsideIFrame.css', 'utf8'),
  WidgetInsideIFrame:   fs.readFileSync(__dirname + '../../../../dist/styles/WidgetInsideIFrame.css', 'utf8'),
  Alert:                fs.readFileSync(__dirname + '../../../../dist/styles/Alert.css', 'utf8'),
  Tooltip:              fs.readFileSync(__dirname + '../../../../dist/styles/Tooltip.css', 'utf8'),
  Chat:                 fs.readFileSync(__dirname + '../../../../dist/styles/Chat.css', 'utf8'),
  ChatMessages:         fs.readFileSync(__dirname + '../../../../dist/styles/ChatMessages.css', 'utf8'),
  ChatTextarea:         fs.readFileSync(__dirname + '../../../../dist/styles/ChatTextarea.css', 'utf8'),
  WelcomeScreen:        fs.readFileSync(__dirname + '../../../../dist/styles/WelcomeScreen.css', 'utf8'),
  FullScreenPreview:    fs.readFileSync(__dirname + '../../../../dist/styles/FullScreenPreview.css', 'utf8'),
  FormattedMarkdown:    fs.readFileSync(__dirname + '../../../../dist/styles/FormattedMarkdown.css', 'utf8'),
};
