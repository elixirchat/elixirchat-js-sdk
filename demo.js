import { ElixirChat } from './src/index'

const textareaElement = document.querySelector('#send-message');
const messagesElement = document.querySelector('#messages');
const typingLabelElement = document.querySelector('#typing-label');

const messages = [{
  text: 'hello',
  sender: {
    firstName: 'John',
    lastName: 'Doe',
  }
}];

messagesElement.innerHTML = messages.map(message => {
  return `
    <li>
      <div><b>${message.sender.firstName} ${message.sender.lastName}</b></div>
      ${message.text}
    </li>
  `;
}).join('\n');

typingLabelElement.innerHTML = 'Nobody is currently typing';

const elixirChat = new ElixirChat({
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


elixirChat.onMessage(message => {
  console.warn('___ on new message', message);
});


window.__sendMessage = (text = 'test message', responseToMessageId = 'TWVzc2FnZTowNGU4NGRlYi04NjA0LTQ4MjAtOGRmNC1jNWNmMjE0YzZiMjQ=') => {
  elixirChat.sendMessage({
    text,
    responseToMessageId,
  }).then(data => console.log('sent message', data));
};

window.__fetchMessageHistory = (from = 0, limit = 3) => {
  elixirChat.fetchMessageHistory(from, limit).then(history => {
    console.warn('___ get messages history', history);
  });
};

window.__elixirChat = elixirChat;
