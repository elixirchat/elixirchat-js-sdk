#!/usr/bin/env bash

# Usage:
# npm run link-with-backend --backend-dir=<path to elixirchat backend repo>
#
# Example:
# npm run link-with-backend --backend-dir=../elixirchat

trimmed_backend_path=$(npm config get backend-dir | sed 's:/*$::')
absolute_backend_path=$(echo $(cd "$trimmed_backend_path" && pwd))

schema_file_name=$(cat .graphqlconfig | python -c "import sys, json; print(json.load(sys.stdin)['schemaPath'])")
schema_path=$absolute_backend_path/$schema_file_name

if [ ! -e "$schema_path" ]; then
  tput setaf 1
  printf "\nError: Backend directory not found. You must pass the correct path to elixirchat backend directory i.e.:\n  npm run link-with-backend --backend-dir=../elixirchat\n\n"
  tput sgr0
  exit 1
fi


echo "ABSOLUTE_BACKEND_PATH=$absolute_backend_path" > .env-backend
ln "$schema_path" "$schema_file_name"

tput setaf 2
printf "\nSuccessfully linked with backend directory"
printf "\nSuccessfully pulled GraphQL schema. You may now use Jetbrains GraphQL plugin to work with GraphQL queries.\n\n"
tput sgr0
