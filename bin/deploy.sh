#!/usr/bin/env bash

# Usage:
# npm run deploy --branch=my-feature
# npm run deploy --release=v1.0.0

if [ ! -e ".env-backend" ]; then
  tput setaf 1
  # TODO: add env-github to SDK docs
  printf "\nError: .env-backend not found.\nSee: http://github.com/elixirchat/elixirchat-admin#env-backend\n\n"
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

github_release_id=$(npm config get release)
github_branch=$(npm config get branch)

full_backend_path=$(cat .env-backend)
ansible_dir=$full_backend_path/deploy/ansible/inventory/development
ansible_config=$full_backend_path/deploy/ansible/playbooks/services-widget.yml


if [ -n "$github_release_id" ] || [ "$github_release_id" != "undefined" ] || [ -n "$github_branch" ] || [ "$github_branch" != "undefined" ]
  then
    printf "
Github release: $github_release_id
Github branch: $github_branch

  "
  else
    tput setaf 1
    printf "
Either 'release' or 'branch' option is required, e.g.
> npm run deploy --branch=my-feature
> npm run deploy --release=v1.0.0

Also see the list of available releases at https://github.com/$github_repo_owner/$github_repo_name/releases
or create a new release by running 'npm run release'

  "
    tput sgr0
    exit 1
fi


if [ -n "$github_branch" ] && [ "$github_branch" != "undefined" ]; then
  ansible-playbook -vvvv -u root -i "$ansible_dir" "$ansible_config" --extra-vars "widget_branch=$github_branch"
  exit 0
fi


github_release_exists=$(
  curl -u $github_user:$github_token \
    https://api.github.com/repos/$github_repo_owner/$github_repo_name/releases | grep '"tag_name": "'"$github_release_id"'"'
)

if [ -z "$github_release_exists" ]; then
  tput setaf 1
  printf "\nRelease $github_release_id does not exist.\n  Check available releases on Github: https://github.com/$github_repo_owner/$github_repo_name/releases\n  or create a new release by running 'npm run release'\n\n"
  tput sgr0
  exit 1
fi


ansible-playbook -vvvv -u root -i "$ansible_dir" "$ansible_config" --extra-vars "widget_branch=$github_release_id"
