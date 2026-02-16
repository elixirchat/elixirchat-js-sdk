#!/usr/bin/env bash

# Checks if elixirchat-js-sdk is being installed as a dependency in ANOTHER project
# (meaning running "npm install elixirchat-js-sdk" in another project, NOT simply
# running "npm install" within elixirchat-js-sdk folder)
#
# If elixirchat-js-sdk is being installed as a dependency in ANOTHER project,
# parcel-bundler and sass must be installed prior to launching bin/postinstall.sh
# to avoid the bug when parcel-bundler or sass are not being found in bin/postinstall.sh

source bin/utils.sh

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

get_dev_package_version () {
  cat package.json | python3 -c "import sys, json; print(json.load(sys.stdin)['devDependencies']['$1'])"
}

if [[ $script_dir =~ node_modules/elixirchat-js-sdk ]];
  then
    parcel_version=$(get_dev_package_version "parcel-bundler")
    sass_version=$(get_dev_package_version "sass")

    print_success "elixirchat-js-sdk/bin/preinstall.sh script_dir: $script_dir\nConfirmed elixirchat-js-sdk is being installed in ANOTHER project.\nInstalling parcel-bundler@$parcel_version and sass@$sass_version...\n\n"
    npm i "parcel-bundler@$parcel_version"
    npm i "sass@$sass_version"
  else
    print_success "elixirchat-js-sdk/bin/preinstall.sh script_dir:$script_dir\nelixirchat-js-sdk is NOT being installed in ANOTHER project. Skipping bin/preinstall.sh...\n\n"
fi
