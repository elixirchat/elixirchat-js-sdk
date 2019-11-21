#!/usr/bin/env bash

function get_new_version() {
  NODE_ARGV=$(node -e "console.log(JSON.parse(process.env.npm_config_argv).original)")

  IS_MAJOR=$(echo "$NODE_ARGV" | grep major)
  IS_MINOR=$(echo "$NODE_ARGV" | grep minor)
  IS_PATCH=$(echo "$NODE_ARGV" | grep patch)

  CURRENT_VERSION=$(node -p "require('./package.json').version")

  # TODO: fix version containing double-digit numbers e.g. "2.19.1"
  CURRENT_VERSION_MAJOR=${CURRENT_VERSION:0:1}
  CURRENT_VERSION_MINOR=${CURRENT_VERSION:2:1}
  CURRENT_VERSION_PATCH=${CURRENT_VERSION:4:1}

  if [ -n "$IS_MAJOR" ]; then
    CURRENT_VERSION_MAJOR=$((CURRENT_VERSION_MAJOR + 1))
  fi
  if [ -n "$IS_MINOR" ]; then
    CURRENT_VERSION_MINOR=$((CURRENT_VERSION_MINOR + 1))
  fi
  if [ -n "$IS_PATCH" ]; then
    CURRENT_VERSION_PATCH=$((CURRENT_VERSION_PATCH + 1))
  fi

  NEW_VERSION="${CURRENT_VERSION_MAJOR}.${CURRENT_VERSION_MINOR}.${CURRENT_VERSION_PATCH}"
  echo $NEW_VERSION
}

./bin/build.sh $(get_new_version)

git add build/default-widget.js
git add build/default-widget.min.js
git add build/sdk.js
git add build/sdk.min.js
