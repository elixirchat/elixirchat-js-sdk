#!/usr/bin/env bash

current_version=$(node -p "require('./package.json').version")
new_version=$1

if [ -n "$new_version" ];
  then
    output_version=$new_version
  else
    output_version=$current_version
fi

default_build_dir="build"
build_dir=$(npm config get dir)

if [ -z "$build_dir" ] || [ "$build_dir" = "undefined" ]; then
  build_dir=$default_build_dir
fi

function write_version_to_sdk() {
  js_code="
  ;(function(){ if (typeof ElixirChat !== 'undefined') { ElixirChat.prototype.version = '$1'; } }())"
  echo "$js_code" >> "$2"
}

printf "\nBuilding JS (version $output_version) into '$build_dir' directory\n\n";

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
# See widget/ElixirChatWidget.ts:19
echo "" > dist/sdk.js

printf "\nBuilding SDK...\n\n";

parcel build sdk/index.ts --out-dir $build_dir --out-file sdk.js --no-source-maps --no-minify
parcel build sdk/index.ts --out-dir $build_dir --out-file sdk.min.js --no-source-maps

printf "\nWriting version ($output_version) into SDK...\n\n";

write_version_to_sdk "$output_version" $build_dir/sdk.js
write_version_to_sdk "$output_version" $build_dir/sdk.min.js

printf "\nBuilding widget...\n\n";

parcel build widget/index.ts --out-dir $build_dir --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir $build_dir --out-file default-widget.min.js --no-source-maps
