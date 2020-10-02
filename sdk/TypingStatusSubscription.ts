import * as Phoenix from 'phoenix';
import { ElixirChat } from './ElixirChat';
import { IGraphQLClientSocketConfig } from './GraphQLClientSocket';
import {
  TYPING_STATUS_CHANGE,
  TYPING_STATUS_SUBSCRIBE_SUCCESS,
  TYPING_STATUS_SUBSCRIBE_ERROR,
} from './ElixirChatEventTypes';

export interface ITypingUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: {
    url: string;
  }
}

export class TypingStatusSubscription {

  public url: string;
  public token?: string;
  public elixirChat: ElixirChat;

  protected phoenixSocket: any;
  protected channel: any;
  protected currentlyTypingUsers: Array<ITypingUser> = [];
  protected typingTimeouts: any = {};
  protected typedText: string = '';

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public initialize = ({ url, token }: IGraphQLClientSocketConfig) => {
    this.url = url;
    this.token = token;
  };

  public subscribe = () => {
    const { triggerEvent, logError } = this.elixirChat;

    this.phoenixSocket = new Phoenix.Socket(this.url, {
      params: {
        token: this.token,
      }
    });
    this.phoenixSocket.onError(error => {
      const message = 'TypingStatusSubscription: Failed to subscribe: could not open connection via Phoenix.Socket';
      logError(message, error);
      triggerEvent(TYPING_STATUS_SUBSCRIBE_ERROR, error);
    });

    this.phoenixSocket.onOpen(() => {
      this.joinChannel();
    });
    this.phoenixSocket.connect();
  };

  public dispatchTypedText = (typedText: string | false, dispatchForcefully: boolean = false): void => {
    if (this.channel) {
      const text = typeof typedText === 'string' ? typedText.trim() : '';
      const typing = Boolean(text);

      if (this.typedText !== text || dispatchForcefully) {
        this.typedText = text;
        this.channel.push('typing', { typing, text });
      }
    }
  };

  protected joinChannel(): void {
    const { triggerEvent, logError, logInfo, joinRoomData } = this.elixirChat;

    if (this.channel) {
      this.channel.leave();
    }

    this.channel = this.phoenixSocket.channel('public:room:' + joinRoomData.elixirChatRoomId, {});
    this.channel.join()
      .receive('error', error => {
        logError('TypingStatusSubscription: Failed to subscribe: channel received error', error);
        triggerEvent(TYPING_STATUS_SUBSCRIBE_ERROR, error);
      })
      .receive('timeout', () => {
        logError('TypingStatusSubscription: Failed to subscribe: channel received timeout');
        triggerEvent(TYPING_STATUS_SUBSCRIBE_ERROR);
      })
      .receive('ok', (data) => {
        this.channel.on('presence_diff', this.onPresenceDiff);
        this.dispatchTypedText(this.typedText, true);
        logInfo('TypingStatusSubscription: Subscribed', data);
        setTimeout(() => triggerEvent(TYPING_STATUS_SUBSCRIBE_SUCCESS, data));
      })
  };

  protected onPresenceDiff = (diff: any): void => {
    const { joinRoomData } = this.elixirChat;
    let userId;
    let userData;
    let userMeta;

    try {
      userId = Object.keys(diff.joins)[0];
      userData = Object.values(diff.joins)[0];
      userMeta = userData.metas[0];
    }
    catch (e) {}

    if (!userMeta || userId === joinRoomData.elixirChatClientId) {
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

  protected removeFromCurrentlyTypingUsersAfterTimeout(userId): void {
    clearTimeout(this.typingTimeouts[userId]);

    this.typingTimeouts[userId] = setTimeout(() => {
      this.triggerOnChangeEvent(
        this.currentlyTypingUsers.filter(user => user.id !== userId)
      );
    }, 2000);
  };

  protected triggerOnChangeEvent(updatedTypingUsers): void {
    const { triggerEvent } = this.elixirChat;
    if (updatedTypingUsers.length || this.currentlyTypingUsers.length) {
      this.currentlyTypingUsers = updatedTypingUsers;
      triggerEvent(TYPING_STATUS_CHANGE, this.currentlyTypingUsers);
    }
  }

  public unsubscribe = () => {
    const { logInfo } = this.elixirChat;
    logInfo('TypingStatusSubscription: Unsubscribing...');

    this.channel.leave();

    Object.values(this.typingTimeouts).forEach(timeout => clearTimeout(timeout));
    this.currentlyTypingUsers = [];
    this.typingTimeouts = [];
    this.typedText = '';
  };
}
