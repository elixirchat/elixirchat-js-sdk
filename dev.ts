import ElixirChatWidget from './widget';

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: '26796b48-5c49-45c4-a6a4-860280af8e27',
  room: {
    id: 'dev-room-id',
    title: 'Development room title',
    data: {
      type: 'Internal',
      last_action: 'June 25',
      permission: 'Paid until December 30',
      live_page: 'https://example.com/live/#test-page',
      users: 25,
      api: 2,
      version: '7.11.31',
    }
  },
  client: {
    id: 'dev-client-id',
    firstName: 'Development',
    lastName: 'Client'
  },
  debug: true,
});

elixirChatWidget.appendWidget({
  container: document.getElementById('elixirchat-widget'),
  visibleByDefault: true,
  iframeStyles: `
    /* Your iframe CSS */
  `
});
