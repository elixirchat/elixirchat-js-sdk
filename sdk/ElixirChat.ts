import { uniqueNamesGenerator } from 'unique-names-generator';
import {
  logEvent,
  capitalize,
  randomDigitStringId,
  getJSONFromLocalStorage,
} from '../utilsCommon';

import { IMessage } from './serializers/serializeMessage';
import { fragmentUser } from './serializers/serializeUser';
import { IScreenshot, ScreenshotTaker } from './ScreenshotTaker';
import { IUnreadMessagesCounterData, UnreadMessagesCounter } from './UnreadMessagesCounter';
import { TypingStatusSubscription } from './TypingStatusSubscription';
import { OperatorOnlineStatusSubscription } from './OperatorOnlineStatusSubscription';
import { UpdateMessageSubscription } from './UpdateMessageSubscription';
import { ISentMessageSerialized, MessageSubscription } from './MessageSubscription';
import { gql, GraphQLClient, insertGraphQlFragments } from './GraphQLClient';
import {
  JOIN_ROOM_ERROR,
  JOIN_ROOM_SUCCESS,
  LAST_READ_MESSAGE_CHANGE,
  MESSAGES_HISTORY_CHANGE_MANY, UPDATE_MESSAGES_CHANGE,
} from './ElixirChatEventTypes';


export interface IElixirChatRoom {
  id: string;
  title?: string;
}

export interface IElixirChatUser {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface IElixirChatConfig {
  apiUrl: string;
  socketUrl: string;
  companyId: string;
  room?: IElixirChatRoom;
  client?: IElixirChatUser;
  debug?: boolean,
}

export class ElixirChat {

  public version: string = process.env.ELIXIRCHAT_VERSION;

  public apiUrl: string;
  public socketUrl: string;
  public companyId: string;
  public room?: IElixirChatRoom;
  public client?: IElixirChatUser;
  public debug: boolean;

  public isInitialized: boolean = false;
  public elixirChatRoomId: string;
  public elixirChatClientId: string;
  public authToken: string;
  public isConnected: boolean;
  public isPrivate: boolean;

  public widgetMustInitiallyOpen: boolean = false;

  public get areAnyOperatorsOnline(): boolean {
    return this.operatorOnlineStatusSubscription.areAnyOperatorsOnline;
  };
  public get unreadMessagesCount(): number {
    return this.unreadMessagesCounter.unreadMessagesCount;
  }
  public get unreadRepliesCount(): number {
    return this.unreadMessagesCounter.unreadRepliesCount;
  }
  public get messageHistory(): boolean {
    return this.messageSubscription.messageHistory;
  }
  public get hasMessageHistoryBeenEverFetched(): boolean {
    return this.messageSubscription.hasMessageHistoryBeenEverFetched;
  }
  public get reachedBeginningOfMessageHistory(): boolean {
    return this.messageSubscription.reachedBeginningOfMessageHistory;
  }

  protected eventCallbacks: object = {};
  protected graphQLClient: GraphQLClient;
  protected messageSubscription: MessageSubscription;
  protected updateMessageSubscription: UpdateMessageSubscription;
  protected operatorOnlineStatusSubscription: OperatorOnlineStatusSubscription;
  protected typingStatusSubscription: TypingStatusSubscription;
  protected unreadMessagesCounter: UnreadMessagesCounter;
  protected screenshotTaker: ScreenshotTaker;

  protected joinRoomQuery: string = insertGraphQlFragments(gql`
    mutation($companyId: Uuid!, $room: ForeignRoom, $client: ForeignClient!) {
      joinRoom (companyId: $companyId, room: $room, client: $client) {
        token
        company {
          isWorking
          widgetTitle
        }
        client {
          ...fragmentUser
        }
        room {
          id
          title
          foreignId
          mustOpenWidget
        }
      }
    }
  `, { fragmentUser });

  constructor(config: IElixirChatConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.companyId = config.companyId;
    this.debug = config.debug || false;

    if (this.hasAllRequiredConfigParameters()) {
      this.initialize(config);
    }
    if (typeof window !== 'undefined') {
      window.elixirChat = this;
    }
  }

  protected hasAllRequiredConfigParameters(): boolean {
    const requiredParams = ['apiUrl', 'socketUrl', 'companyId'];
    const missingRequiredParams = requiredParams.filter(paramKey => {
      return !this[paramKey];
    });
    if (missingRequiredParams.length) {
      const message = `Required parameters: ${missingRequiredParams.join(', ')} not provided. \nSee more: https://github.com/elixirchat/elixirchat-js-sdk#config`;
      logEvent(this.debug, message, null, 'error');
      return false;
    }
    else {
      return  true;
    }
  };

