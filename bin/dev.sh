#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output widget/DefaultWidget/styles/

concurrently \
"node-sass --watch --recursive widget/DefaultWidget/styles/ --output widget/DefaultWidget/styles/" \
"parcel dev.html --port 8001"
