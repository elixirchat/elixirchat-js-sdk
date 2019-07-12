import { ElixirChat } from './src/index'

const textareaElement = document.querySelector('#send-message');
const messagesElement = document.querySelector('#messages');
const typingLabelElement = document.querySelector('#typing-label');
const screenshotButtonElement = document.querySelector('#screenshot');

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');

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


window.__makeScreenshot = (params, callback) => {
  const displayMediaOptions = {
    ...params,
    audio: false,
    cursor: 'never',
    displaySurface: 'browser',
    // resizeMode: 'crop-and-scale',
    resizeMode: 'none',
  };

  let captureStream = null;

  try {
    navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
      .then(captureStream => {
        callback(captureStream);
      })
      .catch(e => {
        window.__e = e;
        console.error('___ fail', e);

      })
  } catch(err) {
    console.error("Error: " + err);
  }
};

// screenshotButtonElement.addEventListener('click', () => {
//   __makeScreenshot({
//
//   }, (captureStream) => {
//     window.__captureStream = captureStream;
//     console.warn('___ got stream', captureStream);
//     window.__captureStream = captureStream;
//     const tracks = captureStream.getTracks();
//     // const [track] = captureStream.getVideoTracks();
//     window.__tracks = tracks;
//
//     video.srcObject = captureStream;
//     video.play();
//
//     setTimeout(() => {
//
//     }, 1000);
//   });
// });


screenshotButtonElement.addEventListener('click', () => {
  elixirChat.takeScreenshot();
});




let width = screen.width;
let height = 0;
let streaming = false;

// video.addEventListener('canplay', function(e){
//   console.log('___ on can play', e);
//
//   if (!streaming) {
//     height = video.videoHeight / (video.videoWidth/width);
//
//     video.setAttribute('width', width);
//     video.setAttribute('height', height);
//     canvas.setAttribute('width', width);
//     canvas.setAttribute('height', height);
//     streaming = true;
//
//     setTimeout(() => {
//       __takePicture();
//     }, 1000);
//   }
// }, false);



window.__takePicture = () => {
  console.log('___ take picture', width, height, {video});
  const context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    console.log('___ get image data', {data, canvas});
    window.__data = data;

    photo.setAttribute('src', data);
    // window.open(data);

    openImage(data);

    console.log('___ data', data);


    __captureStream.getTracks()[0].stop();
    video.setAttribute('height', 0);
    canvas.height = 0;

  }
  else {
    console.error('___ no width on height', width, height);
  }
};


function openImage(data){
  var image = new Image();
  image.src = data;

  var w = window.open("");
  w.document.write(image.outerHTML);
}
