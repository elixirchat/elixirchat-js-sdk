#!/usr/bin/env bash

./bin/build.sh

git add build/default-widget.js
git add build/default-widget.min.js
git add build/sdk.js
git add build/sdk.min.js
