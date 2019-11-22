#!/usr/bin/env bash

# Usage:
# npm run release

read -r -p "Each release is created based off master. Have you merged your recent code into master? [y/N]" response
echo
if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
  tput setaf 1
  printf "Don't forget to merge your code into master first\n\n"
  tput sgr0
  exit 1
fi

if [ ! -e ".env-github" ]; then
  tput setaf 1
  # TODO: add env-github to SDK docs
  printf "\nError: .env-github not found.\nSee: http://github.com/elixirchat/elixirchat-admin#env-github\n\n"
  tput sgr0
  exit 1
fi

source .env-github

github_user=$USER
github_token=$TOKEN
github_repo_owner=$REPO_OWNER
github_repo_name=$REPO_NAME
current_version=$(node -p "require('./package.json').version")

release_already_exists=$(
  curl -u $github_user:$github_token \
    https://api.github.com/repos/$github_repo_owner/$github_repo_name/releases | grep '"tag_name": "v'"$current_version"'"'
)

printf "\nPreparing release...\n"

if [ -n "$release_already_exists" ];
  then
    tput setaf 1
    printf "\nRelease v$current_version already exists. See: https://github.com/$github_repo_owner/$github_repo_name/releases/tag/v$current_version \nRun 'npm version patch' and try again\n\n"
    tput sgr0
  else
    tput setaf 2
    printf "\nCreating new release v$current_version on Github.\n(See: https://github.com/$github_repo_owner/$github_repo_name/releases)\n\n"
    tput sgr0

    request_data='{
      "key": "value",
      "name": "v'"$current_version"'",
      "tag_name": "v'"$current_version"'",
      "target_commitish": "master",
      "body": "",
      "draft": false,
      "prerelease": false
    }'
    response=$(curl --request POST \
      -u $github_user:$github_token \
      --header "Content-Type: application/json" \
      --data "$request_data" \
      "https://api.github.com/repos/$github_repo_owner/$github_repo_name/releases")

    is_success=$(echo "$response" | grep '"tag_name": "v'"$current_version"'"')

    if [ -n "$is_success" ];
      then
        tput setaf 2
        printf "\nRelease v$current_version has been successfully created.\nSee: https://github.com/$github_repo_owner/$github_repo_name/releases/tag/v$current_version\n\n"
        tput sgr0

        read -r -p "Do you want to deploy this release to https://demos.elixir.chat? [y/N]" response
        echo
        if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
          exit 0
        fi
        npm run deploy --release=v"$current_version"

      else
        tput setaf 1
        printf "\nUnable to create a release v$current_version. Github responded with:\n$response\n"
        tput sgr0
    fi

fi
