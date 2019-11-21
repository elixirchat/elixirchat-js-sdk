#!/usr/bin/env bash


NODE_ARGV=$(node -e "console.log(JSON.parse(process.env.npm_config_argv).original)")

IS_MAJOR=$(echo "$NODE_ARGV" | grep major)
IS_MINOR=$(echo "$NODE_ARGV" | grep minor)
IS_PATCH=$(echo "$NODE_ARGV" | grep patch)


if [ -n "$IS_MAJOR" ]; then
  echo "-- yo major"
fi

if [ -n "$IS_MINOR" ]; then
  echo "-- yo minor"
fi

if [ -n "$IS_PATCH" ]; then
  echo "-- yo patch"
fi



echo 1111
echo "NODE_ARGV $NODE_ARGV"
echo "IS_MAJOR $IS_MAJOR"
echo "IS_MINOR $IS_MINOR"
echo "IS_PATCH $IS_PATCH"
echo 2222

exit 1
