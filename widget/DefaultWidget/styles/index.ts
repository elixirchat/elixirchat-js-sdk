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
  icons:        fs.readFileSync('dist/styles/icons.css', 'utf8'),
  Widget:       fs.readFileSync('dist/styles/Widget.css', 'utf8'),
  Chat:         fs.readFileSync('dist/styles/Chat.css', 'utf8'),
  ChatMessages: fs.readFileSync('dist/styles/ChatMessages.css', 'utf8'),
  ChatTextarea: fs.readFileSync('dist/styles/ChatTextarea.css', 'utf8'),
  ImagePreview: fs.readFileSync('dist/styles/ImagePreview.css', 'utf8'),
};
