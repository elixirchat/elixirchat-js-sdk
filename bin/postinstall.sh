#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

echo """
const ElixirChat = require('../build/sdk').default;
console.log('__ AFTER INSTALLED 1', { ElixirChat });
export default ElixirChat;
""" > dist/sdk.js

printf "---0\n\n\n\n---"

ls -la node_modules

printf "---1\n\n\n\n---"

ls -la node_modules/node-sass

printf "---2\n\n\n\n---"

ls -la node_modules/parcel-bundler

printf "---3\n\n\n\n---"

parcel build widget/index.ts --out-dir build --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps
