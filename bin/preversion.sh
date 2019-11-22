#!/usr/bin/env bash

current_version=$(node -p "require('./package.json').version")
current_version_arr=($(echo "$current_version" | sed 's/\./ /g'))

node_argv=$(node -e "console.log(JSON.parse(process.env.npm_config_argv).original)")
is_major=$(echo "$node_argv" | grep major)
is_minor=$(echo "$node_argv" | grep minor)
is_patch=$(echo "$node_argv" | grep patch)

if [ -n "$is_major" ]; then
  (( current_version_arr[0]++ ))
fi
if [ -n "$is_minor" ]; then
  (( current_version_arr[1]++ ))
fi
if [ -n "$is_patch" ]; then
  (( current_version_arr[2]++ ))
fi

new_version="${current_version_arr[0]}.${current_version_arr[1]}.${current_version_arr[2]}"

echo "Building new version v$new_version"

./bin/build.sh $new_version

exit 1

git add build/default-widget.js
git add build/default-widget.min.js
git add build/sdk.js
git add build/sdk.min.js
