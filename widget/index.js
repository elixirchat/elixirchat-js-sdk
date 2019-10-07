/**
 * This file is needed for non-TypeScript projects to be able to use:
 * import ElixirChatWidget from 'elixirchat-js-sdk/widget';
 */

const ElixirChatWidget = require('../build/default-widget').default;
export default ElixirChatWidget;
