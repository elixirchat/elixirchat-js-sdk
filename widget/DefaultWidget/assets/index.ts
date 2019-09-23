/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single bundle JS file, not copy to /dist folder as separate files
 */

const fs = require('fs');
const woffDataUrlPrefix = 'data:font/woff;base64,';
const mp3DataUrlPrefix = 'data:audio/mpeg;base64,';

export default {
  fontGraphikBoldWeb:     woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' }),
  fontGraphikRegularWeb:  woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' }),
  fontElixirchatIcons:    woffDataUrlPrefix + fs.readFileSync(__dirname + '/fonts/elixirchat-icons.woff', { encoding: 'base64' }),
  notificationSound:      mp3DataUrlPrefix + fs.readFileSync(__dirname + '/audio/notification.mp3', { encoding: 'base64' }),
};
