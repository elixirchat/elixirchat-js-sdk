#!/usr/bin/env bash

# Usage:
# npm run examples              # Browse examples working with dev-server (dev-admin.elixir.chat/api)
# npm run examples local        # Browse examples working with local server (localhost:4000)
# npm run examples open         # Open examples in the browser automatically
# npm run examples local open   # Open examples working with local server in the browser automatically

source bin/utils.sh

[[ $1 = "local" ]] || [[ $2 = "local" ]] && export is_local_server=1
[[ $1 = "open" ]] || [[ $2 = "open" ]] && export should_open_in_browser=1

function replace_api_urls_with_local_server () {
  API_URL="http:\/\/localhost:4000"
  SOCKET_URL="ws:\/\/localhost:4000\/socket"

  sed -i '' -E -e "s/apiUrl: '[^']+'/apiUrl: '$API_URL'/" "$1"
  sed -i '' -E -e "s/socketUrl: '[^']+'/socketUrl: '$SOCKET_URL'/" "$1"
}

function update_examples_files () {
  mkdir -p dist/build/examples

  cp -rf build/sdk.min.js                   dist/build/sdk.min.js
  cp -rf build/default-widget.min.js        dist/build/default-widget.min.js

  cp -rf build/examples/sdk.html            dist/build/examples/sdk.html
  cp -rf build/examples/widget.html         dist/build/examples/widget.html
  cp -rf build/examples/widget-private.html dist/build/examples/widget-private.html

  if [ "$is_local_server" == "true" ];
    then
      print_success "\nRunning SDK examples with LOCAL SERVER (localhost:4000)\n\n"
      replace_api_urls_with_local_server "dist/build/examples/sdk.html"
      replace_api_urls_with_local_server "dist/build/examples/widget.html"
      replace_api_urls_with_local_server "dist/build/examples/widget-private.html"
    else
      print_success "\nRunning SDK with DEV-SERVER (dev-admin.elixir.chat/api)\n\n"
  fi
}

export -f update_examples_files
export -f replace_api_urls_with_local_server

update_examples_files

if [ "$should_open_in_browser" == "true" ];
  then
    concurrently "watch update_examples_files build" \
    "http-server dist/build -p 8002" \
    "http-server dist/build -p 8003" \
    "open http://localhost:8002/examples/sdk.html" \
    "open http://localhost:8002/examples/widget.html" \
    "open http://localhost:8003/examples/widget-private.html"
  else
    concurrently "watch update_examples_files build" \
    "http-server dist/build -p 8002" \
    "http-server dist/build -p 8003"
fi
