# elixirchat-sdk
JavaScript SDK for [https://elixir.chat](https://elixir.chat)

---

In English | [по-русски](https://github.com/elixirchat/elixirchat-widget/blob/master/README-ru.md)

---

<img src="https://user-images.githubusercontent.com/1618344/60431837-42ff6180-9bf0-11e9-9ee5-6a2c4b250fc7.png" alt="ElixirChat widget" width="498"/>


### There are two things you can do with ElixirChat SDK:
1. [Add a fully implemented Elixirchat widget (pictured above) to your website](#add-default-widget) by simply writing a couple lines of code. The widget's look and feel is customizable via CSS.
2. [Create your own custom widget](#create-custom-widget) that communicates with your ElixirChat admin panel via Elixirchat SDK.

## Examples
| <img src="https://user-images.githubusercontent.com/1618344/61660053-b36e3f80-acd1-11e9-8f0d-79a8be0c2597.png" alt="ElixirChat Widget Demo" width="100%"/> | <img src="https://user-images.githubusercontent.com/1618344/61660172-f29c9080-acd1-11e9-84e4-9048d0d785f6.png" alt="ElixirChat Widget SDK" width="100%"/> |
| --- |--- |
| __Fully implemented Elixirchat widget__<br> Customized with CSS<br> [How to add?](#add-default-widget) | __Custom widget__<br> Written with pure JS from scratch<br> [How to create?](#create-custom-widget) |
| [See demo](https://elixirchat.surge.sh/examples/widget.html) | [See demo](https://elixirchat.surge.sh/examples/sdk.html) |
| [Code](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/widget.html) (~20 lines of JS) | [Code](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/sdk.html) (~90 lines of JS) |



<br/>
<a id="add-default-widget"></a>

## 1. How to add a fully implemented ElixirChat widget to your website

### a) Via package manager
Run `npm i elixirchat --save` and then add this code:

```js
import ElixirChatWidget from 'ElixirChat/widget';

const elixirChatWidget = ElixirChatWidget({
  apiUrl: 'https://elixirchat.yoursite.com:4000', // your ElixirChat API URL
  socketUrl: 'ws://elixirchat.yoursite.com:4000/socket', // your ElixirChat websocket URL
  companyId: 'your-company-id-here', // you will get companyId from ElixirChat team
  // You may also include optional "room" and "client" parameters here
  // Scroll down to "ElixirChat Config" for details

  debug: true // for verbose console output
});
elixirChatWidget.appendWidget({
  container: document.body,
  iframeStyles: `.your-custom-widget-css-code-here { color: green }`,
});
```

### b) Via `<script>` tag:
Download `/dist/sdk.min.js` and `/dist/default-widget.min.js` from this repository and then include this snippet anywhere into your HTML-code:
```html
<script src="[YOUR_PATH]/sdk.min.js"></script>
<script src="[YOUR_PATH]/default-widget.min.js"></script>
<script>
  const elixirChatWidget = ElixirChatWidget({
    companyId: 'your-company-id-here', // you will get companyId from ElixirChat team
    // You may also include optional "room" and "client" parameters here
    // Scroll down to "ElixirChat Config" for details

    debug: true // for verbose console output
  });
  elixirChatWidget.appendWidget({
    container: document.body,
    styles: `.your-custom-widget-css-code-here { color: green }`,
  });
</script>
```

<br/>
<a id="create-custom-widget"></a>

## 2. How to create your own custom widget

#### Install:
```bash
npm i elixirchat --save
```
or include `/dist/sdk.min.js` via the `<script>` tag anywhere into your HTML code (approximately 2Kb)
```html
<script src="[YOUR_PATH]/sdk.min.js"></script>
```

#### Code:
```js
import ElixirChat from 'elixirchat';
// Alternatively, if using `<script>` tag, `window.ElixirChat` object be added to global scope.

const elixirChat = new ElixirChat({
  companyId: 'your-company-id-here', // you will get companyId from ElixirChat team
  // You may also include optional "room" and "client" parameters here
  // Scroll down to "ElixirChat Config" for details

  debug: true // for verbose console output
});


document.querySelector('#send-message-button').addEventListener('click', () => {
  // Forward message from a customer to your customer support team
  elixirChat.sendMessage({
    text: document.querySelector('textarea').value, // message from a customer
    attachments: document.querySelector('input[type=file]').files, // files attached by your customer
    responseToMessageId: '225a5c-6cf5e0', // the ID of a message your customer replies to (if any)
  })
  .then(status => console.log(status));
});


// Subscribe to new messages from your customer support agent
elixirChat.onMessage((message) => {
  console.log(message.text, message.responseToMessage); // a new reply from your customer support agent
  console.log(message.sender.firstName, message.sender.lastName);  // your customer support agent's name
});

// Track who's currently typing in the room
elixirChat.onTyping((peopleWhoAreTyping) => {
  if (peopleWhoAreTyping.length) {
    document.querySelector('#typing').innerHTML = '${peopleWhoAreTyping.map(person => person.firstName).join(', ')} are typing...';
  }
  else {
    document.querySelector('#typing').innerHTML = 'Nobody is typing';
  }
});


document.querySelector('#screenshot-button').addEventListener('click', () => {
  // Make screenshot of your customer's screen (will ask for user's permission)
  elixirChat.takeScreenshot().then(screenshotFile => {
    elixirchat.sendMessage({
      attachments: [ screenshotFile ] // screenshotFile is a `new File()` instance
    });
  });
});

```

<br/>
<a id="docs"></a>

# Documentation

<br/>
<a id="what-are-rooms"></a>

## Before getting started: What are rooms?

<img src="https://user-images.githubusercontent.com/1618344/60435459-26b3f280-9bf9-11e9-9e0c-0a153a07bf09.png" alt="ElixirChat Rooms"/>

> _In your ElixirChat admin panel, all rooms are listed on the left_

In ElixirChat, the customers and your customer support agents communicate in so called rooms. There are two types of rooms:
1. <a id="private-room"></a>__Private room:__ for one-on-one communication between a single customer and an assigned customer support manager.
2. <a id="public-room"></a>__Public room:__ a group chat where all customers see each other's messages and replies from the assigned customer support manager.

<br/>
<a id="config"></a>

## ElixirChat Config

You have to pass over the config when initializing `new ElixirChat` or `new ElixirChatWidget`.

```js
// Example:
new ElixirChat({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: 'your-company-id-here',
  room: {
    id: 'your-room-id-here',
    title: 'Your room title to be displayed in ElixirChat admin panel (on the left)'
  },
  client: {
    id: 'your-own-id-you-may-use-to-identify-a-customer',
    firstName: 'you may pass your customer\'s first name here',
    firstName: 'you may pass your customer\'s last name here',
  },
  debug: true, // enables verbose console output
})
```

<br/>
<a id="config-apiUrl"></a>

#### `apiUrl: string` (required)
Your ElixirChat backend GraphQL URL (for example `https://elixirchat.yourcompany.com:4000`)


<br/>
<a id="config-socketUrl"></a>

#### `socketUrl: string` (required)
Your ElixirChat backend WebSocket URL starting with `ws:` protocol (for example `ws://elixirchat.yourcompany.com:4000/socket`)


<br/>
<a id="config-companyId"></a>

#### `companyId: string` (required)
Your company ID. You will get it from ElixirChat team.

<br/>
<a id="config-room"></a>

#### `room: { id: string, title: string }`
Pass it if you need a [public room](#public-room). How it works:

- When you use it _for the first time,_ it _creates_ a new [public room](#public-room) (with the specified `id` and `title`).
- When you use it _again_ later, ElixirChat SDK _connects to the same room_ that's been previously created with this `id`.
- If you don't pass it at all, a new [private room](#private-room) would be created for every _unique_ visitor (but saved to @@@).

__Parameters:__

- `room.id` — Arbitrary string you can use to identify the room.
- `room.title` — Your public room title that is displayed [in your ElixirChat admin panel (on the left)](#what-are-rooms). Feel free to change it over time if you need to — these changes will be reflected in the admin panel as well.

<br/>
<a id="config-client"></a>

#### `client: { id: string, firstName: string, lastName: string }` 
Pass it if you want to be able recognize your customer later on.

__Parameters:__

- `client.id` - Arbitrary string you can use to identify a particular customer
- `client.firstName` - Customer's first name to be displayed in the ElixirChat admin panel
- `client.lastName` - Customer's last name to be displayed in the ElixirChat admin panel

<br/>
<a id="config-debug"></a>

#### `debug: boolean` (default = false)
Enables ElixirChat SDK verbose console output

<br/>
<a id="elixirchat-methods"></a>

## ElixirChat API
Class `ElixirChatWidget` extends `ElixirChat` therefore they both share all methods and properties except [these that are only present in `ElixirChatWidget`](#widget).


<br/>

### ElixirChat methods:

<a id="sendMessage"></a>

#### `sendMessage({ text, attachments, responseToMessageId })`
Send customer's message to the room.

__Argument parameters {...}:__

- `text: string` - message text
- `attachments: Array<File>` - list of attachments in a [File() format](https://developer.mozilla.org/en-US/docs/Web/API/File)
- `responseToMessageId: string` - the ID of a message your customer replies to (if any)

__Returns: `Promise()`__ whose `then` callback has these arguments:

- `message` - Your message that's been just sent (in the [format described below](#onMessage-message)).

```js
// Example:
elixirChat.sendMessage({
  text: 'my message text',
  attachments: document.querySelector('#inputFile').files,
  responseToMessageId: '6a4t24-y43th3',
})
.then(yourMessage => console.log(yourMessage));
```

<br/>
<a id="onMessage"></a>

#### `onMessage((message) => { ... })`
Subscribe to the event that fires every time a new message is sent to the room.

__Arguments:__

- `callback: function` - Function that runs every time a new message is sent.

__Callback parameters:__

- <a id="onMessage-message"></a>`message: object`:
  - `message.id: string` - message ID
  - `message.text: string` - message text
  - `message.timestamp: string` - message timestamp in ISO format
  - <a id="onMessage-cursor"></a>`message.cursor: string` - message cursor needed for [`fetchMessageHistory()`](#fetchMessageHistory)
  - `message.sender: object` - sender info:
      - `sender.elixirChatId: string` - user ID if the sender generated by ElixirChat backend (it's _NOT_ a [`client.id` from config](#config-client))
      - `sender.firstName: string` - sender's first name
      - `sender.lastName: string` - sender's last name
      - `sender.isCurrentUser: boolean` - _true_ if sender is the current client that was [passed on to ElixirChat config as `client`](#config-client)
      - `sender.isAgent: boolean` - _true_ if the sender is a customer support agent; _false_ if the sender is another client (in case of public room)
      - `sender.id: string | undefined` - [ElixirChar `client.id`](#config-client) of the sender (however, if sender a customer support agent, then `sender.id` is _undefined_)
  - `message.responseToMessage: object | null` - contains original message info (if this is a reply to another message) or _null_ (if this message is not a reply)
      - `responseToMessage.id: string` - original message ID
      - `responseToMessage.text: string` - original message text
      - `responseToMessage.sender: object` - original message sender (same format as `message.sender` above)

```js
// Example:
elixirChat.onMessage((message) => {
  if (message.sender.isCurrentUser) {
    console.log('You sent a message ', message.text);
  }
  else {
    console.log('New message from ', message.sender.isAgent ? 'agent' : 'client');
    console.log(message.text);
  }
  if (message.responseToMessage) {
    console.log('This is a reply to ', message.responseToMessage.text);
  }
});
```


<br/>
<a id="fetchMessageHistory"></a>

#### `fetchMessageHistory(limit, firstMessageCursor)`
Fetch a chunk of message history.

- Chunk's size is determined by the `limit`.
- If no `firstMessageCursor` is provided, chunk contains the latest messages.
- Otherwise, if `firstMessageCursor` _is_ provided, the chunk contains messages chronologically preceding the message with the [`cursor`](#onMessage-cursor) that equals `firstMessageCursor`.

__Arguments:__

- `limit: number` - the size of the returned message chunk
- `firstMessageCursor: string (optional)` - the [`cursor`](#onMessage-cursor) field of a message prior to which you'd like to fetch messages. If not provided, the latest messages would be fetched.

__Returns: `Promise()`__ whose `then` callback has these arguments:

- `messages: array` - array of messages in the [format described above](#onMessage-message)

```js
// Example:
let messageStorage = [];

// Fetch 10 most recent messages
elixirChat.fetchMessageHistory(10).then(latestMessages => {
  messageStorage = latestMessages;
  console.log('Fetched 10 latest messages', latestMessages);
});

document.querySelector('button#load-previous-messages').addEventListener('click', e => {
  elixirChat.fetchMessageHistory(10, messageStorage[0].cursor).then(fetchedChunk => {

    // Prepend fetched history into the messageStorage
    messageStorage = fetchedChunk.concat(messageStorage);

    // Disable "Load previous messages" button when all history is loaded
    if (elixirChat.reachedBeginningOfMessageHistory) {
      e.target.innerText = 'All messages loaded';
      e.target.disabled = true;
    }
  });
});
```



<br/>
<a id="onTyping"></a>

#### `onTyping((peopleWhoAreTyping) => { ... })`
Subscribe to the event that fires when other participants start or finish typing text in the current room.

__Arguments:__

- `callback: function` - Function that runs when other participants start or finish typing text in the current room.

__Callback arguments:__

- `peopleWhoAreTyping: Array<{user}>` - Array of people who are currently typing text in this room. If array is empty, then other participants are not currently typing anything.
    - `{user}.id` - participant's ID
    - `{user}.firstName` - participant's first name
    - `{user}.lastName` - participant's last name

```js
// Example:
elixirChat.onTyping((peopleWhoAreTyping) => {
  if (peopleWhoAreTyping.length) {
    document.querySelector('#typing').innerHTML = '${peopleWhoAreTyping.map(person => person.firstName).join(', ')} are typing...';
  }
  else {
    document.querySelector('#typing').innerHTML = 'Nobody is typing';
  }
});
```

<br/>
<a id="dispatchTypedText"></a>

#### `dispatchTypedText(typedText)`

Dispatch the text typed so far by the client to ElixirChat admin panel. This method _doesn't send a message_ but only reports that current client has typed a certain text. This would be displayed in the "typing..." status in ElixirChat admin panel.

__Arguments:__

- `typedText: string` - The text typed so far by the client.

```js
// Example:
document.querySelector('textarea#message').addEventListener('keyup', (e) => {
  elixirChat.dispatchTypedText(e.target.value);
});
```


<br/>
<a id="takeScreenshot"></a>

#### `takeScreenshot()`
Make a screenshot of the customer's screen. This would open a [standard browser window asking to share user's screen](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture#Capturing_screen_contents).

__Returns: `Promise()`__ whose `then` callback has these arguments:

- `screenshot: object`:
  - `screenshot.dataUrl: string` - a base64 data URL string of the screenshot in PNG format
  - `screenshot.file: File` - a [`File()`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance of the screenshot in PNG format

```js
// Example:
elixirChat.takeScreenshot().then(screenshot => {
  // Render preview
  document.querySelector('img#preview').src = screenshot.dataUrl;
  
  // Send to ElixirChat admin as attachment
  elixirchat.sendMessage({ attachments: [ screenshot.file ] });
})
.catch(e => alert(e.message));
```

<br/>
<a id="reconnect"></a>

#### `reconnect({`[`room`](#config-room),[`client`](#config-client)`})`
Change room or client (or both) _after_ you already initialized ElixirChat or ElixirChatWidget.

- If you pass a new `room` only, SDK will reconnect you to a new room with the same client data.
- If you pass a new `client` only, SDK will reconnect you to the same room with a new client data.
    - _BUT,_ if you were previously connected to a [private room](#private-room) (i.e. without passing a room ID in the first place), and you pass a new `client` only, you will be reconnected to a _different_ private room.

__Argument parameters {...}:__

- `room: object` - same format as [`room` in the config](#config-room)
- `client: object` - same format as [`client` in the config](#config-client)

__Returns: `new Promise()`__

```js
// Example 1: change both room and client
elixirChat.reconnect({
  room: {
    id: 'new-room-id',
    title: 'My new room title', // or don't pass the title to keep it the same
  },
  client: {
    id: MyApp.currentUser.id,
    firstName: MyApp.currentUser.full_name.split(' ')[0],
    lastName: MyApp.currentUser.full_name.split(' ')[1],
  },
}).then(status => console.log(status));

// Example 2: change client info only but keep the same room (unless that room was private)
elixirChat.reconnect({
  client: {
    id: MyApp.currentUser.id,
    firstName: MyApp.currentUser.full_name.split(' ')[0],
    lastName: MyApp.currentUser.full_name.split(' ')[1],
  },
});

// Example 3: change room but keep the same client data
elixirChat.reconnect({
  room: {
    id: 'new-room-id',
    title: 'My new room title', // or don't pass the title to keep it the same
  },
});
```

<br/>
<a id="onConnectSuccess"></a>

#### `onConnectSuccess(() => { ... })`
Subscribe to the event that fires after establishing a successful connection to a room. This happens either after initial SDK initialization, or after invoking [`reconnect()`](#reconnect) method.

__Arguments:__

- `callback: function` - Function that runs after establishing a successful connection to a room.

```js
elixirChat.onConnectSuccess(() => {
  console.log(elixirChat.companyId);
  console.log(elixirChat.room);
  console.log(elixirChat.client);
});
```

<br/>
<a id="onConnectError"></a>

#### `onConnectError(error => { ... })`
Subscribe to the event that fires if connection to the room failed. This might happen either after initial SDK initialization, or after invoking [`reconnect()`](#reconnect) method.

__Arguments:__

- `callback: function` - Function that fires if connection to the room failed.

```js
elixirChat.onConnectError((e) => {
  console.log('Could not connect to a room', e);
});
```

<br/>
<a id="sdk-properties"></a>

### ElixirChat properties:

- <a id="sdk-apiUrl"></a>`apiUrl: string` - Same as passed to [config](#config-apiUrl)
- <a id="sdk-socketUrl"></a>`socketUrl: string` - Same as passed to [config](#config-socketUrl)
- <a id="sdk-companyId"></a>`companyId: string` - Same as passed to [config](#config-companyId)
- <a id="sdk-room"></a>`room: object` - Same as passed to [config](#config-room)
- <a id="sdk-client"></a>`client: object` - Same as passed to [config](#config-client)
- <a id="sdk-debug"></a>`debug: boolean` - Same as passed to [config](#config-debug)
- <a id="sdk-elixirChatRoomId"></a>`elixirChatRoomId: string` - current room ID generated by ElixirChat backend (it's _NOT_ the same as [`room.id`](#config-room) in config)
- <a id="sdk-elixirChatClientId"></a>`elixirChatClientId: string` - current client ID generated by ElixirChat backend (it's _NOT_ the same as [`client.id`](#config-client) in config)
- <a id="sdk-authToken"></a>`authToken: string` - token that's been generated by ElixirChat backend after successful connection to a room
- <a id="sdk-connected"></a>`connected: boolean` - _true_, if SDK is currently connected to a room
- <a id="sdk-reachedBeginningOfMessageHistory"></a>`reachedBeginningOfMessageHistory: boolean` - _true_, if the chunk of first messages in room history was ever requested via `fetchMessageHistory()` (meaning that as the user scrolled up to the beginning of chat history, `fetchMessageHistory()` was requesting consequent message chunks and ultimately reached the beginning of history)

```js
// Examples:
document.querySelector('button#load-previous-messages').addEventListener('click', e => {
  elixirChat.fetchMessageHistory(5, messages[0].cursor).then(history => {
    messages = [...history, ...messages];

    // Disable "Load previous messages" button when all history is loaded
    if (elixirChat.reachedBeginningOfMessageHistory) {
      e.target.innerText = 'All messages loaded';
      e.target.disabled = true;
    }
  });
});

if (elixirChat.connected) {
  document.getElementById('status').className = 'active';
}

elixirChat.onConnectSuccess(() => {
  document.getElementById('status').className = 'active';
  console.log('Connected to ', elixirChat.room, elixirChat.elixirChatRoomId);
});
```


<br/>
<a id="widget"></a>

## ElixirChatWidget API

There are a few more methods and properties specifically in ElixirChatWidget.

<br/>

### ElixirChatWidget methods:

<a id="widget-toggleChatVisibility"></a>
#### `toggleChatVisibility()`
Programmatically show or hide the widget chat window.

```js
// Example:
elixirChatWidget.toggleChatVisibility();
console.log('Chat window is now ', elixirChatWidget.widgetIsVisible ? 'open' : 'closed');
```

<br/>
<a id="widget-onToggleChatVisibility"></a>

#### `onToggleChatVisibility(callback)`
Subscribe to open/close events of the widget chat window.

__Arguments:__

- `callback: function` - function that fires every time the chat window is opened or closed

```js
// Example:
elixirChatWidget.onToggleChatVisibility((isVisible) => {
  console.log('Chat window is now ', isVisible ? 'open' : 'closed');
});
```

<br/>
<a id="widget-appendWidget"></a>

#### `appendWidget({ container, visibleByDefault, iframeStyles })`
Append ElixirChat widget to a container, customize via CSS if needed.

__Parameters {...}:__

- `container: HTMLElement` - DOM element the widget would be appended to (at the end of it).
- `visibleByDefault: boolean` `(default=false)` - if true, the widget will be open by default.
- `iframeStyles: string` - your custom CSS code applied to ElixirChat Widget _inside the iframe_ so that you can easily change look and feel of the chat window.

__Returns:__

- `JSX.Element` - Widget React component (rendered inside the `<iframe>` element)


```js
// Example:
elixirChatWidget.appendWidget({
  container: document.body,
  iframeStyles: `
    .elixirchat-chat-container { background: #eeeeee }
    .elixirchat-chat-messages__item { background: #53B561 } 
  `,
});
```

<br/>

### ElixirChatWidget properties:

- <a id="widget-container"></a>`container: HTMLElement` - Same as passed to [`appendWidget()`](#widget-appendWidget)
- <a id="widget-iframeStyles"></a>`iframeStyles: string` - Same as passed to [`appendWidget()`](#widget-appendWidget)
- <a id="widget-visibleByDefault"></a>`visibleByDefault: boolean` - Same as passed to [`appendWidget()`](#widget-appendWidget)
- <a id="widget-widgetIsVisible"></a>`widgetIsVisible: boolean` - Flag indicating whether the chat window is currently open
- <a id="widget-widgetChatIframe"></a>`widgetChatIframe: HTMLIFrameElement` - Chat window IFrame element
- <a id="widget-widgetChatReactComponent"></a>`widgetChatReactComponent: JSX.Element` - Widget React component (rendered inside the IFrame element)
- <a id="widget-widgetButton"></a>`widgetButton: HTMLElement` - Widget activation Button element (rendered outside the IFrame element)

```js
// Examples:
console.log('Widget React component state is', elixirChatWidget.widgetChatReactComponent.state);

elixirChatWidget.widgetChatIframe.style = 'border: 1px solid black';

if (elixirChatWidget.widgetIsVisible) {
	document.getElementById('my-app-column').className = 'shrinked';
}
```

<br/>
<a id="developers"></a>

## For developers

If you want to roll out ElixirChat SDK and widget as a developer:

```bash
# Clone the repo and install dependencies
git clone git@github.com:elixirchat/elixirchat-widget.git
npm install

# Run dev version on http://localhost:8001/
npm run dev

# Compile `build/sdk.min.js` & `build/default-widget.min.js` out of your current code
npm run build

# Run SDK and widget examples on http://localhost:8002
npm run examples

# Deploy your SDK and widget examples to surge.sh (deploy URL is specified in `build/CNAME`)
npm run examples-deploy
```
