/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single bundle JS file, not copy to /dist folder as separate files
 */

const fs = require('fs');
const dataUrlPrefix = 'data:font/woff;base64,';

export const fontsBase64 = {
  GraphikBoldWeb:     dataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Bold-Web.woff', { encoding: 'base64' }),
  GraphikRegularWeb:  dataUrlPrefix + fs.readFileSync(__dirname + '/fonts/Graphik-Regular-Web.woff', { encoding: 'base64' }),
  elixirchatIcons:    dataUrlPrefix + fs.readFileSync(__dirname + '/fonts/elixirchat-icons.woff', { encoding: 'base64' }),
};
