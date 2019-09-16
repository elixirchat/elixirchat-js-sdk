#!/usr/bin/env bash

concurrently "http-server build -p 8002" "open http://localhost:8002/examples/sdk.html" "open http://localhost:8002/examples/widget.html"
