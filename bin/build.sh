#!/usr/bin/env bash

parcel build sdk/index.ts --out-dir .cache-sdk --no-source-maps
mv .cache-sdk/*.js .cache-sdk/sdk.min.js

parcel build widget/index.ts --out-dir .cache-widget --no-source-maps
mv .cache-widget/*.js .cache-widget/default-widget.min.js

if [ ! -d "build" ]; then
  mkdir build
fi

mv .cache-sdk/sdk.min.js build/sdk.min.js
mv .cache-widget/default-widget.min.js build/default-widget.min.js
rm -rf .cache-sdk
rm -rf .cache-widget
