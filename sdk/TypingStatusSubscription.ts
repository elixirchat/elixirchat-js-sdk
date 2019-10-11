import * as Phoenix from 'phoenix';
import { ElixirChat } from './ElixirChat';
import {
  TYPING_STATUS_CHANGE,
  TYPING_STATUS_SUBSCRIBE,
  TYPING_STATUS_SUBSCRIBE_ERROR,
} from './ElixirChatEventTypes';

import { logEvent } from '../utilsCommon';

export interface ITypingUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: {
    url: string;
  }
}

export class TypingStatusSubscription {

  protected elixirChat: ElixirChat;
  protected phoenixSocket: any;
  protected channel: any;
  protected hasConnectErrorOccurred: boolean = false;
  protected currentlyTypingUsers: Array<ITypingUser> = [];
  protected typingTimeouts: any = {};
  protected typedText: string = '';

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = () => {
    this.initializeSocket(() => {
      this.joinChannel();
    });
  };

  public resubscribe = () => {
    const { triggerEvent, debug } = this.elixirChat;
    if (this.channel) {
      this.channel.leave()
        .receive('ok', () => {
          this.joinChannel();
        })
        .receive('error', error => {
          logEvent(debug, 'Failed to unsubscribe from typing status change: channel received error', error, 'error');
        });
    }
  };

  public dispatchTypedText = (typedText: string | false): void => {
    if (this.channel) {
      const trimmedText = typeof typedText === 'string' ? typedText.trim() : '';

      if (typedText === false) {
        this.channel.push('typing', {
          typing: false,
          text: '',
        });
      }
      else if (this.typedText !== trimmedText) {
        this.channel.push('typing', {
          typing: Boolean(trimmedText),
          text: trimmedText,
        });
        this.typedText = trimmedText;
      }
    }
  };

  protected initializeSocket(callback: () => void = function () {}): void {
    const { triggerEvent, debug, socketUrl, authToken } = this.elixirChat;
    this.phoenixSocket = new Phoenix.Socket(socketUrl, {
      params: {
        token: authToken
      }
    });
    this.phoenixSocket.onError(error => {
      if (!this.hasConnectErrorOccurred) {
        const message = 'Failed to subscribe to typing status change: could not open connection via Phoenix.Socket';
        this.hasConnectErrorOccurred = true;
        logEvent(debug, message, error, 'error');
        triggerEvent(TYPING_STATUS_SUBSCRIBE_ERROR, error);
      }
    });
    this.phoenixSocket.onOpen(callback);
    this.phoenixSocket.connect();
  };

  protected joinChannel(): void {
    const { triggerEvent, debug, elixirChatRoomId } = this.elixirChat;
    const { phoenixSocket } = this;

    this.channel = phoenixSocket.channel('public:room:' + elixirChatRoomId, {});
    this.channel.join()
      .receive('error', error => {
        logEvent(debug, 'Failed to subscribe to typing status change: channel received error', error, 'error');
        triggerEvent(TYPING_STATUS_SUBSCRIBE_ERROR, error);
      })
      .receive('timeout', () => {
        logEvent(debug, 'Failed to subscribe to typing status change: channel received timeout', null, 'error');
        triggerEvent(TYPING_STATUS_SUBSCRIBE_ERROR);
      })
      .receive('ok', (data) => {
        this.channel.on('presence_diff', this.onPresenceDiff);
        logEvent(debug, 'Successfully subscribed to typing status change', data);
        triggerEvent(TYPING_STATUS_SUBSCRIBE, data);
      })
  };

  protected onPresenceDiff(diff: any): void {
    const { elixirChatClientId, triggerEvent, debug } = this.elixirChat;
    let userId;
    let userData;
    let userMeta;

    try {
      userId = Object.keys(diff.joins)[0];
      userData = Object.values(diff.joins)[0];
      userMeta = userData.metas[0];
    }
    catch (e) {}

    if (!userId || !userData || userId === elixirChatClientId) {
      return;
    }

    const currentlyTypingUserIds = this.currentlyTypingUsers.map(user => user.id);
    const userFullName = userData.first_name + ' ' + userData.last_name;
    const serializedUserData: ITypingUser = {
      id: userId,
      firstName: userData.first_name,
      lastName: userData.last_name,
      avatar: {
        url: userData.avatar,
      }
    };

    if (this.typingTimeouts[userId]) {
      clearTimeout(this.typingTimeouts[userId]);
    }

    if (userMeta.typing && !currentlyTypingUserIds.includes(userId)) {
      this.currentlyTypingUsers.push(serializedUserData);
      logEvent(debug, `${userFullName} started typing`, this.currentlyTypingUsers);
      triggerEvent(TYPING_STATUS_CHANGE, this.currentlyTypingUsers);

      this.typingTimeouts[userId] = setTimeout(() => {
        this.currentlyTypingUsers = this.currentlyTypingUsers.filter(user => user.id !== userId);
        logEvent(debug, `${userFullName} stopped typing (no activity within 2 seconds)`, this.currentlyTypingUsers);
        triggerEvent(TYPING_STATUS_CHANGE, this.currentlyTypingUsers);
      }, 2000);
    }
    else if (!userMeta.typing && currentlyTypingUserIds.includes(userId)) {
      this.currentlyTypingUsers = this.currentlyTypingUsers.filter(user => user.id !== userId);
      logEvent(debug, `${userFullName} stopped typing`, this.currentlyTypingUsers);
      triggerEvent(TYPING_STATUS_CHANGE, this.currentlyTypingUsers);
    }
  };
}
