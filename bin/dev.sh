#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

echo """
const ElixirChat = require('../sdk').default;
console.log('__ DEVELOPING 1', { ElixirChat });
export default ElixirChat;
""" > dist/sdk.js

concurrently \
"node-sass --watch --recursive widget/DefaultWidget/styles/ --output dist/styles/" \
"parcel dev.html --port 8001"
