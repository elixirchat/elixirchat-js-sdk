#!/usr/bin/env bash

npx sass widget/DefaultWidget/styles:dist/styles

# When developing SDK locally (npm run dev), dist/sdk.min.js refers to sdk/ElixirChat.ts
# See: widget/ElixirChatWidget.ts:20
echo """
import { ElixirChat } from '../sdk/ElixirChat';
export default ElixirChat;
""" > dist/sdk.min.js

concurrently \
"npx sass --watch widget/DefaultWidget/styles:dist/styles" \
"npx parcel dev.html --port 8001"
