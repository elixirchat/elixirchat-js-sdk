import { ElixirChatWidget } from './widget/ElixirChatWidget';

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: 'd774c50a-42ff-46ba-8ed6-1904d4485ac4',
  room: {
    id: 'dev-room-id',
    title: 'ElixirChat Dev Widget',
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
    firstName: null,
    lastName: null,
    fullName: 'John Doe',
  },
  debug: true,
});

elixirChatWidget.appendWidget({
  container: document.getElementById('elixirchat-widget'),
  title: 'Служба поддержки',
  logo: 'https://picsum.photos/200',
  supportEmail: 'support@elixir.chat',
  enabledChannels: [
    'whatsapp',
    'telegram',
    'facebook',
    'vkontakte',
    'viber',
  ],
  iframeCSS: `
    /* Custom styles inside the iframe */
  `,
});
