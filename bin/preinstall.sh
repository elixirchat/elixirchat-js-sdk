#!/usr/bin/env bash

# Checks if elixirchat-js-sdk is being installed as a dependency in ANOTHER project
# (meaning NOT simply running "npm install" within elixirchat-js-sdk folder)
#
# If elixirchat-js-sdk is being installed as a dependency in ANOTHER project,
# parcel-bunder and node-sass must be installed prior to launching bin/postinstall.sh
# to avoid the bug when parcel-bunder or node-sass are not being found in bin/postinstall.sh

source bin/utils.sh

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

get_package_version () {
  cat package.json | python3 -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['$1'])"
}

if [[ $script_dir =~ node_modules/elixirchat-js-sdk ]];
  then
    parcel_version=$(get_package_version "parcel-bundler")
    node_saas_version=$(get_package_version "node-sass")

    print_success "elixirchat-js-sdk/bin/preinstall.sh script_dir: $script_dir\nConfirmed elixirchat-js-sdk is being installed in ANOTHER project.\nInstalling node-sass@$parcel_version and parcel-bundler@$parcel_version...\n\n"
    npm i "parcel-bundler@$parcel_version"
    npm i "node-sass@$node_saas_version"
  else
    print_success "elixirchat-js-sdk/bin/preinstall.sh script_dir:$script_dir\nelixirchat-js-sdk is NOT being installed in ANOTHER project. Skipping bin/preinstall.sh...\n\n"
fi