  protected initialize(config: IElixirChatConfig): void {
    logEvent(this.debug, 'Initializing ElixirChat', {
      apiUrl: this.apiUrl,
      socketUrl: this.socketUrl,
      companyId: this.companyId,
      room: this.room,
      client: this.client,
      debug: this.debug,
    });

    this.isInitialized = true;

    this.on(JOIN_ROOM_SUCCESS, data => {
      logEvent(this.debug, 'Joined room', data);
      const areAnyOperatorsOnline = data?.company?.isWorking;

      this.messageSubscription.subscribe();
      this.updateMessageSubscription.subscribe();
      this.unreadMessagesCounter.subscribe();
      this.typingStatusSubscription.subscribe();
      this.operatorOnlineStatusSubscription.subscribe(areAnyOperatorsOnline);
    });

    this.on(JOIN_ROOM_ERROR, error => {
      logEvent(this.debug, 'Failed to join room', { error }, 'error');
    });

    this.on(LAST_READ_MESSAGE_CHANGE, this.markPrecedingMessagesRead);

    this.setRoomAndClient({ room: config.room, client: config.client });
    this.screenshotTaker = new ScreenshotTaker({ elixirChat: this });
    this.messageSubscription = new MessageSubscription({ elixirChat: this });
    this.updateMessageSubscription = new UpdateMessageSubscription({ elixirChat: this });
    this.unreadMessagesCounter = new UnreadMessagesCounter({ elixirChat: this });
    this.typingStatusSubscription = new TypingStatusSubscription({ elixirChat: this });
    this.operatorOnlineStatusSubscription = new OperatorOnlineStatusSubscription({ elixirChat: this });

    this.on(UPDATE_MESSAGES_CHANGE, updatedMessage => {
      this.messageSubscription.changeMessageBy({ id: updatedMessage.id }, updatedMessage);
    });

    this.joinRoom();
  }

  protected markPrecedingMessagesRead = (lastReadMessageId: string): Array<IMessage> => {
    const messageIds = this.messageHistory.map(message => message.id);
    const lastReadMessageIndex = messageIds.indexOf(lastReadMessageId);
    this.messageHistory.forEach((message, index) => {
      if (lastReadMessageIndex >= index) {
        message.isUnread = false;
      }
    });
    this.triggerEvent(MESSAGES_HISTORY_CHANGE_MANY, this.messageHistory);
  };

  protected setRoomAndClient(data: { room?: IElixirChatRoom, client?: IElixirChatUser }): void {
    let room: any = data.room || {};
    let client: any = data.client || {};

    const localStorageRoom: IElixirChatRoom = getJSONFromLocalStorage('elixirchat-room') || {};
    const localStorageClient: IElixirChatUser = getJSONFromLocalStorage('elixirchat-client') || {};
    const anonymousClientData = this.generateAnonymousClientData();

    const clientId = client.id || localStorageClient.id || anonymousClientData.id;

    let clientFirstName = typeof client.firstName === 'string'
      ? client.firstName
      : localStorageClient.firstName || anonymousClientData.firstName;

    let clientLastName = typeof client.lastName === 'string'
      ? client.lastName
      : localStorageClient.lastName || anonymousClientData.lastName;

    if (!clientFirstName && !clientLastName) {
      clientFirstName = localStorageClient.firstName || anonymousClientData.firstName;
      clientLastName = localStorageClient.lastName || anonymousClientData.lastName;
    }

    this.client = {
      id: clientId.toString(),
      firstName: clientFirstName,
      lastName: clientLastName,
    };

    this.isPrivate = !(room.id || localStorageRoom.id);

    const roomId = room.id || localStorageRoom.id || clientId;
    const roomTitle = room.title || localStorageRoom.title || clientFirstName + ' ' + clientLastName;
    const roomData = room.data || {};
    this.room = {
      id: roomId.toString(),
      title: roomTitle,
      data: roomData,
    };

    localStorage.setItem('elixirchat-room', JSON.stringify(room));
    localStorage.setItem('elixirchat-client', JSON.stringify(client));

    logEvent(this.debug, 'Set room and client values', {
      room: this.room,
      client: this.client,
      isPrivate: this.isPrivate,
    });
  };

  protected generateAnonymousClientData(): IElixirChatUser {
    const baseTitle = uniqueNamesGenerator({ length: 2, separator: ' ', dictionaries: null });
    const [firstName, lastName] = baseTitle.split(' ').map(capitalize);
    const randomFourDigitPostfix = randomDigitStringId(4);
    const uniqueId = baseTitle.replace(' ', '-') + '-' + randomFourDigitPostfix;
    return {
      id: uniqueId,
      firstName,
      lastName,
    };
  }

  protected serializeRoomData(data){
    const serializedData = {};
    for (let key in data) {
      serializedData[key] = data[key].toString();
    }
    return JSON.stringify(serializedData);
  };

