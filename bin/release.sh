#!/usr/bin/env bash

# Usage:
# npm run release

source bin/utils.sh

read -r -p "Each release is created based off master. Have you merged your recent code into master? [y/N]" response
echo
if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
  print_error "Don't forget to merge your code into master first\n\n"
  exit 1
fi


if is_github_data_unset; then
  exit 1
fi

source .env-bin

package_json_version=$(node -p "require('./package.json').version")

release_already_exists=$(
  curl -u "$GITHUB_USER":"$GITHUB_TOKEN" \
    "https://api.github.com/repos/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases" | grep '"tag_name": "v'"$package_json_version"'"'
)

if [ -n "$release_already_exists" ];
  then
    print_error "\nRelease v$package_json_version already exists. See: https://github.com/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases/tag/v$package_json_version \nRun 'npm version patch' and try again\n\n"
  else
    print_success "\nCreating new release v$package_json_version on Github.\n(See: https://github.com/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases)\n\n"

    request_data='{
      "key": "value",
      "name": "v'"$package_json_version"'",
      "tag_name": "v'"$package_json_version"'",
      "target_commitish": "master",
      "body": "",
      "draft": false,
      "prerelease": false
    }'
    response=$(curl --request POST \
      -u "$GITHUB_USER":"$GITHUB_TOKEN" \
      --header "Content-Type: application/json" \
      --data "$request_data" \
      "https://api.github.com/repos/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases")

    is_success=$(echo "$response" | grep '"tag_name": "v'"$package_json_version"'"')

    if [ -n "$is_success" ];
      then
        print_success "\nRelease v$package_json_version has been successfully created.\nSee: https://github.com/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases/tag/v$package_json_version\n\n"

        read -r -p "Do you want to deploy this release to https://demos.elixir.chat? [y/N]" response
        echo
        if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
          exit 0
        fi
        npm run deploy --release=v"$package_json_version"

      else
        print_error "\nUnable to create a release v$package_json_version. Github responded with:\n$response\n"
    fi
fi
