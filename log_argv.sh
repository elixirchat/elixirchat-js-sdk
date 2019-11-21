#!/usr/bin/env bash


NODE_ARGV=$(node -e "console.log(JSON.parse(process.env.npm_config_argv).original)")

IS_MAJOR=$(echo "$NODE_ARGV" | grep major)
IS_MINOR=$(echo "$NODE_ARGV" | grep minor)
IS_PATCH=$(echo "$NODE_ARGV" | grep patch)


CURRENT_VERSION=$(node -p "require('./package.json').version")
CURRENT_VERSION_ARR=($(echo "$CURRENT_VERSION" | tr '.' '\n'))

if [ -n "$IS_MAJOR" ]; then
  echo "-- yo major"
  (( CURRENT_VERSION_ARR[1]++ ))
fi

if [ -n "$IS_MINOR" ]; then
  echo "-- yo minor"
  (( CURRENT_VERSION_ARR[2]++ ))
fi

if [ -n "$IS_PATCH" ]; then
  (( CURRENT_VERSION_ARR[3]++ ))
  echo "-- yo patch "
fi


NEW_VERSION="${CURRENT_VERSION_ARR[1]}.${CURRENT_VERSION_ARR[2]}.${CURRENT_VERSION_ARR[3]}"


echo 1111
echo "CURRENT_VERSION_ARR $CURRENT_VERSION_ARR"
echo "NEW_VERSION $NEW_VERSION"
echo "NODE_ARGV $NODE_ARGV"
echo "IS_MAJOR $IS_MAJOR"
echo "IS_MINOR $IS_MINOR"
echo "IS_PATCH $IS_PATCH"
echo "CURRENT_VERSION $CURRENT_VERSION"
echo 2222

exit 1
