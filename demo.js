import { ElixirChat } from './src/index'

const typingLabelElement = document.querySelector('#typing');
typingLabelElement.innerHTML = 'Nobody is currently typing';

window.messages = [];
window.replyId = null;

window.renderMessages = (messages) => {
  document.getElementById('messages').innerHTML = messages.map(message => {
    return `<li id="${message.id}">
      ${message.sender.firstName}: ${message.text} /
      <u onclick="replyToMessage('${message.id}')">Reply</u>
    </li>`;
  }).join('');
};

window.replyToMessage = (id) => {
  window.replyId = id;
  Array.from(document.querySelectorAll('li')).forEach(el => el.style.background = '');
  if (id) {
    document.getElementById(id).style.background = 'yellow';
  }
};

window.elixirChat = new ElixirChat({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: '6ac8ce92-3a31-440b-b439-831d292a9730', // huntflow
  room: {
    id: 'test1',
    title: 'My new room'
  },
  client: {
    id: 'client1',
    firstName: 'Egor',
    lastName: 'Vinogradov'
  },
  debug: true,
});

elixirChat.onConnectSuccess(() => {
  elixirChat.fetchMessageHistory(5, 'YXJyYXljb25uZWN0aW9uOjY=').then(history => {
    window.messages = history;
    renderMessages(messages);
  });
});

elixirChat.onMessage(message => {
  messages.push(message);
  renderMessages(messages);
});

document.getElementById('screenshot').addEventListener('click', () => {
  elixirChat.takeScreenshot();
});

document.getElementById('submit').addEventListener('click', () => {
  elixirChat.sendMessage({
    text: document.getElementById('text').value,
    responseToMessageId: window.replyId || undefined,
  });
  replyToMessage(null);
});
