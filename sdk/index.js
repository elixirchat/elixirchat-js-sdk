/**
 * This file is needed for non-TypeScript project to be able to use:
 * import ElixirChat from 'elixirchat-js-sdk';
 */

import { ElixirChat } from '../build/sdk';

console.log('\n\n\n__ ElixirChat index.js 2', { ElixirChat }, '\n\n\n');

export default ElixirChat;
