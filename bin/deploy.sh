#!/usr/bin/env bash

# Usage:
# npm run deploy branch my-feature
# npm run deploy release v1.0.0

source bin/utils.sh

if is_backend_path_unset || is_github_data_unset; then
  exit 1
fi

source .env-bin

if [[ $1 = "branch" ]]; then
  github_branch=$2
fi

if [[ $1 = "release" ]]; then
  github_release_id=$2
fi


ansible_dir=$ABSOLUTE_BACKEND_PATH/deploy/ansible/inventory/development
ansible_config=$ABSOLUTE_BACKEND_PATH/deploy/ansible/playbooks/services-widget.yml


# DEPLOYING BRANCH
if [ -n "$github_branch" ]; then
  if has_uncommited_changes; then
    print_error "\nCan't deploy branch to http://demos.elixir.chat while there are uncommited changes.\nCommit and push your changes and then try again.\n\n\n"
    exit 1
  fi

  current_branch=$(git symbolic-ref --short HEAD)
  if [ "$github_branch" != "$current_branch" ]; then
    print_error "\nYou must checkout to \"$github_branch\" branch in order to deploy it.\n> git checkout $github_branch\n\n\n"
    exit 1
  fi

  printf "\nGithub branch: $github_branch\n\n"
  version=$(get_env_elixirchat_version)
  dev_branch=$(get_env_elixirchat_dev_branch)
  dev_version=$(get_env_elixirchat_dev_version)
  next_dev_version=1

  if [ "$dev_version" != "" ] && [ "$dev_branch" == "$github_branch" ]; then
    next_dev_version=$((dev_version+1))
  fi

  next_full_version="$version.$github_branch@$next_dev_version"

  change_variable_in_dotenv_file "ELIXIRCHAT_VERSION" "$next_full_version" .env
  git add .env
  git commit -am "Dev release $next_full_version"
  git push -f origin "$github_branch"

  print_success "\nCreated dev release $next_full_version in branch \"$github_branch\".\nDeploying to http://demos.elixir.chat...\n\n\n"
  ansible-playbook -vvvv -u root -i "$ansible_dir" "$ansible_config" --extra-vars "widget_branch=$github_branch"
  exit 0
fi


# DEPLOYING GITHUB RELEASE
if [ -n "$github_release_id" ]; then
  github_release_exists=$(
    curl -u "$GITHUB_USER":"$GITHUB_TOKEN" \
      "https://api.github.com/repos/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases" | grep '"tag_name": "'"$github_release_id"'"'
  )
  if [ -z "$github_release_exists" ]; then
    print_error "\nRelease $github_release_id does not exist.\n  Check available releases on Github: https://github.com/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases\n  or create a new release by running 'npm run release'\n\n"
    exit 1
  fi

  ansible-playbook -vvvv -u root -i "$ansible_dir" "$ansible_config" --extra-vars "widget_branch=$github_release_id"
  exit 0
fi


print_error "\nEither 'release' or 'branch' option is required, e.g.
> npm run deploy branch my-feature
> npm run deploy release v1.0.0

Also see the list of available releases at https://github.com/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/releases
or create a new release by running 'npm run release'\n\n\n"
exit 1
