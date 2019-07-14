import ElixirChat from './src'

window.messages = [];
window.responseToMessageId = null;

function renderMessages(messages){
  document.getElementById('messages').innerHTML = messages.map(message => {
    return `
      <li id="${message.id}">
        <b>${message.sender.firstName}</b>: ${message.text}
        <button onclick="replyToMessage('${message.id}')">Reply</button>
      </li>
    `;
  }).join('');
}


window.replyToMessage = (messageId) => {
  window.responseToMessageId = messageId;
  Array.from(document.querySelectorAll('#messages li')).forEach(el => el.style.background = '');
  if (messageId) {
    document.getElementById(messageId).style.background = 'yellow';
  }
  document.getElementById('#reply-to').innerText = ``
};

window.elixirChat = new ElixirChat({
  apiUrl: 'http://localhost:4000',
  socketUrl: 'ws://localhost:4000/socket',
  companyId: '6ac8ce92-3a31-440b-b439-831d292a9730', // huntflow
  room: {
    id: 'test1',
    title: 'My new room Z'
  },
  client: {
    // id: 'client1',
    // firstName: 'Egor',
    // lastName: 'Vinogradov'
  },
  debug: true,
});

elixirChat.onConnectSuccess(() => {
  elixirChat.fetchMessageHistory(5).then(history => {
    window.messages = history;
    renderMessages(messages);
  });
  document.getElementById('room').innerText = `${elixirChat.room.title} (${elixirChat.room.id})`;
  document.getElementById('client').innerText = `${elixirChat.client.firstName} ${elixirChat.client.lastName} (${elixirChat.client.id})`;
});

elixirChat.onMessage(message => {
  messages.unshift(message);
  renderMessages(messages);
});

elixirChat.onTyping(users => {
  document.querySelector('#typing').innerText = `${users.length} user(s) typing...`
});

document.getElementById('screenshot').addEventListener('click', () => {
  elixirChat.takeScreenshot();
});

document.getElementById('submit').addEventListener('click', () => {
  const textarea = document.getElementById('text');
  elixirChat.sendMessage({
    text: textarea.value,
    responseToMessageId: window.responseToMessageId || undefined,
  });
  textarea.value = '';
  replyToMessage(null);
});

document.getElementById('text').addEventListener('keyup', (e) => {
  elixirChat.dispatchTypedText(e.target.value);
});


document.getElementById('load-more').addEventListener('click', () => {
  const lastMessageCursor = messages[messages.length - 1].cursor;
  elixirChat.fetchMessageHistory(5, lastMessageCursor).then(history => {
    window.messages = [...messages, ...history];
    renderMessages(messages);
  });
});
