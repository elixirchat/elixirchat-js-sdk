/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single bundle JS file, not simply copy to /dist folder as separate files
 *
 * Note that Parcel bundler utilizes a very limited custom implementation of fs.readFileSync()
 * @see https://en.parceljs.org/javascript.html#javascript
 */

const fs = require('fs');
const woffDataUrlPrefix = 'data:font/woff;base64,';
const mp3DataUrlPrefix = 'data:audio/mpeg;base64,';

export default {
  fontGraphikBold:          woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' }),
  fontGraphikMedium:        woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Medium-Web.woff', { encoding: 'base64' }),
  fontGraphikRegular:       woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' }),
  fontGraphikRegularItalic: woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-RegularItalic-Web.woff', { encoding: 'base64' }),
  fontElixirchatIcons:      woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/elixirchat-icons.woff', { encoding: 'base64' }),
  notificationSound:        mp3DataUrlPrefix + fs.readFileSync(__dirname + '/audio/notification.mp3', { encoding: 'base64' }),
};
