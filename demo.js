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


window.__sendMessage = (message = 'test message') => {
  elixirChat.sendMessage({
    text: message,
  }).then(data => console.log('sendMessage', data));
};

window.__elixirChat = elixirChat;



