#!/usr/bin/env bash

# Usage:
# npm run build

source bin/utils.sh

output_version=$(get_variable_from_dotenv_file "ELIXIRCHAT_VERSION" .env)

printf "\nBuilding JS (version $output_version) into 'build' directory\n\n";
sass widget/DefaultWidget/styles/:dist/styles/ --style=compressed --no-source-map

# When building SDK locally (npm run build), dist/sdk.min.js exports undefined so that sdk.min.js is not included into default-widget.min.js bundle
# See widget/ElixirChatWidget.ts
echo "export default undefined;" > dist/sdk.min.js

printf "\nBuilding SDK...\n\n";
vite build -c vite.sdk.config.ts

printf "\nBuilding widget...\n\n";
vite build -c vite.widget.config.ts

printf "\nAttention:\n  If \"npm run dev\" was running within elixirchat-js-sdk in another terminal window, restart it.\n\n\n"
