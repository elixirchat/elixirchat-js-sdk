#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When developing SDK locally, dist/sdk.js refers to sdk/ElixirChat.ts
# See: widget/ElixirChatWidget.ts:19
echo """
import { ElixirChat } from '../sdk/ElixirChat';
export default ElixirChat;
""" > dist/sdk.js

concurrently \
"node-sass --watch --recursive widget/DefaultWidget/styles/ --output dist/styles/" \
"parcel dev.html --port 8001"
