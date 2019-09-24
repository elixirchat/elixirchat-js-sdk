#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

concurrently \
"node-sass --watch --recursive widget/DefaultWidget/styles/ --output dist/styles/" \
"parcel dev.html --port 8001"
