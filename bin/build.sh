#!/usr/bin/env bash

DEFAULT_BUILD_DIR="build"
BUILD_DIR=$(npm config get dir)

if [ -z "$BUILD_DIR" ] || [ "$BUILD_DIR" = "undefined" ]; then
  BUILD_DIR=$DEFAULT_BUILD_DIR
fi

printf "\nBuilding JS into '$BUILD_DIR' directory\n\n";

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
# See: widget/ElixirChatWidget.ts:19
echo "" > dist/sdk.js

parcel build sdk/index.ts --out-dir $BUILD_DIR --out-file sdk.js --no-source-maps --no-minify
parcel build sdk/index.ts --out-dir $BUILD_DIR --out-file sdk.min.js --no-source-maps

parcel build widget/index.ts --out-dir $BUILD_DIR --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir $BUILD_DIR --out-file default-widget.min.js --no-source-maps
