#!/usr/bin/env bash

# When 'elixirchat-js-sdk' in being installed via npm in another project (npm install elixirchat-js-sdk),
# dist/sdk.js exports build/sdk.js so that it'd be possible to use `import ElixirChatWidget from "elixirchat-js-sdk/widget"`
# See: widget/ElixirChatWidget.ts:20

source bin/utils.sh

function generate_default_env-bin() {
  if [ ! -e ".env-bin" ]; then
    touch .env-bin
  fi
  change_variable_in_dotenv_file "ABSOLUTE_BACKEND_PATH" "" .env-bin
  change_variable_in_dotenv_file "GITHUB_REPO_OWNER" "elixirchat" .env-bin
  change_variable_in_dotenv_file "GITHUB_REPO_NAME" "elixirchat-js-sdk" .env-bin
  change_variable_in_dotenv_file "GITHUB_USER" "" .env-bin
  change_variable_in_dotenv_file "GITHUB_TOKEN" "" .env-bin
}

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

if [[ $script_dir =~ node_modules/elixirchat-js-sdk ]];
  then
    print_success "\nelixirchat-js-sdk/bin/postinstall.sh script_dir: $script_dir\nConfirmed elixirchat-js-sdk is being installed in ANOTHER project.\n\n"
    echo "const ElixirChat = require('../build/sdk.min').default; export default ElixirChat;" > dist/sdk.min.js
    print_success "\nCreated dist/sdk.min.js\nRebuilding default-widget.min.js...\n\n"
    parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps
  else
    print_success "\nelixirchat-js-sdk/bin/postinstall.sh script_dir: $script_dir\nelixirchat-js-sdk is NOT being installed in ANOTHER project. Skipping rebuilding default-widget.min.js...\n\n"
    generate_default_env-bin
fi
