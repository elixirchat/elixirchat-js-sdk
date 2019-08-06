# elixirchat-js-sdk
JavaScript SDK для [https://elixir.chat](https://elixir.chat)

[English](https://github.com/elixirchat/elixirchat-widget/blob/master/README.md) | Русский

<img src="https://user-images.githubusercontent.com/1618344/61771606-e95a1380-adf8-11e9-86ca-c248368a7461.png" alt="Виджет ElixirChat" width="498"/>


### Есть две вещи, которые вы можете сделать с ElixirChat JS SDK:
1. [Добавить полностью готовый виджет Elixirchat (на картинке сверху) на ваш сайт](#add-default-widget), просто написав несколько строк кода. Внешний вид виджета настраивается с помощью CSS.
2. [Создать свой кастомный виджет](#create-custom-widget), который будет коммуницировать с вашей админ-панелью ElixirChat через Elixirchat JS SDK.

<br/>

## Примеры

| <img src="https://user-images.githubusercontent.com/1618344/61660053-b36e3f80-acd1-11e9-8f0d-79a8be0c2597.png" alt="Демо виджета ElixirChat" width="100%"/> | <img src="https://user-images.githubusercontent.com/1618344/61660172-f29c9080-acd1-11e9-84e4-9048d0d785f6.png" alt="Демо ElixirChat JS SDK" width="100%"/> |
| --- |--- |
| __Полностью готовый виджет Elixirchat__<br> Настроен с помощью CSS<br> [Как добавить?](#add-default-widget) | __Простой кастомный виджет__<br> Написан на чистом JS с нуля<br> [Как создать?](#create-custom-widget) |
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

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'https://elixirchat.yoursite.com/api', // API URL вашего ElixirChat
  socketUrl: 'wss://elixirchat.yoursite.com/socket', // websocket URL вашего ElixirChat 
  companyId: 'your-company-id-here', // вы получите companyId от команды ElixirChat
  
  // Также можете добавить здесь опциональные параметры "room" и "client"
  // Прокрутите вниз до "ElixirChat-конфиг" для подробностей

  debug: true // для подробного вывода в консоль
});
elixirChatWidget.appendWidget({
  container: document.body, // куда присоединить виджет
  iframeStyles: `.elixirchat-chat-container { color: green }`, // ваш кастомный CSS внутри iframe чата
});
```

### б) Через тег `<script>`:
Скачайте [`/build/sdk.min.js`](https://github.com/elixirchat/elixirchat-widget/blob/master/build/sdk.min.js) и [`/build/default-widget.min.js`](https://github.com/elixirchat/elixirchat-widget/blob/master/build/default-widget.min.js) из этого репозитория, а затем включите этот фрагмент в ваш HTML-код:

```html
<script src="[YOUR_PATH]/sdk.min.js"></script>
<script src="[YOUR_PATH]/default-widget.min.js"></script>
<script>
  const elixirChatWidget = new ElixirChatWidget({
    apiUrl: 'https://elixirchat.yoursite.com/api', // API URL вашего ElixirChat
    socketUrl: 'wss://elixirchat.yoursite.com/socket', // websocket URL вашего ElixirChat 
    companyId: 'your-company-id-here', // вы получите companyId от команды ElixirChat
    
    // Также можете добавить здесь опциональные параметры "room" и "client"
    // Прокрутите вниз до "ElixirChat-конфиг" для подробностей

    debug: true // для подробного вывода в консоль
  });
  elixirChatWidget.appendWidget({
    container: document.body, // куда присоединить виджет
    iframeStyles: `.elixirchat-chat-container { color: green }`, // ваш кастомный CSS внутри iframe чата
  });
</script>
```

<br/>
<a id="create-custom-widget"></a>

## 2. Как создать свой кастомный виджет

> _Посмотрите пример [/build/examples/sdk.html](https://github.com/elixirchat/elixirchat-widget/blob/master/build/examples/sdk.html)_

#### Установка:
```bash
npm i elixirchat --save
```
либо включите [`/build/sdk.min.js`](https://github.com/elixirchat/elixirchat-widget/blob/master/build/sdk.min.js) через тег `<script>` в ваш HTML-код

```html
<script src="[YOUR_PATH]/sdk.min.js"></script>
```

#### Код:
```js
import ElixirChat from 'elixirchat';
// Либо, если используете тег `<script>`, то объект `ElixirChat` будет добавлен в window.

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'https://elixirchat.yoursite.com/api', // API URL вашего ElixirChat
  socketUrl: 'wss://elixirchat.yoursite.com/socket', // websocket URL вашего ElixirChat 
  companyId: 'your-company-id-here', // вы получите companyId от команды ElixirChat
  
  // Также можете добавить здесь опциональные параметры "room" и "client"
  // Прокрутите вниз до "ElixirChat-конфиг" для подробностей

  debug: true // для подробного вывода в консоль
});


document.querySelector('#send-message-button').addEventListener('click', () => {
  // Отправить новое сообщение
  elixirChat.sendMessage({
    text: document.querySelector('textarea').value, // текст нового сообщения
    attachments: document.querySelector('input[type=file]').files, // прикрепленные файлы
    responseToMessageId: '440b-b439-831d292a9730', // ID сообщения, на которое вы отвечаете (если есть)
  })
  .then(newMessage => console.log(newMessage));
});


// Подписаться на новые сообщения в комнате
elixirChat.onMessage((message) => {
  console.log('Новое сообщение:', message.text);
  console.log('От:', message.sender.firstName, message.sender.lastName);
  console.log('Это ответ на:', message.responseToMessage ? message.responseToMessage.text : '—');
});

// Загрузить последние сообщения в истории переписки
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

// Сделать скриншот экрана вашего клиента
document.querySelector('#screenshot-button').addEventListener('click', () => {
  elixirChat.takeScreenshot().then(screenshot => {
  	document.querySelector('img#preview').src = screenshot.dataUrl; // показать превью скриншота

    // Отправить скриншот как вложение
    elixirChat.sendMessage({
      attachments: [ screenshot.file ] // screenshot.file это инстанс `File()`
    });
  });
});

// Смотрите раширенный пример в /build/examples/sdk.html
```

<br/>
<a id="docs"></a>

# Документация

<br/>
<a id="what-are-rooms"></a>

## Прежде чем начать: что такое комнаты?

<img src="https://user-images.githubusercontent.com/1618344/61772574-49ea5000-adfb-11e9-9bc7-0d6a89146107.png" alt="Комнаты ElixirChat"/>

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
  apiUrl: 'https://elixirchat.yoursite.com/api',
  socketUrl: 'wss://elixirchat.yoursite.com/socket', 
  companyId: 'ваш-company-id',
  
  room: {
    id: 'ваш-room-id',
    title: 'Название комнаты, которое будет видно в админке (слева)',
    data: {
      custom_field_1: 'Опциональное кастомное поле, которое будет видно в админке (справа)',
      custom_field_2: 'Другое опциональное кастомное поле, которое будет видно в админке (справа)',
    }
  },
  client: {
    id: 'любое-ваше-собственное-id-для-идентификации-клиента',
    firstName: 'Можно передать имя клиента тут (отобразится в вдминке)',
    lastName: 'Можно передать фамилию клиента тут (отобразится в вдминке)',
  },
  debug: true,
})
```

<br/>
<a id="config-apiUrl"></a>

#### `apiUrl: string`
GraphQL URL вашего бэкэнда ElixirChat (например, `https://elixirchat.yourcompany.com/api`)


<br/>
<a id="config-socketUrl"></a>

#### `socketUrl: string`
WebSocket URL вашего бэкэнда ElixirChat, начинающийся с протокола `ws:`/`wss:` (например, `wss://elixirchat.yourcompany.com/socket`)


<br/>
<a id="config-companyId"></a>

#### `companyId: string`
ID вашей компании. Вы получите его от команды ElixirChat.

<br/>
<a id="config-room"></a>

#### `room: { id, title, data }` (опционально)
Задайте опцию `room`, если вам нужна [публичная комната](#public-room). Как это работает:

- Когда вы передаете `room` _в первый раз_, ElixirChat JS SDK _создает новую_ [публичную комнату](#public-room) (в переданным `id` и `title`).
- Когда вы _снова_ инициализируете ElixirChat JS SDK с тем же `room.id`, SDK _подключается к той же самой комнате_, которая была ранее создана с этим `id`.
- Если вы не передаете `room` вообще, то новая [приватная комната](#private-room) будет создаваться для каждого _уникального_ посетителя.

__Параметры:__

- `room.id: string` — Произвольная строка, используемая для идентификации комнаты.
- `room.title: string` — Название вашей публичной комнаты, которое отображается [в админ-панели ElixirChat (слева)](#what-are-rooms). `room.title` можно менять в любое время — эти изменения будут сразу отражены в админ-панели.
- `room.data: object` — Объект с кастомными полями вашей комнаты, которые будут отображены в админ-панели справа (см. поля "Доступ", "Последнее действие" или "API" [на скриншоте выше](#what-are-rooms)). Кастомные поля разные для каждой комнаты. Чтобы включить их в админке, свяжитесь с командой ElixirChat.

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

#### `debug: boolean` `(по-умолчанию false)` (опционально)
Включает подробный вывод в консоль от ElixirChat JS SDK

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

- `text: string (опционально)` - текст сообщения
- `attachments: Array<File> (опционально)` - список вложений в [формате File()](https://developer.mozilla.org/en-US/docs/Web/API/File/File)
- `responseToMessageId: string (опционально)` - ID сообщения, на которое отвечает пользователь (если есть)

__Возвращает: `Promise()`__, у которого коллбэк в `then` имеет такие аргументы:

- `message` - Ваше сообщение, которое было только что отправлено (в [формате, описанном ниже](#onMessage-message)).

```js
// Пример:
elixirChat.sendMessage({
  text: 'my message text',
  attachments: document.querySelector('input[type=file]').files,
  responseToMessageId: '6ac8ce92-3a31-440b-b439',
})
.then(yourMessage => console.log(yourMessage));
```

<br/>
<a id="onMessage"></a>

#### `onMessage((message) => { ... })`
Подписаться на новые сообщения в комнате.

__Аргументы:__

- `callback: function` - Функция, которая выполняется при получении нового сообщения.

__Аргументы коллбэка:__

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
    console.log('Вы отправили сообщение ', message.text);
  }
  else {
    console.log('Новое сообщение от ', message.sender.isAgent ? 'оператора' : 'клиента');
    console.log(message.text);
  }
  if (message.responseToMessage) {
    console.log('Это ответ на ', message.responseToMessage.text);
  }
});
```


<br/>
<a id="fetchMessageHistory"></a>

#### `fetchMessageHistory(limit, firstMessageCursor)`
Получить массив сообщений из истории сообщений.

- Длина массива задается аргументом `limit`.
- Если `firstMessageCursor` не передан, то массив содержит последние сообщения.
- В противном случае, если `firstMessageCursor` задан, то массив будет содержать сообщения, хронологически идущие _до_ сообщения с [`cursor`](#onMessage-cursor), равным `firstMessageCursor`.

__Аргументы:__

- `limit: number` - Длина массива возвращенных сообщений
- `firstMessageCursor: string (опционально)` - поле [`cursor`](#onMessage-cursor) сообщения, _до_ которого вы хотите запросить сообщения. Если не задано, то будут запрошены последние сообщения.

__Возвращает: `Promise()`__, у которого коллбэк в `then` имеет такие аргументы:

- `messages: array` - массив сообщений в [формате, описанном выше](#onMessage-message)

```js
// Пример:
let messageStorage = [];

// Получить 10 последних сообщений
elixirChat.fetchMessageHistory(10).then(latestMessages => {
  messageStorage = latestMessages;
  console.log('Получил 10 последних сообщений', latestMessages);
});

document.querySelector('button#load-previous-messages').addEventListener('click', e => {
  elixirChat.fetchMessageHistory(10, messageStorage[0].cursor).then(fetchedChunk => {

    // Добавить полученный массив fetchedChunk в начало массива всех сообщений (messageStorage)
    messageStorage = fetchedChunk.concat(messageStorage);

    // Сделать неактивной кнопку "Загрузить предыдущие сообщения", когда вся история уже загружена
    if (elixirChat.reachedBeginningOfMessageHistory) {
      e.target.innerText = 'Все сообщения уже загружены';
      e.target.disabled = true;
    }
  });
});
```



<br/>
<a id="onTyping"></a>

#### `onTyping((peopleWhoAreTyping) => { ... })`
Подписаться на событие, которое срабатывает, когда другие участники начинают или заканчивают набирать текст в текущей комнате.

__Аргументы:__

- `callback: function` - Функция, которая запускается, когда другие участники начинают или заканчивают набирать текст в текущей комнате.

__Аргументы коллбэка:__

- `peopleWhoAreTyping: Array<{user}>` - Массив с пользователями, которые в настоящее время набирают текст в этой комнате. Если массив пуст, то значит, другие участники сейчас ничего не печатают.

    - `{user}.id` - ID печатающего пользователя
    - `{user}.firstName` - имя печатающего пользователя
    - `{user}.lastName` - фамилия печатающего пользователя

```js
// Пример:
elixirChat.onTyping((peopleWhoAreTyping) => {
  if (peopleWhoAreTyping.length) {
    document.querySelector('#typing').innerHTML = '${peopleWhoAreTyping.map(person => person.firstName).join(', ')} печатают...';
  }
  else {
    document.querySelector('#typing').innerHTML = 'Никто не печатает';
  }
});
```

<br/>
<a id="dispatchTypedText"></a>

#### `dispatchTypedText(typedText)`

Передать текст, набранный клиентом, в админ-панель ElixirChat. Этот метод _не отправляет сообщение_, а только сообщает, что текущий клиент набрал определенный текст. Это будет отображаться в статусе "печатает ..." в админ-панели ElixirChat.

__Аргументы:__

- `typedText: string` - текст, набранный клиентом, _ИЛИ_ _false_, в случае если клиент отправил сообщение

```js
// Пример:
document.querySelector('textarea#message').addEventListener('keyup', (e) => {
  elixirChat.dispatchTypedText(e.target.value);
});

document.querySelector('button#submit').addEventListener('click', (e) => {
  elixirChat.dispatchTypedText(false);
});
```


<br/>
<a id="takeScreenshot"></a>

#### `takeScreenshot()`
Сделать скриншот экрана клиента. При этом откроется [стандартное окно браузера с просьбой расшарить экран пользователя](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture#Capturing_screen_contents).


__Возвращает: `Promise()`__, у которого коллбэк в `then` имеет такие аргументы:

- `screenshot: object`:
  - `screenshot.dataUrl: string` - data URL скриншота (в формате PNG), закодированный в base64
  - `screenshot.file: File` - инстанс [`File()`](https://developer.mozilla.org/en-US/docs/Web/API/File) скриншота (в формате PNG)

```js
// Пример:
elixirChat.takeScreenshot().then(screenshot => {
  // Показать превью
  document.querySelector('img#preview').src = screenshot.dataUrl;

  // Отправить в админ-панель ElixirChat в виде вложения
  elixirchat.sendMessage({ attachments: [ screenshot.file ] });
})
.catch(e => alert(e.message));
```

<br/>
<a id="reconnect"></a>

#### `reconnect({`[`room`](#config-room)`,`[`client`](#config-client)`})`
Изменить `room` или `client` (или и то, и другое) _после_ того, как ElixirChat или ElixirChatWidget уже был инициализирован.

- Если передать только `room`, то SDK переподключит к новой комнате, но с теми же данными клиента.
- Если передать только `client`, то SDK переподключит к той же самой комнате, но с новыми данными клиента.
    - _НО_, если вы изначально были подключены к [приватной комнате](#private-room) (т.е. без передачи ID комнаты в самом начале), и вы передали только `client`, вы будете переподключены к _новой_ приватной комнате.

__Параметры аргумента {...}:__

- `room: object (опционально)` - тот же формат, что и [`room` в конфиге](#config-room)
- `client: object (опционально)` - тот же формат, что и [`client` в конфиге](#config-client)

__Возвращает: `Promise()`__

```js
// Пример 1: поменять и `room`, и `client`
elixirChat.reconnect({
  room: {
    id: 'new-room-id',
    title: 'My new room title', // или просто не передавайте `title`, чтобы сохранить его прежним в админке
  },
  client: {
    id: MyApp.currentUser.id,
    firstName: MyApp.currentUser.full_name.split(' ')[0],
    lastName: MyApp.currentUser.full_name.split(' ')[1],
  },
}).then(status => console.log(status));

// Пример 2: поменять только `client`, и оставить ту же `room` (кроме случая, когда комната была приватной)
elixirChat.reconnect({
  client: {
    id: MyApp.currentUser.id,
    firstName: MyApp.currentUser.full_name.split(' ')[0],
    lastName: MyApp.currentUser.full_name.split(' ')[1],
  },
});

// Пример 3: поменять `room`, но оставить то же в `client`
elixirChat.reconnect({
  room: {
    id: 'new-room-id',
    title: 'My new room title', // или просто не передавайте `title`, чтобы сохранить его прежним в админке
  },
});
```

<br/>
<a id="onConnectSuccess"></a>

#### `onConnectSuccess(() => { ... })`
Подписаться на событие, которое срабатывает после установления успешного подключения к комнате. Это происходит либо после изначальной инициализации SDK, либо после вызова метода [`reconnect()`](#reconnect).

__Аргументы:__

- `callback: function` - Функция, которая выполняется после установления успешного подключения к комнате.

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
Подписаться на событие, которое срабатывает, если подключение к комнате не удалось. Это может произойти либо после изначальной инициализации SDK, либо после вызова метода [`reconnect()`](#reconnect).

__Аргументы:__

- `callback: function` - Функция, которая срабатывает при сбое подключения к комнате.

```js
elixirChat.onConnectError((error) => {
  console.log('Не удалось подключиться к комнате', error);
});
```

<br/>
<a id="sdk-properties"></a>

### Свойства ElixirChat:

- <a id="sdk-apiUrl"></a>`apiUrl: string` - То же, что было в [конфиге](#config-apiUrl)
- <a id="sdk-socketUrl"></a>`socketUrl: string` - То же, что было в [конфиге](#config-socketUrl)
- <a id="sdk-companyId"></a>`companyId: string` - То же, что было в [конфиге](#config-companyId)
- <a id="sdk-room"></a>`room: object` - То же, что было в [конфиге](#config-room)
- <a id="sdk-client"></a>`client: object` - То же, что было в [конфиге](#config-client)
- <a id="sdk-debug"></a>`debug: boolean` - То же, что было в [конфиге](#config-debug)
- <a id="sdk-elixirChatRoomId"></a>`elixirChatRoomId: string` - ID текущей комнаты, сгенерированный бэкэндом ElixirChat (это _НЕ_ [`room.id`](#config-room) в конфиге)
- <a id="sdk-elixirChatClientId"></a>`elixirChatClientId: string` - ID текущего клиента, сгенерированный бэкэндом ElixirChat (это _НЕ_ [`client.id`](#config-client) в конфиге)
- <a id="sdk-authToken"></a>`authToken: string` - токен, сгенерированный бэкэндом ElixirChat после успешного подключения к комнате
- <a id="sdk-connected"></a>`connected: boolean` - _true_, если SDK в настоящее время подключен к комнате
- <a id="sdk-reachedBeginningOfMessageHistory"></a>`reachedBeginningOfMessageHistory: boolean` - _true_, если самые ранние сообщения в истории были запрошены через [`fetchMessageHistory()`](#fetchMessageHistory) (то есть пользователь прокручивал в самое начало истории переписки в комнате, а метод [`fetchMessageHistory()`](#fetchMessageHistory) запрашивал сообщения последовательными частями, и в итоге достиг начала истории)

```js
// Примеры:
document.querySelector('button#load-previous-messages').addEventListener('click', e => {
  elixirChat.fetchMessageHistory(5, messages[0].cursor).then(history => {
    messages = [...history, ...messages];

    // Сделать неактивной кнопку "Загрузить предыдущие сообщения", когда вся история уже загружена
    if (elixirChat.reachedBeginningOfMessageHistory) {
      e.target.innerText = 'Все сообщения загружены';
      e.target.disabled = true;
    }
  });
});

if (elixirChat.connected) {
  document.getElementById('status').className = 'active';
}

elixirChat.onConnectSuccess(() => {
  document.getElementById('status').className = 'active';
  console.log('Подключен к ', elixirChat.room, elixirChat.elixirChatRoomId);
});
```


<br/>
<a id="widget"></a>

## ElixirChatWidget API

В ElixirChatWidget есть еще несколько методов и свойств в дополнение к методам ElixirChat.

<br/>

### Методы ElixirChatWidget:

<a id="widget-toggleChatVisibility"></a>
#### `toggleChatVisibility()`
Программно показать или скрыть окно чата виджета.

```js
// Пример:
elixirChatWidget.toggleChatVisibility();
console.log('Окно чата теперь ', elixirChatWidget.widgetIsVisible ? 'открыто' : 'закрыто');
```

<br/>
<a id="widget-onToggleChatVisibility"></a>

#### `onToggleChatVisibility(callback)`
Подписаться на событие открытия/закрытия окна чата виджета.

__Аргументы:__

- `callback: function` - функция, которая выполняется каждый раз, когда окно чата открывается или закрывается

```js
// Пример:
elixirChatWidget.onToggleChatVisibility((isVisible) => {
  console.log('Окно чата теперь ', isVisible ? 'открыто' : 'закрыто');
});
```

<br/>
<a id="widget-appendWidget"></a>

#### `appendWidget({ container, visibleByDefault, iframeStyles })`
Присоединить виджет ElixirChat в DOM-контейнер, при необходимости кастомизировать с помощью CSS.

__Параметры аргумента {...}:__

- `container: HTMLElement` - Элемент DOM, в конец которого будет присоединен виджет.
- `visibleByDefault: boolean` `(по-умолчанию false)` - если _true_, то виджет будет открыт по умолчанию.
- `iframeStyles: string` - Ваш кастомный CSS-код, примененный к виджету ElixirChat _внутри iframe_, так чтобы можно было легко изменить внешний вид окна чата.


__Возвращает:__

- `JSX.Element` - React-компонент виджета (отрендеренный внутри `<iframe>`)


```js
// Пример:
elixirChatWidget.appendWidget({
  container: document.body,
  iframeStyles: `
    .elixirchat-chat-container { background: #eeeeee }
    .elixirchat-chat-messages__item { background: #53B561 } 
  `,
});
```

<br/>

### Свойства ElixirChatWidget:

- <a id="widget-container"></a>`container: HTMLElement` - То же, что передано в [`appendWidget()`](#widget-appendWidget)
- <a id="widget-iframeStyles"></a>`iframeStyles: string` - То же, что передано в [`appendWidget()`](#widget-appendWidget)
- <a id="widget-visibleByDefault"></a>`visibleByDefault: boolean` - То же, что передано в [`appendWidget()`](#widget-appendWidget)
- <a id="widget-widgetIsVisible"></a>`widgetIsVisible: boolean` - Флаг, указывающий, открыто ли в данный момент окно чата
- <a id="widget-widgetChatIframe"></a>`widgetChatIframe: HTMLIFrameElement` - IFrame-элемент окна чата
- <a id="widget-widgetChatReactComponent"></a>`widgetChatReactComponent: JSX.Element` - React-компонент виджета (отрендеренный внутри `<iframe>`)
- <a id="widget-widgetButton"></a>`widgetButton: HTMLElement` - Элемент кнопки активации виджета (отрендеренный вне элемента IFrame)



```js
// Примеры:
console.log('state React-компонента виджета:', elixirChatWidget.widgetChatReactComponent.state);

elixirChatWidget.widgetChatIframe.style = 'width: 300px';

if (elixirChatWidget.widgetIsVisible) {
  document.getElementById('my-app-column').className = 'shrinked';
}
```

<br/>
<a id="developers"></a>

## Для разработчиков

Если вы хотите развернуть ElixirChat JS SDK и виджет как разработчик:

```bash
# Клонировать репозиторий и установить зависимости
git clone git@github.com:elixirchat/elixirchat-widget.git
npm install

# Запустить dev-версию на http://localhost:8001/
npm run dev

# Скомпилировать `build/sdk.min.js` и `build/default-widget.min.js` из вашего текущего кода
npm run build

# Запустить SDK и примеры виджетов на http://localhost:8002
npm run examples

# Задеплоить SDK и примеры виджетов на surge.sh (URL деплоя указан в `build/CNAME`)
npm run examples-deploy
```
