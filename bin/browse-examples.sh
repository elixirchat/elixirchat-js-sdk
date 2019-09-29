#!/usr/bin/env bash

# Usage:
# npm run examples                        # Browse examples working with dev-server (dev-admin.elixir.chat/api)
# npm run examples --local-server=true    # Browse examples working with local server (localhost:4000)

export API_URL="http:\/\/localhost:4000"
export SOCKET_URL="ws:\/\/localhost:4000\/socket"
export BACKEND_STATIC_URL="http:\/\/localhost:4000"

export IS_LOCAL_SERVER=$(npm config get local-server)

replace_env_variables () {
  sed -i '' -E -e "s/apiUrl: '[^']+'/apiUrl: '$API_URL'/" $1
  sed -i '' -E -e "s/socketUrl: '[^']+'/socketUrl: '$SOCKET_URL'/" $1
  sed -i '' -E -e "s/backendStaticUrl: '[^']+'/backendStaticUrl: '$BACKEND_STATIC_URL'/" $1
}

update_examples_files () {
  mkdir -p dist/build/examples

  cp -rf build/sdk.min.js dist/build/sdk.min.js
  cp -rf build/default-widget.min.js dist/build/default-widget.min.js

  cp -rf build/examples/sdk.html dist/build/examples/sdk.html
  cp -rf build/examples/widget.html dist/build/examples/widget.html

  if [ "$IS_LOCAL_SERVER" != "undefined" ];
    then
      tput setaf 2
      printf "\nRunning SDK examples with LOCAL SERVER (localhost:4000)\n\n"
      tput sgr0

      replace_env_variables "dist/build/examples/sdk.html"
      replace_env_variables "dist/build/examples/widget.html"
    else
      tput setaf 2
      printf "\nRunning SDK with DEV-SERVER (dev-admin.elixir.chat/api)\n\n"
      tput sgr0
  fi
}

export -f update_examples_files
export -f replace_env_variables

update_examples_files

concurrently "watch update_examples_files build" \
"http-server dist/build -p 8002" \
"open http://localhost:8002/examples/sdk.html" \
"open http://localhost:8002/examples/widget.html"