  public triggerEvent = (eventName, ...params) => {
    logEvent(this.debug, eventName, { params }, 'event');
    const callbacks = this.eventCallbacks[eventName];
    if (callbacks && callbacks.length) {
      callbacks.forEach(callback => callback(...params));
    }
  };

  public on = (eventName, callback) => {
    if (eventName instanceof Array) {
      eventName.map(singleEventName => this.on(singleEventName, callback));
    }
    else {
      if (!this.eventCallbacks[eventName]) {
        this.eventCallbacks[eventName] = [];
      }
      this.eventCallbacks[eventName].push(callback);
    }
  };

  public off = (eventName, callback) => {
    let callbacks = this.eventCallbacks[eventName];
    if (callbacks && callbacks.length) {
      this.eventCallbacks[eventName] = callbacks.filter(currentCallback => currentCallback !== callback);
    }
  };

  protected joinRoom(): Promise<void> {
    this.graphQLClient = new GraphQLClient({ url: this.apiUrl });

    const query = this.joinRoomQuery;
    const variables = {
      companyId: this.companyId,
      client: this.client,
      room: {
        id: this.room.id,
        title: this.room.title,
        data: this.serializeRoomData(this.room.data)
      },
    };

    return this.graphQLClient.query(query, variables)
      .then(({ joinRoom }: any) => {
        if (joinRoom) {
          this.isConnected = true;
          this.authToken = joinRoom.token;
          this.widgetMustInitiallyOpen = joinRoom.room.mustOpenWidget;
          this.elixirChatClientId = joinRoom.client.id;
          this.elixirChatRoomId = joinRoom.room.id;
          this.triggerEvent(JOIN_ROOM_SUCCESS, joinRoom);
        }
        else {
          this.triggerEvent(JOIN_ROOM_ERROR, joinRoom);
        }
      }).catch((response) => {
        this.triggerEvent(JOIN_ROOM_ERROR, response);
    });
  }

  public sendMessage = (params: ISentMessageSerialized): Promise<IMessage> => {
    if (!this.isConnected) {
      return this.showDisconnectedError(true);
    }
    this.typingStatusSubscription.dispatchTypedText(false);
    return this.messageSubscription.sendMessage(params);
  };

  public retrySendMessage = (message: IMessage): Promise<IMessage> => {
    if (!this.isConnected) {
      return this.showDisconnectedError(true);
    }
    return this.messageSubscription.retrySendMessage(message);
  };

  public fetchMessageHistory = (limit: number): Promise<[IMessage]> => {
    if (!this.isConnected) {
      return this.showDisconnectedError(true);
    }
    return this.messageSubscription.fetchMessageHistory(limit);
  };

  public fetchPrecedingMessageHistory = (limit: number): Promise<[IMessage]> => {
    if (!this.isConnected) {
      return this.showDisconnectedError(true);
    }
    return this.messageSubscription.fetchPrecedingMessageHistory(limit);
  };

  public dispatchTypedText = (typedText: string): void => {
    if (!this.isConnected) {
      return this.showDisconnectedError();
    }
    this.typingStatusSubscription.dispatchTypedText(typedText);
  };

  public setLastReadMessage = (messageId: string): Promise<IUnreadMessagesCounterData> => {
    if (!this.isConnected) {
      return this.showDisconnectedError(true);
    }
    return this.unreadMessagesCounter.setLastReadMessage(messageId);
  };

  public takeScreenshot = (): Promise<IScreenshot> => {
    return this.screenshotTaker.takeScreenshot();
  };

  public disconnect = (): void => {
    if (!this.isConnected) {
      return this.showDisconnectedError();
    }
    logEvent(this.debug, 'Disconnecting from ElixirChat');
    this.isConnected = false;
    this.messageSubscription.unsubscribe();
    this.updateMessageSubscription.unsubscribe();
    this.unreadMessagesCounter.unsubscribe();
    this.typingStatusSubscription.unsubscribe();
    this.operatorOnlineStatusSubscription.unsubscribe();
  };

  public reconnect = ({ room, client }: { room?: IElixirChatRoom, client?: IElixirChatUser }): Promise<void> => {
    logEvent(this.debug, 'Attempting to reconnect to another room', { room, client });
    this.setRoomAndClient({ room, client });
    this.disconnect();
    return this.joinRoom();
  };

  protected showDisconnectedError(returnPromise): void | Promise<any> {
    const message = 'ElixirChat is not currently connected. Use reconnect() method to connect to another room.';
    logEvent(this.debug, message, null, 'error');
    if (returnPromise) {
      return new Promise((resolve, reject) => {
        reject({ message });
      });
    }
  };
}


if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
