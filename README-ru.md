# elixirchat-sdk
JavaScript SDK для [https://elixir.chat](https://elixir.chat)

[English](https://github.com/elixirchat/elixirchat-widget/blob/master/README.md) | Русский

<img src="https://user-images.githubusercontent.com/1618344/60431837-42ff6180-9bf0-11e9-9ee5-6a2c4b250fc7.png" alt="ElixirChat widget" width="498"/>


### Есть две вещи, которые вы можете сделать с ElixirChat SDK:
1. [Добавить полностью готовый виджет Elixirchat (на картинке сверху) на ваш сайт](#add-default-widget) просто написав несколько строк кода. Внешний вид виджета настраивается с помощью CSS.
2. [Создать свой кастомный виджет](#create-custom-widget), который будет коммуницировать с вашей админ-панелью ElixirChat через Elixirchat SDK.

<br/>

## Примеры

| <img src="https://user-images.githubusercontent.com/1618344/61660053-b36e3f80-acd1-11e9-8f0d-79a8be0c2597.png" alt="Демо виджета ElixirChat" width="100%"/> | <img src="https://user-images.githubusercontent.com/1618344/61660172-f29c9080-acd1-11e9-84e4-9048d0d785f6.png" alt="Демо ElixirChat SDK" width="100%"/> |
| --- |--- |
| __Полностью готовый виджет Elixirchat__<br> Настроен с помощью CSS<br> [Как добавить?](#add-default-widget) | __Простой кастомный виджет__<br> Написано на чистом JS с нуля<br> [Как создать?](#create-custom-widget) |
| [Посмотреть демо](https://elixirchat.surge.sh/examples/widget.html) | [Посмотреть демо](https://elixirchat.surge.sh/examples/sdk.html) |
| [Код](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/widget.html) (~20 строк JS) | [Код](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/sdk.html) (~90 строк JS) |



<br/>
<a id="add-default-widget"></a>

## 1. Как добавить полностью готовый виджет Elixirchat на ваш сайт

> _Посмотрите пример [/build/examples/widget.html](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/widget.html)_

### а) Через пакетный менеджер
Выполните `npm i elixirchat --save` и затем добавьте этот код:

```js
import ElixirChatWidget from 'ElixirChat/widget';

const elixirChatWidget = ElixirChatWidget({
  apiUrl: 'https://elixirchat.yoursite.com:4000', // API URL вашего ElixirChat
  socketUrl: 'wss://elixirchat.yoursite.com:4000/socket', // websocket URL вашего ElixirChat 
  companyId: 'your-company-id-here', // вы получите companyId от команды ElixirChat
  
  // Также можете добавить здесь опциональные параметры "room" и "client"
  // Прокрутите вниз до "ElixirChat Config" для подробностей

  debug: true // для подробного вывода в консоль
});
elixirChatWidget.appendWidget({
  container: document.body, // куда рендерить виджет
  iframeStyles: `.elixirchat-chat-container { color: green }`, // ваш кастомный CSS внутри iframe'а чата
});
```

### б) Через тег `<script>`:
Скачайте [`/build/sdk.min.js`](https://github.com/elixirchat/elixirchat-widget/blob/master/build/sdk.min.js) и [`/build/default-widget.min.js`](https://github.com/elixirchat/elixirchat-widget/blob/master/build/default-widget.min.js) из этого репозитория, а затем включите этот фрагмент в любом месте вашего HTML-кода:

```html
<script src="[YOUR_PATH]/sdk.min.js"></script>
<script src="[YOUR_PATH]/default-widget.min.js"></script>
<script>
  const elixirChatWidget = ElixirChatWidget({
    apiUrl: 'https://elixirchat.yoursite.com:4000', // API URL вашего ElixirChat
    socketUrl: 'wss://elixirchat.yoursite.com:4000/socket', // websocket URL вашего ElixirChat 
    companyId: 'your-company-id-here', // вы получите companyId от команды ElixirChat
    
    // Также можете добавить здесь опциональные параметры "room" и "client"
    // Прокрутите вниз до "ElixirChat Config" для подробностей

    debug: true // для подробного вывода в консоль
  });
  elixirChatWidget.appendWidget({
    container: document.body, // куда рендерить виджет
    iframeStyles: `.elixirchat-chat-container { color: green }`, // ваш кастомный CSS внутри iframe'а чата
  });
</script>
```

<br/>
<a id="create-custom-widget"></a>

## 2. Как создайть свой кастомный виджет

> _Посмотрите пример [/build/examples/sdk.html](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/sdk.html)_

#### Установка:
```bash
npm i elixirchat --save
```
либо включите [`/build/sdk.min.js`](https://github.com/elixirchat/elixirchat-widget/blob/master/build/sdk.min.js) через тег `<script>` в любом месте вашего HTML-кода

```html
<script src="[YOUR_PATH]/sdk.min.js"></script>
```

#### Код:
```js
import ElixirChat from 'elixirchat';
// Либо, если используете тег `<script>`, то объект `window.ElixirChat` будет добавлен в глобальный scope.

const elixirChatWidget = ElixirChatWidget({
  apiUrl: 'https://elixirchat.yoursite.com:4000', // API URL вашего ElixirChat
  socketUrl: 'wss://elixirchat.yoursite.com:4000/socket', // websocket URL вашего ElixirChat 
  companyId: 'your-company-id-here', // вы получите companyId от команды ElixirChat
  
  // Также можете добавить здесь опциональные параметры "room" и "client"
  // Прокрутите вниз до "ElixirChat Config" для подробностей

  debug: true // для подробного вывода в консоль
});


document.querySelector('#send-message-button').addEventListener('click', () => {
  // Отправить новое сообщение
  elixirChat.sendMessage({
    text: document.querySelector('textarea').value, // текст нового сообщения
    attachments: document.querySelector('input[type=file]').files, // прикрепленные файлы
    responseToMessageId: '225a5c-6cf5e0', // ID сообщения, на которое вы отвечаете (если есть)
  })
  .then(newMessage => console.log(newMessage));
});


// Подписаться на новые сообщения в комнате
elixirChat.onMessage((message) => {
  console.log('Новое сообщение:', message.text);
  console.log('От:', message.sender.firstName, message.sender.lastName);
  console.log('Это ответ на:', message.responseToMessage ? message.responseToMessage.text : '—');
});

// Загрузить самые новые сообщения
elixirChat.fetchMessageHistory(10).then(messages => {
  console.log('Получил 10 последних сообщений', messages);
});

// Отслеживать, кто сейчас печатает в комнате
elixirChat.onTyping((peopleWhoAreTyping) => {
  if (peopleWhoAreTyping.length) {
    document.querySelector('#typing').innerHTML = '${peopleWhoAreTyping.map(person => person.firstName).join(', ')} сейчас печатают...';
  }
  else {
    document.querySelector('#typing').innerHTML = 'Никто не печатает';
  }
});

// Сделайте скриншот экрана вашего клиента
document.querySelector('#screenshot-button').addEventListener('click', () => {
  elixirChat.takeScreenshot().then(screenshot => {
  	 document.querySelector('img#preview').src = screenshot.dataUrl; // показать превью скриншота
    elixirchat.sendMessage({
      attachments: [ screenshot.file ] // screenshot.file это инстанс `File()`
    });
  });
});

```

<br/>
<a id="docs"></a>

# Документация

<br/>
<a id="what-are-rooms"></a>

## Прежде чем начать: что такое комнаты?

<img src="https://user-images.githubusercontent.com/1618344/60435459-26b3f280-9bf9-11e9-9e0c-0a153a07bf09.png" alt="ElixirChat Rooms"/>

> _В вашей админ-панели ElixirChat комнаты показаны слева_

В ElixirChat клиенты и ваши операторы поддержки общаются в так называемых комнатах. Есть два типа комнат:

1. <a id="private-room"></a>__Приватная комната:__ для общения один на один между отдельным клиентом и ответственным оператором по поддержке клиентов.
2. <a id="public-room"></a>__Публичная комната:__ групповой чат, где все клиенты видят все сообщения друг друга и ответы ответственного оператора по поддержке клиентов.

<br/>
<a id="config"></a>

## ElixirChat-конфиг

При инициализации `new ElixirChat` или `new ElixirChatWidget`, необходимо передать конфиг.

```js
// Пример:
new ElixirChat({
  apiUrl: 'https://elixirchat.yoursite.com:4000',
  socketUrl: 'wss://elixirchat.yoursite.com:4000/socket',
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
  debug: true,
})
```

<br/>
<a id="config-apiUrl"></a>

#### `apiUrl: string`
GraphQL URL вашего бэкэнда ElixirChat (например, `https://elixirchat.yourcompany.com:4000`)


<br/>
<a id="config-socketUrl"></a>

#### `socketUrl: string`
WebSocket URL вашего бэкэнда ElixirChat, начинающийся с протокола `ws:`/`wss:` (например, `wss://elixirchat.yourcompany.com:4000/socket`)


<br/>
<a id="config-companyId"></a>

#### `companyId: string`
ID вашей компании. Вы получите его от команды ElixirChat.

<br/>
<a id="config-room"></a>

#### `room: { id, title }` (опционально)
Задайте опцию `room`, если вам нужна [публичная комната](#public-room). Как это работает:

- Когда вы передаете `room` _в первый раз_, ElixirChat SDK _создает новую [публичную комнату](#public-room) (в переданным `id` и `title`).
- Когда вы _снова_ инициализируете ElixirChat SDK с тем же `room.id`, SDK _подключается к той же самой комнате_, которая была ранее создана с этим `id`.
- Если вы не передаете `room` вообще, то новая [приватная комната](#private-room) будет создаваться для каждого _уникального_ посетителя.

__Параметры:__

- `room.id: string` — Произвольная строка, используемая для идентификации комнаты.
- `room.title: string` — Название вашей публичной комнаты, которое отображается [в админ-панели ElixirChat (слева)](#what-are-rooms). `room.title` можно менять в любое время — эти изменения будут сразу отражены в админ-панели.

<br/>
<a id="config-client"></a>

#### `client: { id, firstName, lastName }` (опционально)
Задайте опцию `client`, если хотите, чтобы `firstName` и `lastName` отображались в админ-панели ElixirChat.

Если вы не зададите `client`, то будет сгенерировано случайное имя клиента с помощью [unique-names-generator](https://www.npmjs.com/package/unique-names-generator) (например, "Spotty Jade", "Italian Crimson", "Hot Aquamarine" и т.д.), которое будет сохранено в localStorage — чтобы сгенерированное имя сохранялось после перезагрузки страницы.

__Parameters:__

- `client.id: string` - Произвольная строка, используемая для идентификации конкретного клиента.
- `client.firstName: string` - Имя клиента, которое будет отображаться в админ-панели ElixirChat.
- `client.lastName: string` - Фамилия клиента, которая будет отображаться в админ-панели ElixirChat.

<br/>
<a id="config-debug"></a>

#### `debug: boolean` `(default=false)` (опционально)
Включает подробный вывод в консоль от ElixirChat SDK

<br/>
<a id="elixirchat-methods"></a>

## ElixirChat API
Класс `ElixirChatWidget` наследуется от `ElixirChat`, поэтому они оба имеют те же методы и свойства, кроме [тех, которые присутствуют только в `ElixirChatWidget`](#widget).


<br/>

### Методы ElixirChat:

<a id="sendMessage"></a>

#### `sendMessage({ text, attachments, responseToMessageId })`
Отправка сообщения в комнату. Требуется передать хотя бы либо `text`, либо `attachments`.

__Параметры аргумента {...}:__

- `text: string (опциональный)` - текст сообщения
- `attachments: Array<File> (опциональный)` - список вложений в [формате File ()](https://developer.mozilla.org/en-US/docs/Web/API/File)
- `responseToMessageId: string (опциональный)` - ID сообщения, на которое отвечает пользователь (если есть)

__Возвращает: `Promise()`__, у которого коллбэк в `then` callback имеет такие аргументы:

- `message` - Ваше сообщение, которое было только что отправлено (в [формате, описанном ниже](#onMessage-message)).

```js
// Пример:
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
Подписаться на новые сообщения в комнате.

__Arguments:__

- `callback: function` - Функция, которая выполняется при получении нового сообщения.

__Параметры коллбэка:__

- <a id="onMessage-message"></a>`message: object`:
  - `message.id: string` - ID сообщения
  - `message.text: string` - текст сообщения
  - `message.timestamp: string` - timestamp сообщения в формате ISO
  - <a id="onMessage-cursor"></a>`message.cursor: string` - поле `cursor`, необходимое для [`fetchMessageHistory()`](#fetchMessageHistory)
  - `message.sender: object` - информация об отправителе:
      - `sender.elixirChatId: string` - ID пользователя отправителя, сгенерированный бэкэндом ElixirChat (это _НЕ_ [`client.id` из конфига](#config-client))
      - `sender.firstName: string` - имя отправителя
      - `sender.lastName: string` - фамилия отправителя
      - `sender.isCurrentUser: boolean` - _true_, если отправитель — это текущий клиент, который [был передан в конфиг ElixirChat как `client`](#config-client)
      - `sender.isAgent: boolean` - _true_, если отправитель — это оператор поддержки клиентов; _false_, если отправитель — это другой клиент (в случае публичной комнаты)
      - `sender.id: string | undefined` - [ElixirChar `client.id`](#config-client) отправителя (однако, если отправитель агент поддержки клиентов, то `sender.id` - _undefined_)
  - `message.responseToMessage: object | null` - содержит информацию об изначальном сообщении (если это был ответ на другое сообщение) или _null_ (если это сообщение — не ответ на другое)
      - `responseToMessage.id: string` - ID изначального сообщения
      - `responseToMessage.text: string` - текст изначального сообщения
      - `responseToMessage.sender: object` - отправитель изначального сообщения (в том же формате, что `message.sender` выше)

```js
// Пример:
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
- `firstMessageCursor: string (опционально)` - the [`cursor`](#onMessage-cursor) field of a message prior to which you'd like to fetch messages. If not provided, the latest messages would be fetched.

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

- `peopleWhoAreTyping: Array<{user}>` - Array of people who are currently typing text in this room. If the array is empty, then other participants are not currently typing anything.
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

#### `reconnect({`[`room`](#config-room)`,`[`client`](#config-client)`})`
Change room or client (or both) _after_ you already initialized ElixirChat or ElixirChatWidget.

- If you pass a new `room` only, SDK will reconnect you to a new room with the same client data.
- If you pass a new `client` only, SDK will reconnect you to the same room with new client data.
    - _BUT,_ if you were previously connected to a [private room](#private-room) (i.e. without passing a room ID in the first place), and you pass a new `client` only, you will be reconnected to a _different_ private room.

__Argument parameters {...}:__

- `room: object (опционально)` - same format as [`room` in the config](#config-room)
- `client: object (опционально)` - same format as [`client` in the config](#config-client)

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

- `callback: function` - Function that fires if connecting to the room failed.

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
- <a id="sdk-reachedBeginningOfMessageHistory"></a>`reachedBeginningOfMessageHistory: boolean` - _true_, if the chunk of first messages in room history was ever requested via [`fetchMessageHistory()`](#fetchMessageHistory) (meaning that as the user scrolled up to the beginning of chat history, [`fetchMessageHistory()`](#fetchMessageHistory) was requesting consequent message chunks and ultimately reached the beginning of history)

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

- `callback: function` - a function that fires every time the chat window is opened or closed

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
