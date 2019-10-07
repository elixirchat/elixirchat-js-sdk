#!/usr/bin/env bash

# Checks if elixirchat-js-sdk is being installed in ANOTHER project
# (meaning NOT simply running "npm install" within elixirchat-js-sdk folder)
#
# If elixirchat-js-sdk is being installed in ANOTHER project,
# parcel-bunder and node-sass must be installed prior to launing bin/postinstall.sh
# to avoid the bug when parcel-bunder or node-sass are not being found in bin/postinstall.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

get_package_version () {
  cat package.json | python3 -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['$1'])"
}

if [[ $SCRIPT_DIR == node_modules/elixirchat-js-sdk ]];
  then
    PARCEL_VERSION=$(get_package_version "parcel-bundler")
    NODE_SAAS_VERSION=$(get_package_version "node-sass")

    tput setaf 2
    echo "elixirchat-js-sdk/bin/preinstall.sh SCRIPT_DIR: $SCRIPT_DIR"
    echo "Confirmed elixirchat-js-sdk is being installed in ANOTHER project."
    echo "Installing node-sass@$PARCEL_VERSION and parcel-bundler@$PARCEL_VERSION..."
    printf "\n"
    tput sgr0

    npm i "parcel-bundler@$PARCEL_VERSION"
    npm i "node-sass@$NODE_SAAS_VERSION"
  else
    tput setaf 1
    echo "elixirchat-js-sdk/bin/preinstall.sh SCRIPT_DIR:$SCRIPT_DIR"
    echo "elixirchat-js-sdk is NOT being installed in ANOTHER project. Skipping bin/preinstall.sh..."
    printf "\n"
    tput sgr0
fi
