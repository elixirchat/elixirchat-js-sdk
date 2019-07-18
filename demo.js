import ElixirChat from './src'

const elixirChat = new ElixirChat({
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

let messages = [];
let attachments = [];
let screenshot = null;
let replyTo = null;

elixirChat.onConnectSuccess(() => {
  elixirChat.fetchMessageHistory(5).then(history => {
    messages = history;
    renderMessages(messages, true);
  });
  document.getElementById('room').innerHTML = `<b>Room:</b> ${elixirChat.room.title} (ID: ${elixirChat.room.id})`;
  document.getElementById('client').innerHTML = `<b>Client:</b> ${elixirChat.client.firstName} ${elixirChat.client.lastName} (ID: ${elixirChat.client.id})`;
});

elixirChat.onMessage(message => {
  messages.push(message);
  renderMessages(messages, true);
});

elixirChat.onTyping(users => {
  document.getElementById('typing').innerText = users.length ? users.length + ' user(s) typing...' : 'Nobody is currently typing';
});

function takeScreenshot(e){
  elixirChat.takeScreenshot().then(result => {
    screenshot = result.file;
    document.getElementById('screenshot-preview').src = result.dataUrl;
    e.target.disabled = true;
    e.target.innerText = '✔ Screenshot taken';
  }).catch(e => { alert(e.message); });
}

function onTextareaKeyup(e){
  if (e.which === 13 /* "Enter" key */) {
    sendMessage(e.target.value);
    e.target.value = '';
  }
  elixirChat.dispatchTypedText(e.target.value);
}

function sendMessage(text){
  if (text) {
    elixirChat.sendMessage({
      text: text,
      attachments: [screenshot, ...document.querySelector('input[type=file]').files],
      responseToMessageId: replyTo,
    });
    reset();
  }
}

function loadPreviousMessages(){
  elixirChat.fetchMessageHistory(5, messages[0].cursor).then(history => {
    messages = [...history, ...messages];
    renderMessages(messages);
  });
}

function replyToMessage(messageId) {
  replyTo = messageId;
  document.querySelectorAll('#messages li').forEach(li => li.style.border = '');
  if (messageId) {
    document.getElementById(messageId).style.border = '1px solid blue';
    document.getElementsByTagName('textarea')[0].focus();
  }
}

function renderMessages(messages, shouldScrollDown = false){
  const template = document.getElementById('message-template');
  const container = document.getElementById('messages');
  container.querySelectorAll('li').forEach(li => li.remove());
  messages.forEach(message => {
    const clone = document.importNode(template.content, true);
    const responseToMessage = (message.data && message.data.responseToMessage) || message.responseToMessage || {};
    clone.querySelector('li').id = message.id;
    clone.querySelector('blockquote').textContent = responseToMessage.text ? 'Reply to “' + responseToMessage.text.trim() + '”' : '';
    clone.querySelector('b').textContent = message.sender.firstName + ' ' + message.sender.lastName;
    clone.querySelector('div').textContent = message.text;
    clone.querySelector('button').onclick = () => replyToMessage(message.id);
    container.appendChild(clone);
  });
  if (shouldScrollDown) {
    container.scrollTop = container.scrollHeight;
  }
}

function reset(){
  attachments = [];
  screenshot = null;
  replyToMessage(null);
  document.querySelector('input[type=file]').value = '';
  document.getElementById('screenshot-preview').src = '';
  document.getElementById('screenshot').disabled = false;
  document.getElementById('screenshot').innerText = 'Take screenshot';
}







// TODO: remove after inserting min.js SDK version
window.sendMessage = sendMessage;
window.onTextareaKeyup = onTextareaKeyup;
window.loadPreviousMessages = loadPreviousMessages;
window.renderMessages = renderMessages;
window.replyToMessage = replyToMessage;
window.takeScreenshot = takeScreenshot;
window.reset = reset;

// TODO: remove after inserting min.js SDK version
window.messages = messages;
window.attachments = attachments;
window.screenshot = screenshot;
window.replyTo = replyTo;
window.elixirChat = elixirChat;
