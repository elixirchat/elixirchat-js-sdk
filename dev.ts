import { ElixirChatWidget } from './widget/ElixirChatWidget';

const elixirChatWidget = new ElixirChatWidget({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: 'd774c50a-42ff-46ba-8ed6-1904d4485ac4',
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
  sentryUrl: 'https://df75ac50adfd495fb3f66b9c0f846fcf@sentry.huntflow.ru/18',
  debug: true,
});

elixirChatWidget.appendWidget({
  container: document.getElementById('elixirchat-widget'),
  mainTitle: 'Служба заботы Хантфлоу',
  chatSubtitle: 'Отвечаем в течение пяти минут',
  supportEmail: 'test@test.com',
  companyLogoUrl: 'https://huntflow.ru/static/b64228c9963307df7ebebf3e77564329/favicons/android-chrome-192x192.png',
  hideDefaultButton: false,
  enabledChannels: [
    'whatsapp',
    'telegram',
    'facebook',
    'vkontakte',
    'viber',
  ],
  fonts: [
    // {
    //   fontFamily: 'Raleway',
    //   fontWeight: 'normal',
    //   // src: [
    //   //   { url: 'https://site.com/test.woff', format: 'woff' },
    //   //   { url: 'https://site.com/test.ttf', format: 'truetype' },
    //   // ]
    // },
    // {
    //   fontFamily: 'Raleway',
    //   fontWeight: 'bold',
    // },
  ],
  iframeCSS: `
    /* Your iframe CSS */
  `,
});
