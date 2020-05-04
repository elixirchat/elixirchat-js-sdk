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
  icons:              fs.readFileSync(__dirname + '../../../../dist/styles/icons.css', 'utf8'),
  Widget:             fs.readFileSync(__dirname + '../../../../dist/styles/Widget.css', 'utf8'),
  Chat:               fs.readFileSync(__dirname + '../../../../dist/styles/Chat.css', 'utf8'),
  ChatMessages:       fs.readFileSync(__dirname + '../../../../dist/styles/ChatMessages.css', 'utf8'),
  ChatTextarea:       fs.readFileSync(__dirname + '../../../../dist/styles/ChatTextarea.css', 'utf8'),
  FullScreenPreview:  fs.readFileSync(__dirname + '../../../../dist/styles/FullScreenPreview.css', 'utf8'),
};
