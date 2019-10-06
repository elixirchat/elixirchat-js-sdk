/**
 * This file is needed for non-TypeScript project to be able to use:
 * import ElixirChatWidget from 'elixirchat-js-sdk/widget';
 */


// import { ElixirChatWidget } from '../build/default-widget';
const ElixirChatWidget = require('../build/default-widget').default;


console.log('\n\n\n__ widget/index.js 1 (require)', { ElixirChatWidget }, '\n\n\n');

export default ElixirChatWidget;
