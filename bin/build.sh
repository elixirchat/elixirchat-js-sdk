#!/usr/bin/env bash

parcel build sdk/index.ts --out-dir build --out-file sdk.js --no-source-maps --no-minify
parcel build sdk/index.ts --out-dir build --out-file sdk.min.js --no-source-maps

parcel build widget/index.ts --out-dir build --out-file default-widget.js --no-source-maps --no-minify
parcel build widget/index.ts --out-dir build --out-file default-widget.min.js --no-source-maps