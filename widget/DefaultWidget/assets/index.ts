/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single-bundle JS file, not simply copy to /dist folder as separate files
 *
 * Note that Parcel bundler utilizes a very limited custom implementation of fs.readFileSync()
 * @see https://en.parceljs.org/javascript.html#javascript
 */

const fs = require('fs');
const woffDataPrefix = 'data:font/woff;base64,';
const svgDataPrefix = 'data:image/svg+xml;base64,';
const mp3DataPrefix = 'data:audio/mpeg;base64,';

export default {
  fontGraphikBold:          woffDataPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' }),
  fontGraphikMedium:        woffDataPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Medium-Web.woff', { encoding: 'base64' }),
  fontGraphikRegular:       woffDataPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' }),
  fontGraphikRegularItalic: woffDataPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-RegularItalic-Web.woff', { encoding: 'base64' }),
  fontElixirchatIcons:      woffDataPrefix + fs.readFileSync(__dirname + '/fonts/elixirchat-icons.woff', { encoding: 'base64' }),
  iconWhatsapp:             svgDataPrefix + fs.readFileSync(__dirname + '/images/channel-whatsapp.svg', { encoding: 'base64' }),
  iconTelegram:             svgDataPrefix + fs.readFileSync(__dirname + '/images/channel-telegram.svg', { encoding: 'base64' }),
  iconFacebook:             svgDataPrefix + fs.readFileSync(__dirname + '/images/channel-facebook.svg', { encoding: 'base64' }),
  iconSkype:                svgDataPrefix + fs.readFileSync(__dirname + '/images/channel-skype.svg', { encoding: 'base64' }),
  iconViber:                svgDataPrefix + fs.readFileSync(__dirname + '/images/channel-viber.svg', { encoding: 'base64' }),
  iconVK:                   svgDataPrefix + fs.readFileSync(__dirname + '/images/channel-vk.svg', { encoding: 'base64' }),
  notificationSound:        mp3DataPrefix + fs.readFileSync(__dirname + '/audio/notification.mp3', { encoding: 'base64' }),
};
