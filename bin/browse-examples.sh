#!/usr/bin/env bash

open http://localhost:8002/examples/sdk.html
open http://localhost:8002/examples/widget.html
http-server build -p 8002
