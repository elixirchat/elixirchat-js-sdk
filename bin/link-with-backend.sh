#!/usr/bin/env bash

# Usage:
# npm run link-with-backend --backend-dir=<path to elixirchat backend repo>
#
# Example:
# npm run link-with-backend --backend-dir=../elixirchat

TRIMMED_BACKEND_PATH=$(npm config get backend-dir | sed 's:/*$::')
FULL_BACKEND_PATH=$(echo $(cd "$TRIMMED_BACKEND_PATH" && pwd))

SCHEMA_FILE_NAME=$(cat .graphqlconfig | python -c "import sys, json; print(json.load(sys.stdin)['schemaPath'])")
SCHEMA_PATH=$FULL_BACKEND_PATH/$SCHEMA_FILE_NAME

if [ ! -e "$SCHEMA_PATH" ]; then
  tput setaf 1
  printf "\nError: Backend directory not found. You must pass the correct path to elixirchat backend directory i.e.:\n  npm run link-with-backend --backend-dir=../elixirchat\n\n"
  tput sgr0
  exit 1
fi



echo "$FULL_BACKEND_PATH" > .env-backend
ln "$SCHEMA_PATH" "$SCHEMA_FILE_NAME"

tput setaf 2
printf "\nSuccessfully linked with backend directory"
printf "\nSuccessfully pulled GraphQL schema. You may now use Jetbrains GraphQL plugin to work with GraphQL queries.\n\n"
tput sgr0
