/**
 * This file is needed for non-TypeScript project to be able to use:
 * import ElixirChatWidget from 'elixirchat-js-sdk/widget';
 */


import { ElixirChatWidget } from '../build/default-widget';

console.log('\n\n\n__ ElixirChatWidget index.js 1', { ElixirChatWidget }, '\n\n\n');

export default ElixirChatWidget;
