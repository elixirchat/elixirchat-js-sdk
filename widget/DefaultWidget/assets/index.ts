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
const svgDataUrlPrefix = 'data:image/svg+xml;base64,';

export default {
  fontGraphikBold:          woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' }),
  fontGraphikMedium:        woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Medium-Web.woff', { encoding: 'base64' }),
  fontGraphikRegular:       woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' }),
  fontGraphikRegularItalic: woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-RegularItalic-Web.woff', { encoding: 'base64' }),
  fontElixirchatIcons:      woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/elixirchat-icons.woff', { encoding: 'base64' }),
  notificationSound:        mp3DataUrlPrefix + fs.readFileSync(__dirname + '/audio/notification.mp3', { encoding: 'base64' }),
  iconWhatsapp:             svgDataUrlPrefix + fs.readFileSync(__dirname + '/images/channel-whatsapp.svg', { encoding: 'base64' }),
  iconTelegram:             svgDataUrlPrefix + fs.readFileSync(__dirname + '/images/channel-telegram.svg', { encoding: 'base64' }),
  iconFacebook:             svgDataUrlPrefix + fs.readFileSync(__dirname + '/images/channel-facebook.svg', { encoding: 'base64' }),
  iconSkype:                svgDataUrlPrefix + fs.readFileSync(__dirname + '/images/channel-skype.svg', { encoding: 'base64' }),
  iconViber:                svgDataUrlPrefix + fs.readFileSync(__dirname + '/images/channel-viber.svg', { encoding: 'base64' }),
  iconVK:                   svgDataUrlPrefix + fs.readFileSync(__dirname + '/images/channel-vk.svg', { encoding: 'base64' }),
};
