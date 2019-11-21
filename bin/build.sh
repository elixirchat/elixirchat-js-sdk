#!/usr/bin/env bash

CURRENT_VERSION=$(node -p "require('./package.json').version")
NEW_VERSION=$1

if [ -n "$NEW_VERSION" ];
  then
    OUTPUT_VERSION=$NEW_VERSION
  else
    OUTPUT_VERSION=$CURRENT_VERSION
fi


DEFAULT_BUILD_DIR="build"
BUILD_DIR=$(npm config get dir)

if [ -z "$BUILD_DIR" ] || [ "$BUILD_DIR" = "undefined" ]; then
  BUILD_DIR=$DEFAULT_BUILD_DIR
fi

function write_version_to_sdk() {
  js_code="
  ;(function(){ if (typeof ElixirChat !== 'undefined') { ElixirChat.prototype.version = '$1'; } }())"
  echo "$js_code" >> "$2"
}

printf "\nBuilding JS (version $OUTPUT_VERSION) into '$BUILD_DIR' directory\n\n";

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
# See: widget/ElixirChatWidget.ts:19
echo "" > dist/sdk.js

parcel build sdk/index.ts --out-dir $BUILD_DIR --out-file sdk.js --no-source-maps --no-minify
parcel build sdk/index.ts --out-dir $BUILD_DIR --out-file sdk.min.js --no-source-maps

write_version_to_sdk "$OUTPUT_VERSION" $BUILD_DIR/sdk.js
write_version_to_sdk "$OUTPUT_VERSION" $BUILD_DIR/sdk.min.js

parcel build widget/index.ts --out-dir $BUILD_DIR --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir $BUILD_DIR --out-file default-widget.min.js --no-source-maps
