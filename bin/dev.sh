#!/usr/bin/env bash

node-sass --recursive widget/DefaultWidget/styles/ --output dist/styles/

# When developing SDK locally (npm run dev), dist/sdk.min.js refers to sdk/ElixirChat.ts
# See: widget/ElixirChatWidget.ts:20
echo """
import { ElixirChat } from '../sdk/ElixirChat';
export default ElixirChat;
""" > dist/sdk.min.js

concurrently \
"node-sass --watch --recursive widget/DefaultWidget/styles/ --output dist/styles/" \
"parcel dev.html --port 8001"
