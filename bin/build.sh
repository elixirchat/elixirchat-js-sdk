#!/usr/bin/env bash

# Usage:
# npm run build

source bin/utils.sh

output_version=$(get_variable_from_dotenv_file "ELIXIRCHAT_VERSION" .env)

printf "\nBuilding JS (version $output_version) into 'build' directory\n\n";
node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/ --output-style compressed

# When building SDK locally (npm run build), dist/sdk.min.js is empty so that sdk.min.js is not included into default-widget.min.js bundle
# See widget/ElixirChatWidget.ts:20
echo "" > dist/sdk.min.js

printf "\nBuilding SDK...\n\n";
parcel build sdk/index.ts --out-dir build --out-file sdk.min.js --no-source-maps

printf "\nBuilding widget...\n\n";
parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps

print_error "\nAttention:\n  If \"npm run dev\" was running within elixirchat-js-sdk in another terminal window, restart it.\n\n\n"
