#!/usr/bin/env bash

# Usage:
# npm run build

source bin/utils.sh

output_version=$(get_variable_from_dotenv_file "ELIXIRCHAT_VERSION" .env)

printf "\nBuilding JS (version $output_version) into 'build' directory\n\n";
node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When building SDK locally, dist/sdk.js is empty so that sdk.js is not included into default-widget.js bundle
# See widget/ElixirChatWidget.ts:25
echo "" > dist/sdk.js

printf "\nBuilding SDK...\n\n";
parcel build sdk/index.ts --out-dir build --out-file sdk.min.js --no-source-maps
#parcel build sdk/index.ts --out-dir build --out-file sdk.js --no-source-maps --no-minify
#node-minify --compressor terser --input build/sdk.min.js --output build/sdk.min.js

printf "\nBuilding widget...\n\n";
parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps
#parcel build widget/index.ts --out-dir build --out-file default-widget.js --no-source-maps --no-minify
#node-minify --compressor terser --input build/default-widget.js --output build/default-widget.min.js
#node-minify --compressor terser --input build/default-widget.min.js --output build/default-widget.min.js

print_error "\nAttention:\n  If \"npm run dev\" was running within elixirchat-js-sdk in another terminal window, restart it.\n\n\n"
