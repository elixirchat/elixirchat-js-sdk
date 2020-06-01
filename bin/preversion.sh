#!/usr/bin/env bash

source bin/utils.sh

package_json_version=$(node -p "require('./package.json').version")
package_json_version_arr=($(echo "$package_json_version" | sed 's/\./ /g'))
node_argv=$(node -e "console.log(JSON.parse(process.env.npm_config_argv).original)")

is_major=$(echo "$node_argv" | grep major)
is_minor=$(echo "$node_argv" | grep minor)
is_patch=$(echo "$node_argv" | grep patch)

if [ -n "$is_major" ]; then
  (( package_json_version_arr[0]++ ))
  package_json_version_arr[1]=0
  package_json_version_arr[2]=0
fi
if [ -n "$is_minor" ]; then
  (( package_json_version_arr[1]++ ))
  package_json_version_arr[2]=0
fi
if [ -n "$is_patch" ]; then
  (( package_json_version_arr[2]++ ))
fi

next_package_json_version="${package_json_version_arr[0]}.${package_json_version_arr[1]}.${package_json_version_arr[2]}"

change_variable_in_dotenv_file "ELIXIRCHAT_VERSION" "$next_package_json_version" .env
git add .env

npm run build
git add build/default-widget.js
git add build/default-widget.min.js
git add build/sdk.js
git add build/sdk.min.js
