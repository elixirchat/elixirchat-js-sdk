import ElixirChatWidget from './widget';

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',

  // TODO: replace company ID w/ default values
  // TODO: backend: populate DB by default values during installation
  companyId: '6ac8ce92-3a31-440b-b439-831d292a9730',
  room: {
    id: 'dev-room-id',
    title: 'Development room title',
    data: {
      custom_field_1: 'Optional custom field value 1',
      custom_field_2: 'Optional custom field value 2',
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
