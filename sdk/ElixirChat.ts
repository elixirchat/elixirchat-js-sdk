import { uniqueNamesGenerator } from 'unique-names-generator';
import {
  getJSONFromLocalStorage,
  randomDigitStringId,
  capitalize,
  logEvent,
  _get,
} from '../utilsCommon';

import { IMessage } from './serializers/serializeMessage';
import { fragmentClient } from './serializers/serializeUser';
import { ScreenshotTaker, IScreenshot } from './ScreenshotTaker';
import { UnreadMessagesCounter } from './UnreadMessagesCounter';
import { TypingStatusSubscription } from './TypingStatusSubscription';
import { OperatorOnlineStatusSubscription } from './OperatorOnlineStatusSubscription';
import { MessageSubscription, ISentMessageSerialized } from './MessageSubscription';
import { GraphQLClient, insertGraphQlFragments, gql } from './GraphQLClient';
import {
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  MESSAGES_NEW,
  MESSAGES_FETCH_HISTORY,
} from './ElixirChatEventTypes';

export const API_REFERENCE_URL = 'https://github.com/elixirchat/elixirchat-js-sdk';

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
  backendStaticUrl: string;
  companyId: string;
  room?: IElixirChatRoom;
  client?: IElixirChatUser;
  debug?: boolean,
}

export class ElixirChat {
  public apiUrl: string;
  public socketUrl: string;
  public backendStaticUrl: string;
  public companyId: string;
  public room?: IElixirChatRoom;
  public client?: IElixirChatUser;
  public debug: boolean;

  public elixirChatRoomId: string;
  public elixirChatClientId: string;
  public authToken: string;
  public connected: boolean;
  public isPrivate: boolean;
  public messageHistory: Array<IMessage> = [];

  public widgetTitle: string = '';
  public defaultWidgetTitle: string = 'Служба поддержки';

  public get areAnyOperatorsOnline(): boolean {
    return this.operatorOnlineStatusSubscription.areAnyOperatorsOnline;
  };
  public get unreadMessagesCount(): number {
    return this.unreadMessagesCounter.unreadMessagesCount;
  }
  public get unreadRepliesCount(): number {
    return this.unreadMessagesCounter.unreadRepliesCount;
  }
  public get unreadMessages(): Array<IMessage> {
    return this.unreadMessagesCounter.unreadMessages;
  }
  public get unreadReplies(): Array<IMessage> {
    return this.unreadMessagesCounter.unreadReplies;
  }
  public get reachedBeginningOfMessageHistory(): boolean {
    return this.messageSubscription.reachedBeginningOfMessageHistory;
  }

  protected eventCallbacks: object = {};
  protected graphQLClient: GraphQLClient;
  protected messageSubscription: MessageSubscription;
  protected operatorOnlineStatusSubscription: OperatorOnlineStatusSubscription;
  protected typingStatusSubscription: TypingStatusSubscription;
  protected unreadMessagesCounter: UnreadMessagesCounter;
  protected screenshotTaker: ScreenshotTaker;

  protected joinRoomQuery: string = insertGraphQlFragments(gql`
    mutation($companyId: Uuid!, $room: ForeignRoom, $client: ForeignClient) {
      joinRoom (companyId: $companyId, room: $room, client: $client) {
        token
        company {
          working
          widgetTitle
        }
        client {
          ...fragmentClient
        }
        room {
          id
          title
          foreignId
        }
      }
    }
  `, { fragmentClient });

  constructor(config: IElixirChatConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.backendStaticUrl = config.backendStaticUrl;
    this.companyId = config.companyId;
    this.debug = config.debug || false;
    this.room = config.room;
    this.client = config.client;
    this.isPrivate = !this.room || !this.room.id;
    this.initialize();
  }

