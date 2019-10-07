#!/usr/bin/env bash

# When 'elixirchat-js-sdk' in being installed via npm in another project, dist/sdk.js refers to
# build/sdk.js so that it'd be possible to use `import ElixirChatWidget from 'elixirchat-js-sdk/widget'`
# See: widget/ElixirChatWidget.ts:8

SDK_JS_CONTENTS="""
const ElixirChat = require('../build/sdk').default;
export default ElixirChat;
"""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

if [[ $SCRIPT_DIR =~ node_modules/elixirchat-js-sdk ]];
  then
    tput setaf 2
    echo "elixirchat-js-sdk/bin/postinstall.sh SCRIPT_DIR: $SCRIPT_DIR"
    echo "Confirmed elixirchat-js-sdk is being installed in ANOTHER project."
    echo "$SDK_JS_CONTENTS" > dist/sdk.js

    echo "Created dist/sdk.js: $SDK_JS_CONTENTS"
    printf "\n"
    echo "Rebuilding default-widget.js..."
    tput sgr0

    parcel build widget/index.ts --out-dir build --out-file default-widget.js --no-source-maps --no-minify
    parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps
  else
    tput setaf 1
    printf "\n"
    echo "elixirchat-js-sdk/bin/postinstall.sh SCRIPT_DIR: $SCRIPT_DIR"
    echo "elixirchat-js-sdk is NOT being installed in ANOTHER project. Skipping rebuilding default-widget.js..."
    printf "\n"
    tput sgr0
fi
