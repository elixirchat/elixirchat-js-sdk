#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
# See: widget/ElixirChatWidget.ts:19
echo "" > dist/sdk.js

parcel build sdk/index.ts --out-dir build --out-file sdk.js --no-source-maps --no-minify
parcel build sdk/index.ts --out-dir build --out-file sdk.min.js --no-source-maps

parcel build widget/index.ts --out-dir build --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps
