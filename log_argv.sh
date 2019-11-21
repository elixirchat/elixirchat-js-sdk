#!/usr/bin/env bash


FFF=$(node -e 'JSON.parse(process.env.npm_config_argv).original')

IS_MAJOR=$(npm config get argv | grep major)
IS_MINOR=$(npm config get argv | grep minor)
IS_PATCH=$(npm config get argv | grep patch)


echo 1111
echo "FFF $FFF"
echo "IS_MAJOR $IS_MAJOR"
echo "IS_MINOR $IS_MINOR"
echo "IS_PATCH $IS_PATCH"
echo 2222

exit 1
