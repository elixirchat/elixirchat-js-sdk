#!/usr/bin/env bash

# Usage:
# npm run link-with-backend --backend-dir=<path to elixirchat backend repo>
#
# Example:
# npm run link-with-backend --backend-dir=../elixirchat

source bin/utils.sh

trimmed_backend_path=$(npm config get backend-dir | sed 's:/*$::')
absolute_backend_path=$(echo $(cd "$trimmed_backend_path" && pwd))

schema_file_name=$(cat .graphqlconfig | python -c "import sys, json; print(json.load(sys.stdin)['schemaPath'])")
schema_path=$absolute_backend_path/$schema_file_name

if [ ! -e "$schema_path" ]; then
  print_error "\nError: Backend directory not found. You must pass the correct path to elixirchat backend directory i.e.:\n  npm run link-with-backend --backend-dir=../elixirchat\n\n"
  exit 1
fi

change_variable_in_config "ABSOLUTE_BACKEND_PATH" "$absolute_backend_path", .env
ln "$schema_path" "$schema_file_name"

print_success "\nSuccessfully linked with backend directory"
print_success "\nSuccessfully pulled GraphQL schema. You may now use Jetbrains GraphQL plugin to work with GraphQL queries.\n\n"
