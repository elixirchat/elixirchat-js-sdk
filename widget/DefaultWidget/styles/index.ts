/**
 * Styles are imported as strings via fs.readFileSync in order to include
 * them into a single bundle JS file, not copy to /dist folder
 */
const fs = require('fs');

// Styles outside the Chat iframe
export const DefaultWidgetGlobalStyles = fs.readFileSync(__dirname + '/DefaultWidgetGlobalStyles.css', 'utf8');

// Styles inside the Chat iframe
export const DefaultWidgetStyles = fs.readFileSync(__dirname + '/iframe/DefaultWidgetStyles.css', 'utf8');
export const DefaultWidgetMessagesStyles = fs.readFileSync(__dirname + '/iframe/DefaultWidgetMessagesStyles.css', 'utf8');
export const DefaultWidgetTextareaStyles = fs.readFileSync(__dirname + '/iframe/DefaultWidgetTextareaStyles.css', 'utf8');

// Styles both inside and outside the Chat iframe
export const iconsStyles = fs.readFileSync(__dirname + '/icons.css', 'utf8');
