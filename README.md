# elixirchat-sdk
JavaScript SDK for [https://elixir.chat](https://elixir.chat)


<img src="https://user-images.githubusercontent.com/1618344/60431837-42ff6180-9bf0-11e9-9ee5-6a2c4b250fc7.png" alt="ElixirChat widget" width="498"/>


### There are two things you can do with ElixirChat SDK:
1. [Add a fully implemented Elixirchat widget (pictured above) to your website](#add-default-widget) by simply writing a couple lines of code. The widget's look and feel is customizable via CSS.
2. [Create your own custom widget](#create-custom-widget) that communicates with your ElixirChat admin panel via Elixirchat SDK.


<a id="add-default-widget"></a>
## 1. How to add a fully implemented ElixirChat widget to your website

### a) Via package manager
Run `npm i elixirchat --save` and then add this code:
```js
import ElixirChatWidget from 'ElixirChat/widget';

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
```

### b) Via <script> tag:
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
    replyByMessageId: '225a5c-6cf5e0', // the ID of a message your customer replies to (if any)
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
  elixirChat.makeScreenshot().then(screenshotFile => {
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
<a id="config-companyId"></a>

#### `companyId: string` (the only required parameter)
Your company ID. You will get it from ElixirChat team.

<br/>
<a id="config-room"></a>

#### `room: { id: string, title: string }`
Pass it if you need a [public room](#public-room). How it works:
- When you use it _for the first time,_ it _creates_ a new [public room](#public-room) (with the specified `id` and `title`).
- When you use it _again_ later, ElixirChat SDK _connects to the same room_ that's been previously created with this `id`.
- If you don't pass it at all, a new [private room](#private-room) would be created for every unique visitor.

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

## ElixirChat methods
Class `ElixirChatWidget` extends `ElixirChat` therefore they both share some methods (actually, all of them [but one](#appendWidget)):

<br/>
<a id="sendMessage"></a>

#### `sendMessage ({ text: string, attachments[]: File, replyByMessageId: string })`
Send customer's message to your customer support agent.

__Parameters:__
- `text` - message text
- `attachments` - list of attachments in a [JS File() format](https://developer.mozilla.org/en-US/docs/Web/API/File)
- `replyByMessageId` - the ID of a message your customer replies to (if any)

__Returns: `new Promise()`__

```js
// Example:
elixirChat.sendMessage({
  text: 'my message text',
  attachments: document.querySelector('#inputFile').files,
  replyByMessageId: '6a4t24-y43th3',
})
.then(status => console.log(status));
```

<br/>
<a id="onMessage"></a>

#### `onMessage ((message) => { ... })`
Callback that fires once a message is received from your customer support agent.

__Callback parameters:__
- `message.id` - message ID
- `message.text` - message text
- `message.timestamp` - message timestamp in ISO format
- `message.sender` - your customer support agent info
    - `sender.id` - ID
    - `sender.firstName` - first name
    - `sender.lastName` - last name
- `message.responseToMessage` - contains info if this message was a reply to another message
    - `responseToMessage.id` - original message ID
    - `responseToMessage.text` - original message text
    - `responseToMessage.sender {id, firstName, lastName}` - original message sender

```js
elixirChat.onMessage((message) => {
  console.log('New message from customer support agent:', message.text);
  console.log('Sent by agent:', message.sender.firstName, message.sender.lastName);
  console.log(
    'This is a reply to this message:', message.responseToMessage.text, '\n',
    'which was sent by', message.responseToMessage.sender.firstName
  );
});
```

<br/>
<a id="onTyping"></a>

#### `onTyping ((peopleWhoAreTyping) => { ... })`
Callback that fires when other participants start or finish typing text in the current room.

__Callback parameters:__
- `peopleWhoAreTyping[<user>]` - list of people who are currently typing text in this room. If empty array, then other participants are not currently typing anything.
    - `<user>.id` - participant's ID
    - `<user>.firstName` - participant's first name
    - `<user>.lastName` - participant's last name

```js
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
<a id="makeScreenshot"></a>

#### `makeScreenshot ()`
Make a screenshot of the customer's screen (while also asking customer's [permission to share their screen](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture#Capturing_screen_contents)).

__Returns: `new Promise()`__

```js
// Example:
elixirChat.makeScreenshot().then(screenshotFile => {
  // screenshotFile is a `new File()` instance
  // you can send to ElixirChat admin it via elixirchat.sendMessage({ attachments: [ screenshotFile ] });
});
```

<br/>
<a id="reconnect"></a>

#### `reconnect ({ room: { id, title  }, client: { id, firstName, lastName } })`
Change room or client (or both) _after_ you already initialized `ElixirChat` or `ElixirChatWidget`.
- If you pass a new `room` only, SDK will reconnect you to a new room with the same client data.
- If you pass a new `client` only, SDK will reconnect you to the same room with a new client data.
    - _BUT,_ if you were previously connected to a [private room](#private-room) (i.e. without passing a room ID in the first place), and you pass a new `client` only, you will be reconnected to a _different_ private room.

__Parameters:__
- `room: Object` - same format as [`room` in the config](#config-room)
- `client: Object` - same format as [`client` in the config](#config-client)

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

#### `onConnectSuccess (() => { ... })`
A callback that fires after establishing a successful connection to a room. This happens either after initial SDK initialization, or after invoking [`reconnect()`](#reconnect) method.

```js
elixirChat.onConnectSuccess(() => {
  console.log(elixirChat.companyId);
  console.log(elixirChat.room);
  console.log(elixirChat.client);
});
```

<br/>
<a id="onConnectError"></a>

#### `onConnectError (() => { ... })`
A callback that fires if connection to the room failed. This happens either after initial SDK initialization, or after invoking [`reconnect()`](#reconnect) method.

```js
elixirChat.onConnectError((e) => {
  console.log('Could not connect to a room', e);
});
```

<br/>

## There is one more method specifically in `ElixirChatWidget`:

<a id="appendWidget"></a>
#### `appendWidget ({ container: HTMLElement, styles: string })`
Append ElixirChat widget to a container, customize via CSS if needed

__Parameters:__
- `container` - DOM element to where the widget would be appended (at the end of it)
- `styles` - your custom CSS code applied to ElixirChat Widget so that you can easily change look and feel of your widget

```js
// Example:
elixirChatWidget.appendWidget({
  container: document.body,
  styles: `
    .widget { background: #eeeeee }
    .message { background: #53B561 } 
  `,
});
```
