import * as Phoenix from 'phoenix';

export interface ITypingUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ITypingStatusSubscriptionConfig {
  socketUrl: string;
  token: string;
  roomId: string;
  clientId: string;
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onChange: (currentlyTypingUsers: Array<ITypingUser>) => void;
}

export class TypingStatusSubscription {

  public socketUrl: string;
  public token: string;
  public roomId: string;
  public clientId: string;
  public onSubscribeSuccess: (data: any) => void;
  public onSubscribeError: (data: any) => void;
  public onChange: (currentlyTypingUsers: Array<ITypingUser>) => void;

  protected phoenixSocket: any;
  protected channel: any;
  protected hasConnectErrorOccurred: boolean = false;
  protected currentlyTypingUsers: Array<ITypingUser> = [];
  protected typingTimeouts: any = {};
  protected typedText: string = '';

  constructor(params: ITypingStatusSubscriptionConfig) {
    this.socketUrl = params.socketUrl;
    this.token = params.token;
    this.roomId = params.roomId;
    this.clientId = params.clientId;
    this.onSubscribeSuccess = params.onSubscribeSuccess || function () {};
    this.onSubscribeError = params.onSubscribeError || function () {};
    this.onChange = params.onChange;

    this.connect(() => {
      this.joinChannel(this.subscribeStatusChange);
    });
  }

  protected connect(callback: () => void = function () {}): void {
    this.phoenixSocket = new Phoenix.Socket(this.socketUrl, {
      params: {
        token: this.token
      }
    });
    this.phoenixSocket.onError(error => {
      if (!this.hasConnectErrorOccurred) {
        const message = 'Could not open connection via WebSocketPhoenixClient';
        this.onSubscribeError({ error, message });
        this.hasConnectErrorOccurred = true;
      }
    });
    this.phoenixSocket.onOpen(callback);
    this.phoenixSocket.connect();
  };

  protected joinChannel(callback: () => void = function () {}): void {
    const {
      phoenixSocket,
      roomId,
      onSubscribeError,
      onSubscribeSuccess,
    } = this;

    this.channel = phoenixSocket.channel('public:room:' + roomId, {});
    this.channel.join()
      .receive('ok', (data) => {
        onSubscribeSuccess(data);
        callback();
      })
      .receive('error', error => {
        onSubscribeError({ error, roomId });
      })
      .receive('timeout', () => {
        const message = 'Networking issue: could not join room via WebSocketPhoenixClient';
        onSubscribeError({ error: { message }, roomId });
      });
  };

  public subscribeStatusChange = (): void => {
    this.channel.on('presence_diff', diff => {
      if (diff.joins && Object.values(diff.joins).length) {
        this.onStatusChange(diff.joins)
      }
    });
  };

  protected onStatusChange(state: any): void {
    const userId = Object.keys(state)[0];
    if (userId === this.clientId) {
      return;
    }

    const statusChange = Object.values(state)[0].metas[0];
    const userData: ITypingUser = {
      id: userId,
      firstName: statusChange.first_name,
      lastName: statusChange.last_name,
    };
    const currentlyTypingUserIds = this.currentlyTypingUsers.map(user => user.id);

    if (statusChange.typing) {
      this.debouncedRemoveFromCurrentlyTypingUsers(userId);
    }

    if (statusChange.typing && !currentlyTypingUserIds.includes(userId)) {
      this.currentlyTypingUsers.push(userData);
      this.onChange(this.currentlyTypingUsers);
    }
    else if (!statusChange && currentlyTypingUserIds.includes(userId)) {
      this.currentlyTypingUsers = this.currentlyTypingUsers.filter(user => user.id !== userId);
      this.onChange(this.currentlyTypingUsers);
    }
  }

  protected debouncedRemoveFromCurrentlyTypingUsers(userId: string): void {
    if (this.typingTimeouts[userId]) {
      clearTimeout(this.typingTimeouts[userId]);
    }
    this.typingTimeouts[userId] = setTimeout(() => {
      this.currentlyTypingUsers = this.currentlyTypingUsers.filter(user => user.id !== userId);
      this.onChange(this.currentlyTypingUsers);
    }, 2000);
  }

  public dispatchTypedText = (typedText: string, dispatchForcefully: boolean = false): void => {
    if (this.channel) {
      const trimmedText = typedText.trim();
      if (dispatchForcefully || this.typedText !== trimmedText) {
        this.channel.push('typing', {
          typing: Boolean(trimmedText),
          text: trimmedText,
        });
      }
    }
  };

  public resubscribeToAnotherRoom = (roomId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.unsubscribeFromThisRoom()
        .then(() => {
          this.roomId = roomId;
          this.joinChannel(() => {
            this.subscribeStatusChange();
            resolve();
          });
        })
        .catch(reject);
    });
  };

  public unsubscribeFromThisRoom = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.channel.leave()
        .receive('ok', () => {
          this.roomId = null;
          this.channel = null;
          resolve();
        })
        .receive('error', reject);
    });
  }
}
