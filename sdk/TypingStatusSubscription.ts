import * as Phoenix from 'phoenix';
import { ElixirChat } from './ElixirChat';
import {
  TYPING_STATUS_CHANGE,
  TYPING_STATUS_SUBSCRIBE_SUCCESS,
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

  public unsubscribe = () => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from typing status change...');

    this.channel.leave();
    this.phoenixSocket = null;
    this.channel = null;
    this.currentlyTypingUsers = [];
    this.hasConnectErrorOccurred = false;
    Object.values(this.typingTimeouts).forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts = [];
    this.typedText = '';
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

    this.channel = this.phoenixSocket.channel('public:room:' + elixirChatRoomId, {});
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
        triggerEvent(TYPING_STATUS_SUBSCRIBE_SUCCESS, data);
      })
  };

  protected onPresenceDiff = (diff: any): void => {
    const { elixirChatClientId } = this.elixirChat;
    let userId;
    let userData;
    let userMeta;

    try {
      userId = Object.keys(diff.joins)[0];
      userData = Object.values(diff.joins)[0];
      userMeta = userData.metas[0];
    }
    catch (e) {}

    if (!userMeta || userId === elixirChatClientId) {
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

    if (userMeta.typing) {
      this.removeFromCurrentlyTypingUsersAfterTimeout(userId, userFullName);
    }

    if (userMeta.typing && !currentlyTypingUserIds.includes(userId)) {
      this.triggerOnChangeEvent(
        [...this.currentlyTypingUsers, serializedUserData]
      );
    }
    else if (!userMeta.typing && currentlyTypingUserIds.includes(userId)) {
      this.triggerOnChangeEvent(
        this.currentlyTypingUsers.filter(user => user.id !== userId)
      );
    }
  };

  protected removeFromCurrentlyTypingUsersAfterTimeout(userId, userFullName): void {
    clearTimeout(this.typingTimeouts[userId]);

    this.typingTimeouts[userId] = setTimeout(() => {
      this.triggerOnChangeEvent(
        this.currentlyTypingUsers.filter(user => user.id !== userId)
      );
    }, 2000);
  };

  protected triggerOnChangeEvent(updatedTypingUsers): void {
    const { triggerEvent, debug } = this.elixirChat;

    if (updatedTypingUsers.length || this.currentlyTypingUsers.length) {
      const didStopTyping = this.currentlyTypingUsers.length > updatedTypingUsers.length;
      this.currentlyTypingUsers = updatedTypingUsers;

      logEvent(debug, `Some users ${didStopTyping ? 'stopped' : 'started'} typing`, this.currentlyTypingUsers);
      triggerEvent(TYPING_STATUS_CHANGE, this.currentlyTypingUsers);
    }
  }
}
