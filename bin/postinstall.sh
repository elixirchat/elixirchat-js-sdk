#!/usr/bin/env bash

# When 'elixirchat-js-sdk' in being installed via npm in another project, dist/sdk.js exports build/sdk.js
# so that it'd be possible to use `import ElixirChatWidget from 'elixirchat-js-sdk/widget'`
# See: widget/ElixirChatWidget.ts:26

source bin/utils.sh

sdk_js_contents="""
const ElixirChat = require('../build/sdk').default;
export default ElixirChat;
"""

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

if [[ $script_dir =~ node_modules/elixirchat-js-sdk ]];
  then
    print_success "\nelixirchat-js-sdk/bin/postinstall.sh script_dir: $script_dir\nConfirmed elixirchat-js-sdk is being installed in ANOTHER project.\n\n"
    echo "$sdk_js_contents" > dist/sdk.js

    print_success "\nCreated dist/sdk.js: $sdk_js_contents\nRebuilding default-widget.js...\n\n"
    parcel build widget/index.ts --out-dir build --out-file default-widget.js --no-source-maps --no-minify
    parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps
  else
    print_success "\nelixirchat-js-sdk/bin/postinstall.sh script_dir: $script_dir\nelixirchat-js-sdk is NOT being installed in ANOTHER project. Skipping rebuilding default-widget.js...\n\n"
fi
