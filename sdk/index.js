/**
 * This file is needed for non-TypeScript projects to be able to use:
 * import ElixirChat from 'elixirchat-js-sdk';
 */

const ElixirChat = require('../build/sdk').default;
export default ElixirChat;
