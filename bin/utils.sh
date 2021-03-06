function print_success() {
  tput setaf 2
  printf "$1"
  tput sgr0
}

function print_error() {
  tput setaf 1
  printf "$1"
  tput sgr0
}

function is_backend_path_unset() {
  source .env-bin
  if [ -z "$ABSOLUTE_BACKEND_PATH" ]; then
    print_error "
      Error: elixirchat-js-sdk is not linked with backend: ABSOLUTE_BACKEND_PATH is not set in .env-bin file.

      You must link elixirchat-js-sdk with your local cloned copy of the elixirchat/elixirchat repo by running this command:
      npm run link-with-backend <local path to elixirchat backend repo>

      Example:
      npm run link-with-backend ../other-repos/elixirchat\n\n"
    true
  else
    false
  fi
}

function is_github_data_unset() {
  source .env-bin
  if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
    print_error "
      Error: Github data incomplete or missing from .env-bin

      In order to be able to create releases on Github, you must add following variables into .env-bin file:
      GITHUB_USER=<your-github-username>
      GITHUB_TOKEN=<your-github-token>

      Where to get GITHUB_TOKEN:
      1. Generate a new token on https://github.com/settings/tokens
      2. Under \"Select scopes\", check everything under \"repo\" (repo:status, repo_deployment, public_repo, repo:invite)\n\n"
    true
  else
    false
  fi
}

function has_uncommited_changes() {
  if ! git diff-index --quiet HEAD --; then
    true
  else
    false
  fi
}

function get_variable_from_dotenv_file() {
  var_name=$1
  file_name=$2
  IFS='=' read -r variable value <<< "$(grep "^$var_name=" "$file_name" | head -1 )"
  echo "$value"
}

function change_variable_in_dotenv_file() {
  var_name=$1
  new_value=$2
  file_name=$3
  has_variable_in_env=$(cat "$file_name" | grep "$var_name")

  if [ -n "$has_variable_in_env" ]; then
    sed -i '' "/$var_name/d" "$file_name"
  fi
  echo "$var_name=$new_value" >> "$file_name"
}

function parse_env() {
  IFS='.' read -r v1 v2 v3 dev_postfix <<< "$(get_variable_from_dotenv_file "ELIXIRCHAT_VERSION" .env)"
  IFS='@' read -r dev_branch dev_version <<< "$dev_postfix"
  version="$v1.$v2.$v3"
  echo "$version|$dev_branch|$dev_version" # Example: 1.0.0|dev|3 for ELIXIRCHAT_VERSION=1.0.0.dev@3
}

function get_env_elixirchat_version() {
  IFS='|' read -r version dev_branch dev_version <<< "$(parse_env)"
  echo "$version"
}

function get_env_elixirchat_dev_branch() {
  IFS='|' read -r version dev_branch dev_version <<< "$(parse_env)"
  echo "$dev_branch"
}

function get_env_elixirchat_dev_version() {
  IFS='|' read -r version dev_branch dev_version <<< "$(parse_env)"
  echo "$dev_version"
}
