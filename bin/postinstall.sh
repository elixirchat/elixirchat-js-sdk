#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

echo """
const ElixirChat = require('../build/sdk').default;
console.log('__ AFTER INSTALLED 1', { ElixirChat });
export default ElixirChat;
""" > dist/sdk.js
