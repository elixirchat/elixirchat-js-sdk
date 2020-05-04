#!/usr/bin/env bash

new_version=$1

if [ -n "$new_version" ];
  then
    output_version=$new_version
  else
    source .env
    output_version=$ELIXIRCHAT_VERSION
fi

build_dir=$(npm config get dir)

if [ -z "$build_dir" ] || [ "$build_dir" = "undefined" ]; then
  build_dir="build"
fi

printf "\nBuilding JS (version $output_version) into '$build_dir' directory\n\n";
node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/
echo "" > dist/sdk.js

printf "\nBuilding SDK...\n\n";
parcel build sdk/index.ts --out-dir $build_dir --out-file sdk.js --no-source-maps --no-minify
parcel build sdk/index.ts --out-dir $build_dir --out-file sdk.min.js --no-source-maps

printf "\nBuilding widget...\n\n";
parcel build widget/index.ts --out-dir $build_dir --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir $build_dir --out-file default-widget.min.js --no-source-maps
