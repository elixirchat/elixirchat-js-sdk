import * as Phoenix from 'phoenix';

const TOKEN = ''; // TODO: add token
const WEBSOCKET_URL = 'ws://localhost:4000/socket';


export function getWebSocketPhoenixClient(){
  const authToken = TOKEN;
  return new Phoenix.Socket(WEBSOCKET_URL, {
    params: {
      token: authToken
    }
  });
}


const noop = () => {}; // TODO: refactor
const handleAPIError = (data) => {
  console.error('handleAPIError', data); // TODO: improve
};


export class TypingStatusSubscription {

  public client = null;
  public channel = null;
  public roomId = null;
  public onConnectSuccess = null;
  public onConnectError = null;
  public onSubscribeSuccess = null;
  public onSubscribeError = null;
  public onStatusChange = null;

  constructor(params){
    this.roomId = params.roomId;
    this.onConnectSuccess = params.onConnectSuccess || noop;
    this.onConnectError = params.onConnectError || noop;
    this.onSubscribeSuccess = params.onSubscribeSuccess || noop;
    this.onSubscribeError = params.onSubscribeError || noop;
    this.onStatusChange = params.onStatusChange || noop;

    this.connect(() => {
      this.joinChannel(this.subscribeStatusChange);
    });
  }

  public connect(callback = noop) {
    this.client = getWebSocketPhoenixClient();

    // TODO: implement lodash once
    const onConnectErrorOnce = (e) => {
      const message = 'Could not open connection via WebSocketPhoenixClient';
      handleAPIError({e: { message }, isGraphQL: false});
      this.onConnectError(e);
    };
    this.client.onError(e => {
      onConnectErrorOnce(e);
    });
    this.client.onOpen(() => {
      this.onConnectSuccess();
      callback();
    });
    this.client.connect();
  };

  public joinChannel(callback = noop) {
    const {
      client,
      roomId,
      onSubscribeError,
      onSubscribeSuccess,
    } = this;
    this.channel = client.channel('admin:room:' + roomId, {});

    this.channel.join()
      .receive('ok', (data) => {
        onSubscribeSuccess(data);
        callback();
      })
      .receive('error', e => {
        handleAPIError({e, methodArguments: [roomId], isGraphQL: false});
        onSubscribeError(e);
      })
      .receive('timeout', () => {
        const message = 'Networking issue: could not join room via WebSocketPhoenixClient';
        handleAPIError({e: { message }, methodArguments: [roomId], isGraphQL: false});
        onSubscribeError();
      });
  };

  public subscribeStatusChange() {
    const eventHandler = state => {
      try {
        const userId = Object.keys(state)[0];
        const status = Object.values(state)[0].metas[0];
        this.onStatusChange({
          isTyping: status.typing,
          text: status.text,
          firstName: status.first_name,
          lastName: status.last_name,
          userId,
        });
      }
      catch (e) {}
    };
    this.channel.on('presence_state', state => eventHandler(state));
    this.channel.on('presence_diff', diff => eventHandler(diff.joins));
  };

  public setStatus(isTyping, typedText) {
    if (this.channel) {
      this.channel.push('typing', {
        typing: isTyping,
        text: typedText,
      });
    }
  };

  public resubscribeToAnotherRoom(roomId, callback = noop) {
    this.unsubscribeFromThisRoom(() => {
      this.roomId = roomId;
      this.joinChannel(() => {
        this.subscribeStatusChange();
        callback();
      });
    });
  };

  public unsubscribeFromThisRoom(callback = noop) {
    this.channel.leave().receive('ok', () => {
      this.roomId = null;
      this.channel = null;
      callback();
    });
  }
}
