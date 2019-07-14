import ElixirChatWidget from './widget';

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: '6ac8ce92-3a31-440b-b439-831d292a9730', // huntflow
  room: {
    id: 'test1',
    title: 'My new room Z'
  },
  client: {
    id: 'client1',
    firstName: 'Egor',
    lastName: 'Vinogradov'
  },
  debug: true,
});

elixirChatWidget.onConnectSuccess(() => {
  console.warn('___ connected widget', elixirChatWidget.room, elixirChatWidget.client);
});

elixirChatWidget.appendWidget({
  container: document.getElementById('widget-container'),
  styles: `
    .test {
      background: green;
    }
  `
});
