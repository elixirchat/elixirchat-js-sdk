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
    "fullName": "Maxim Gladkih",
    "locale": "ru"
  },
  debug: true,
});

elixirChatWidget.appendWidget({
  container: document.getElementById('elixirchat-widget'),
  title: 'Служба поддержки',
  logo: 'https://picsum.photos/200',
  supportEmail: 'support@elixir.chat',
  customEmployerName,
  enabledChannels: [
    'whatsapp',
    'telegram',
    'facebook',
    'vkontakte',
    'viber',
  ],
  iframeCSS: `
      @font-face {
        font-family: 'Graphik';
        src: url('${window.STATIC_URI}fonts/Graphik-Medium.woff2') format('woff2');
        font-weight: 100 900;
        font-style: normal;
      }
      body, input, button, textarea {
        font-family: Graphik, "Helvetica Neue", sans-serif !important;
        font-size: 14px;
        line-height: 20px;
        color: #050505;
      }
      b {
        font-weight: 500;
      }
      .elixirchat-chat-messages__item--by-operator .elixirchat-chat-messages__sender,
      .elixirchat-chat-messages__item--by-another-client .elixirchat-chat-messages__sender {
        color: #22BBD2 !important; /* turquoise */
      }
      .elixirchat-welcome-screen__chat-button {
        background: #22BBD2 !important; /* turquoise */
      }
      .elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__balloon {
        background: #5951BE !important; /* purple */
        padding: 8px 12px 8px 12px;
      }
      .elixirchat-chat-messages__take-screenshot {
        padding: 8px 12px 8px 12px;
        height: auto;
        line-height: 20px;
      }
      .elixirchat-chat-header,
      .elixirchat-chat-messages__date-title,
      .elixirchat-chat-typing {
        font-weight: 500;
        text-transform: none;
      }
      .elixirchat-chat-messages__date-title {
        border-bottom: 1px solid #050505;
        font-size: 14px;
        line-height: 20px;
      }
      .elixirchat-chat-avatar__system0 {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 28 28'%3E%3Cg clip-path='url(%23a)'%3E%3Cg clip-path='url(%23b)'%3E%3Cpath fill='%23f5f5f5' d='M0 14C0 6.268 6.268 0 14 0s14 6.268 14 14-6.268 14-14 14S0 21.732 0 14'/%3E%3Cpath fill='%2325cfe8' d='M14 0C6.268 0 0 6.14 0 13.714v.561c0 7.574 6.268 13.714 14 13.714s14-6.14 14-13.714v-.561C28 6.14 21.732 0 14 0'/%3E%3Cpath fill='%23fff' d='M20.972 6.893h-3.146l-3.613 5.194h-.365l-3.43-5.194H7.15l4.729 7.02-5.115 7.183h3.228l3.775-5.214h.365l3.734 5.214h3.37l-5.115-7.244z'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h28v28H0z'/%3E%3C/clipPath%3E%3CclipPath id='b'%3E%3Cpath fill='%23fff' d='M0 14C0 6.268 6.268 0 14 0s14 6.268 14 14-6.268 14-14 14S0 21.732 0 14'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")!important;
      }
      .elixirchat-chat-messages__item--by-client b {
        color: #5951BE !important;
      }
    `,
});