  protected initialize(): void {
    if (!this.companyId) {
      // TODO: count all required params
      const message = `Required parameter companyId is not provided: \nSee more: ${API_REFERENCE_URL}#config-companyid`;
      logEvent(this.debug, message, null, 'error');
      return;
    }
    logEvent(this.debug, 'Initializing ElixirChat', {
      apiUrl: this.apiUrl,
      socketUrl: this.socketUrl,
      backendStaticUrl: this.backendStaticUrl,
      companyId: this.companyId,
      room: this.room,
      client: this.client,
      debug: this.debug,
    });

    this.on(JOIN_ROOM_SUCCESS, data => {
      logEvent(this.debug, 'Joined room', data);
      const areAnyOperatorsOnline = _get(data, 'company.working');
      this.messageSubscription.subscribe();
      this.typingStatusSubscription.subscribe();
      this.operatorOnlineStatusSubscription.setStatus(areAnyOperatorsOnline);
    });

    this.on(JOIN_ROOM_ERROR, error => {
      logEvent(this.debug, 'Failed to join room', { error, query, variables }, 'error');
    });

    this.on(MESSAGES_NEW, message => {
      this.messageHistory.push(message);
      this.unreadMessagesCounter.recount();
    });

    this.on(MESSAGES_FETCH_HISTORY, messages => {
      this.messageHistory = this.messageHistory.concat(messages);
      this.unreadMessagesCounter.recount();
    });

    this.setRoomAndClient();
    this.screenshotTaker = new ScreenshotTaker({ elixirChat: this });
    this.messageSubscription = new MessageSubscription({ elixirChat: this });
    this.unreadMessagesCounter = new UnreadMessagesCounter({ elixirChat: this });
    this.typingStatusSubscription = new TypingStatusSubscription({ elixirChat: this });
    this.operatorOnlineStatusSubscription = new OperatorOnlineStatusSubscription({ elixirChat: this });
    this.joinRoom();
  }

  protected setRoomAndClient(data: { room?: IElixirChatRoom, client?: IElixirChatUser }): void {
    let room: any = data.room || {};
    let client: any = data.client || {};

    const localStorageRoom: IElixirChatRoom = getJSONFromLocalStorage('elixirchat-room');
    const localStorageClient: IElixirChatUser = getJSONFromLocalStorage('elixirchat-client');
    const anonymousClientData = this.generateAnonymousClientData();

    const clientId = client.id || localStorageClient.id || anonymousClientData.id;
    const clientFirstName = client.firstName || localStorageClient.firstName || anonymousClientData.firstName;
    const clientLastName = client.lastName || localStorageClient.lastName || anonymousClientData.lastName;

    this.client = {
      id: clientId,
      firstName: clientFirstName,
      lastName: clientLastName,
    };

    const roomId = room.id || localStorageRoom.id || clientId;
    const roomTitle = room.title || localStorageRoom.title || clientFirstName + ' ' + clientLastName;
    const roomData = room.data || {};
    this.room = {
      id: roomId,
      title: roomTitle,
      data: roomData,
    };

    localStorage.setItem('elixirchat-room', JSON.stringify(room));
    localStorage.setItem('elixirchat-client', JSON.stringify(client));

    logEvent(this.debug, 'Set room and client values', {
      room: this.room,
      client: this.client,
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
    const callbacks = this.eventCallbacks[eventName];
    if (callbacks && callbacks.length) {
      callbacks.forEach(callback => callback(params));
    }
  };

  public on = (eventName, callback) => {
    if (!this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName] = [];
    }
    this.eventCallbacks[eventName].push(callback);
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
          this.connected = true;
          this.authToken = joinRoom.token;
          this.widgetTitle = joinRoom.company.widgetTitle || this.defaultWidgetTitle;
          this.elixirChatClientId = joinRoom.client.id;
          this.elixirChatRoomId = joinRoom.room.id;
          this.triggerEvent(JOIN_ROOM_SUCCESS, { joinRoom, room: this.room, client: this.client });
        }
        else {
          this.triggerEvent(JOIN_ROOM_ERROR, joinRoom);
        }
      }).catch((response) => {
        this.triggerEvent(JOIN_ROOM_ERROR, response);
    });
  }

  public sendMessage = (params: ISentMessageSerialized): Promise<IMessage> => {
    this.typingStatusSubscription.dispatchTypedText(false);
    return this.messageSubscription.sendMessage(params);
  };

  public fetchMessageHistory = (limit: number, beforeCursor?: string): Promise<[IMessage]> => {
    return this.messageSubscription.fetchMessageHistory(limit, beforeCursor);
  };

  public dispatchTypedText = (typedText: string): void => {
    this.typingStatusSubscription.dispatchTypedText(typedText);
  };

  public resetUnreadMessagesCounter = (): void => {
    this.unreadMessagesCounter.reset();
  };

  public takeScreenshot = (): Promise<IScreenshot> => {
    return this.screenshotTaker.takeScreenshot();
  };

  public reconnect = ({ room, client }: { room?: IElixirChatRoom, client?: IElixirChatUser }): Promise<void> => {

    // TODO: double check reconnect

    logEvent(this.debug, 'Attempting to reconnect to another room', { room, client });
    if (room) {
      this.room = room;
    }
    if (client) {
      this.client = client;
    }

    this.isPrivate = !room || !room.id;

    this.setRoomAndClient({ room, client });
    this.messageSubscription.unsubscribe();
    this.operatorOnlineStatusSubscription.unsubscribe();
    this.unreadMessagesCounter.reset();

    // TODO: resubscribe on JOIN_ROOM?
  };
}


if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
