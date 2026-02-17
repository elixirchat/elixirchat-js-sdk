import {ElixirChatWidget} from './widget/ElixirChatWidget';
//
// {
//   "apiUrl": "https://elixir-widget.huntflow.ru/api/",
//   "backendStaticUrl": "https://elixir-widget.huntflow.ru/api/",
//   "socketUrl": "wss://elixir-widget.huntflow.ru/api/socket",
//   "company_id": "02c1b2cb-db4d-4260-8762-768172ace826",
//   "room_id": "e27397ef17ee877e9d964b8dede3ecaf57d705b4e6474aa6e9a30a00bc2c50c6",
//   "client_id": "6c99f050b745e2d634e5be4afbf357ec7fa206dd8968dfb69a6321ee3d05f105"
// }
/**
 * "apiUrl": "https://elixir.huntflow.dev/api/",
 *     "backendStaticUrl": "https://elixir.huntflow.dev/api/",
 *     "socketUrl": "wss://elixir.huntflow.dev/api/socket",
 *     "company_id": "d774c50a-42ff-46ba-8ed6-1904d4485ac4",
 *     "room_id": "fede62c1f3a759f3cef3df03a7540bb61cdb134e5fba9533b92472146455e68a",
 *     "client_id": "55ebec24fd59a2ac38c740c9341fa4004cabfe1b22e68cdbf37f7195f1006949"
 */


const customEmployerName = (sender) => {
  if (sender.isOperator) {
    return 'Служба заботы из Хантфлоу';
  }
  return 'Служба заботы';
};

const elixirChatWidget = new ElixirChatWidget({
  "apiUrl": "https://elixir-widget.huntflow.dev/api/",
  "socketUrl": "wss://elixir-widget.huntflow.dev/api/socket",
  "backendStaticUrl": "https://elixir-widget.huntflow.dev/api/",
  "companyId": "d774c50a-42ff-46ba-8ed6-1904d4485ac4",
  "room": {
    "id": "Um9vbTpiNTM1NDQyMy05NTZkLTQwMmQtYTk1NC0yZThlZjIxMWNjZDY",
    "title": "Huntflow",
    "data": {
      "version": "PROD-7678_filter-vacancy",
      "plan": "Демо",
      "planInfo": "Демо\n16.12.2025 — 06.02.2026",
      "access": "ACTIVE"
    }
  },
  "client": {
    "id": "6c99f050b745e2d634e5be4afbf357ec7fa206dd8968dfb69a6321ee3d05f105",
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
