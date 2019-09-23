/**
 * Styles are imported as strings via fs.readFileSync in order to include
 * them into a single bundle JS file, not copy to /dist folder
 */
const fs = require('fs');

//
// // Styles outside the Chat iframe
// export const DefaultWidgetGlobalStyles = fs.readFileSync(__dirname + '/DefaultWidgetGlobalStyles.css', 'utf8');
//
// // Styles inside the Chat iframe
// export const DefaultWidgetStyles = fs.readFileSync(__dirname + '/iframe/DefaultWidgetStyles.css', 'utf8');
// export const DefaultWidgetMessagesStyles = fs.readFileSync(__dirname + '/iframe/DefaultWidgetMessagesStyles.css', 'utf8');
// export const DefaultWidgetTextareaStyles = fs.readFileSync(__dirname + '/iframe/DefaultWidgetTextareaStyles.css', 'utf8');
//
// // Styles both inside and outside the Chat iframe
// export const iconsStyles = fs.readFileSync(__dirname + '/icons.css', 'utf8');

// const sass = require('sass');
// import sass from 'sass';


// const { exec } = require('child_process');
//
// exec('ls -la', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     console.error('___ node couldn\'t execute the command', err);
//     return;
//   }
//
//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });

// const Bundler = require('parcel-bundler');

// const bundler = new Bundler();
// bundler.on('bundled', (bundle) => {
//   // bundler contains all assets and bundles, see documentation for details
//
//   console.log('___ bundle', bundle);
// });
// // Call this to start bundling
// bundler.bundle();


// const testScss = fs.readFileSync(__dirname + '/test.css', 'utf8');
// const testScss = fs.readFileSync(__dirname + '../../../../zzz2/test1.css', 'utf8');

// let result = 'none1';
// let result = fs.readFileSync('/zzz2/test1.css', 'utf8');

// result = sass.renderSync({
//   data: testScss
// });

// console.log('___ result 2', {result, testScss, __dirname});
// window.__sass = sass;


export default {
  icons:        fs.readFileSync(__dirname + '/icons.css', 'utf8'),
  Button:       fs.readFileSync(__dirname + '/Button.css', 'utf8'),
  Chat:         fs.readFileSync(__dirname + '/Chat.css', 'utf8'),
  ChatMessages: fs.readFileSync(__dirname + '/ChatMessages.css', 'utf8'),
  ChatTextarea: fs.readFileSync(__dirname + '/ChatTextarea.css', 'utf8'),
  ImagePreview: fs.readFileSync(__dirname + '/ImagePreview.css', 'utf8'),
};
