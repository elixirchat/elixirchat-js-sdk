#!/usr/bin/env bash


NEW_VERSION=$1

echo "5555"
echo $NEW_VERSION
echo "6666"

if [ -n "$NEW_VERSION" ]; then
  echo "HAS VERSION $NEW_VERSION"
fi



#DEFAULT_BUILD_DIR="build"
#BUILD_DIR=$(npm config get dir)
#
#if [ -z "$BUILD_DIR" ] || [ "$BUILD_DIR" = "undefined" ]; then
#  BUILD_DIR=$DEFAULT_BUILD_DIR
#fi
#
#function write_version_to_sdk() {
#  js_code=";(function(){ if (typeof ElixirChat !== 'undefined') { ElixirChat.prototype.version = '1.1.1'; } }())"
#  echo "$js_code" >> "$1"
#}
#
#
#
#
#printf "\nBuilding JS into '$BUILD_DIR' directory\n\n";
#
#node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/
#
## When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
## See: widget/ElixirChatWidget.ts:19
#echo "" > dist/sdk.js
#
#parcel build sdk/index.ts --out-dir $BUILD_DIR --out-file sdk.js --no-source-maps --no-minify
#parcel build sdk/index.ts --out-dir $BUILD_DIR --out-file sdk.min.js --no-source-maps
#write_version_to_sdk $BUILD_DIR/sdk.js
#write_version_to_sdk $BUILD_DIR/sdk.min.js
#
#parcel build widget/index.ts --out-dir $BUILD_DIR --out-file default-widget.js --no-source-maps --no-minify
#parcel build widget/index.ts --out-dir $BUILD_DIR --out-file default-widget.min.js --no-source-maps
