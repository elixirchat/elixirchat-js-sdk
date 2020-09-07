import { uniqueNamesGenerator } from 'unique-names-generator';
import {
  capitalize,
  randomDigitStringId,
  getFromLocalStorage, template, setToLocalStorage, hashCode, _find,
} from '../utilsCommon';

import { IMessage } from './serializers/serializeMessage';
import {fragmentUser, IUser, serializeUser} from './serializers/serializeUser';
import { Logger } from './Logger';
import { ScreenshotTaker, IScreenshot } from './ScreenshotTaker';
import { TypingStatusSubscription } from './TypingStatusSubscription';
import { UpdateMessageSubscription } from './UpdateMessageSubscription';
import { OnlineStatusSubscription } from './OnlineStatusSubscription';
import { UnreadMessagesCounter, IUnreadMessagesCounterData } from './UnreadMessagesCounter';
import { MessageSubscription, ISentMessageSerialized } from './MessageSubscription';
import {
  GraphQLClient,
  gql,
  insertGraphQlFragments,
  parseGraphQLMethodFromQuery,
  getErrorMessageFromResponse, simplifyGraphQLJSON,
} from './GraphQLClient';
import { GraphQLClientSocket } from './GraphQLClientSocket';

import {
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  LAST_READ_MESSAGE_CHANGE,
  UPDATE_MESSAGES_CHANGE, MESSAGES_RECEIVE, MESSAGES_CHANGE,         // TODO: refactor
} from './ElixirChatEventTypes';
import {isMobileSizeScreen} from '../utilsWidget';


export interface IElixirChatRoom {
  id: string;
  title?: string;
  data?: any;
  isPrivate: boolean;
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
  sentryUrl?: boolean,
}

export interface IJoinRoomData {
  token: string;
  logoUrl: string;
  mainTitle: string;
  chatSubtitle: string;
  channels: Array<IJoinRoomChannel>;
  employeesCount: number;
  employees: Array<IUser>;
  isOnline: boolean;
  isPopupOpen: boolean;
  workHoursStartAt: null | string;
  elixirChatClientId: string;
  elixirChatRoomId: string;
  unreadMessagesCount: number;
  unreadRepliesCount: number;
  omnichannelCode: string;
}

export interface IJoinRoomChannel {
  type: string;
  username: string;
  url?: string;
  omnichannelCode?: string;
}

export class ElixirChat {

  public version: string = process.env.ELIXIRCHAT_VERSION;
  public config: IElixirChatConfig = {};
  public room?: IElixirChatRoom;
  public client?: IElixirChatUser;
  public isPrivateRoom: boolean;
  public joinRoomData: IJoinRoomData = {};

  public isInitialized: boolean = false;
  public isConnected: boolean;

  public get onlineStatus(): boolean {
    return this.onlineStatusSubscription.onlineStatus;
  };
  public get unreadMessagesCount(): number {
    return this.unreadMessagesCounter.unreadMessagesCount;
  }
  public get unreadRepliesCount(): number {
    return this.unreadMessagesCounter.unreadRepliesCount;
  }
  public get lastReadMessageId(): number {
    return this.unreadMessagesCounter.lastReadMessageId;
  }
  public get messageHistory(): boolean {
    return this.messageSubscription.messageHistory;
  }
  public graphQLClient: GraphQLClient;
  public graphQLClientSocket: GraphQLClientSocket;
  public messageSubscription: MessageSubscription;
  public updateMessageSubscription: UpdateMessageSubscription;
  public onlineStatusSubscription: OnlineStatusSubscription;
  public typingStatusSubscription: TypingStatusSubscription;
  public unreadMessagesCounter: UnreadMessagesCounter;
  public screenshotTaker: ScreenshotTaker;
  public logger: Logger;

  private eventHandlers: object = {};

  constructor(config: IElixirChatConfig) {
    if (this.hasAllRequiredConfigParameters(config)) {
      this.initialize(config);
    }
    if (typeof window !== 'undefined') {
      window.elixirChat = this;
    }
  }

  private hasAllRequiredConfigParameters(config: IElixirChatConfig): boolean {
    const requiredParams = ['apiUrl', 'socketUrl', 'companyId'];
    const missingRequiredParams = requiredParams.filter(paramKey => {
      return !config[paramKey];
    });
    if (missingRequiredParams.length) {
      throw `Required parameters: ${missingRequiredParams.join(', ')} not provided. \nSee more: https://github.com/elixirchat/elixirchat-js-sdk#config`;
    }
    else {
      return  true;
    }
  };

  private initialize(config: IElixirChatConfig): void {
    this.config = config || {};
    this.isInitialized = true;

    this.graphQLClient = new GraphQLClient();
    this.graphQLClientSocket = new GraphQLClientSocket();
    this.logger = new Logger({ elixirChat: this });
    this.screenshotTaker = new ScreenshotTaker({ elixirChat: this });
    this.messageSubscription = new MessageSubscription({ elixirChat: this });
    this.unreadMessagesCounter = new UnreadMessagesCounter({ elixirChat: this });
    this.updateMessageSubscription = new UpdateMessageSubscription({ elixirChat: this });
    this.typingStatusSubscription = new TypingStatusSubscription({ elixirChat: this });
    this.onlineStatusSubscription = new OnlineStatusSubscription({ elixirChat: this });

    this.on(UPDATE_MESSAGES_CHANGE, updatedMessage => {
      this.messageSubscription.changeMessageBy({ id: updatedMessage.id }, updatedMessage);
    });
    this.on(LAST_READ_MESSAGE_CHANGE, lastReadMessageId => {
      this.messageSubscription.markPrecedingMessagesRead(lastReadMessageId);
    });

    this.logInfo('Initializing ElixirChat', config);
    return this.joinRoom();
  }

  private serializeClient(rawClient: any): IElixirChatUser {
    rawClient = rawClient || {};
    const localStorageClient: IElixirChatUser = getFromLocalStorage('elixirchat-client') || {};
    const anonymousClientData = this.generateAnonymousClientData();

    const clientId = rawClient.id || localStorageClient.id || anonymousClientData.id;

    let clientFirstName = typeof rawClient.firstName === 'string'
      ? rawClient.firstName
      : localStorageClient.firstName || anonymousClientData.firstName;

    let clientLastName = typeof rawClient.lastName === 'string'
      ? rawClient.lastName
      : localStorageClient.lastName || anonymousClientData.lastName;

    if (!clientFirstName && !clientLastName) {
      clientFirstName = localStorageClient.firstName || anonymousClientData.firstName;
      clientLastName = localStorageClient.lastName || anonymousClientData.lastName;
    }
    return {
      id: clientId.toString(),
      firstName: clientFirstName,
      lastName: clientLastName,
    };
  }

  private serializeRoom(rawRoom: any, client: IElixirChatUser): IElixirChatRoom {
    rawRoom = rawRoom || {};
    const localStorageRoom: IElixirChatRoom = getFromLocalStorage('elixirchat-room') || {};
    const roomId = rawRoom.id || localStorageRoom.id || client.id;
    const roomTitle = rawRoom.title || localStorageRoom.title || client.firstName + ' ' + client.lastName;

    const roomDataObj = {};
    if (typeof rawRoom.data === 'object') {
      for (let key in rawRoom.data) {
        roomDataObj[key] = rawRoom.data[key].toString();
      }
    }
    return {
      id: roomId.toString(),
      title: roomTitle,
      data: JSON.stringify(roomDataObj),
    };
  };

  private generateAnonymousClientData(): IElixirChatUser {
    const baseTitle = uniqueNamesGenerator({ length: 2, separator: ' ', dictionaries: null });
    const [ firstName, lastName ] = baseTitle.split(' ').map(capitalize);
    const randomFourDigitPostfix = randomDigitStringId(4);
    const uniqueId = baseTitle.replace(' ', '-') + '-' + randomFourDigitPostfix;
    return {
      id: uniqueId,
      firstName,
      lastName,
    };
  }

  private joinRoom(room: any, client: any): Promise<void> {
    this.client = this.serializeClient(client);
    this.room = this.serializeRoom(room, this.client);
    this.isPrivateRoom = this.room.id === this.client.id;

    setToLocalStorage('elixirchat-room', this.room);
    setToLocalStorage('elixirchat-client', this.client);

    const variables = {
      companyId: this.config.companyId,
      client: this.client,
      room: this.room,
    };


    // TODO: support company.logoUrl on backend
    // TODO: support company.widgetChatSubtitle on backend
    // TODO: support company.channels on backend

    const query = insertGraphQlFragments(gql`
      mutation($companyId: Uuid!, $room: ForeignRoom, $client: ForeignClient!) {
        joinRoom (companyId: $companyId, room: $room, client: $client) {
          token
          company {
            isWorking
            workHoursStartAt
            widgetTitle
            employees(first: 20) {
              count
              edges {
                node { ...fragmentUser }
              }
            }
          }
          client {
            ...fragmentUser
            omnichannelCode
          }
          room {
            id
            title
            foreignId
            mustOpenWidget
            unreadMessagesCount
            unreadRepliesCount
          }
        }
      }
    `, { fragmentUser });

    const publicGraphQLClient = new GraphQLClient();
    publicGraphQLClient.initialize({ url: this.config.apiUrl });

    return publicGraphQLClient.query(query, variables)
      .then((response: any) => {
        if (response?.joinRoom) {
          const joinRoomData = this.serializeJoinRoomData(response.joinRoom);
          this.joinRoomData = joinRoomData;
          this.onJoinRoomSuccess(joinRoomData);
          this.triggerEvent(JOIN_ROOM_SUCCESS, joinRoomData, { firedOnce: true });
          return joinRoomData;
        }
        else {
          this.triggerEvent(JOIN_ROOM_ERROR, response);
          throw response;
        }
      }).catch((response) => {
        this.triggerEvent(JOIN_ROOM_ERROR, response);
        throw response;
    });
  }

  private onJoinRoomSuccess(joinRoomData: IJoinRoomData): void {
    const { apiUrl, socketUrl } = this.config;
    const {
      token,
      isOnline,
      workHoursStartAt,
      unreadMessagesCount,
      unreadRepliesCount,
    } = joinRoomData;

    this.logInfo('Joined room', joinRoomData);
    this.isConnected = true;

    this.graphQLClient.initialize({ url: apiUrl, token });
    this.graphQLClientSocket.initialize({ url: socketUrl, token });

    this.messageSubscription.subscribe();
    this.updateMessageSubscription.subscribe();
    this.onlineStatusSubscription.subscribe({ isOnline, workHoursStartAt });
    this.unreadMessagesCounter.subscribe({ unreadMessagesCount, unreadRepliesCount }); // TODO: fix params
    // this.typingStatusSubscription.subscribe(); // TODO: fix
  }

  private serializeJoinRoomData(data: any): IJoinRoomData {
    const {
      token,
      room = {},
      client = {},
      company = {},
    } = data;

    return {
      token,
      logoUrl: company.logoUrl,
      mainTitle: company.widgetTitle,
      chatSubtitle: company.widgetChatSubtitle,
      channels: this.serializeChannels(company.channels, client.omnichannelCode),
      employeesCount: company.employees?.count || 0,
      employees: simplifyGraphQLJSON(company?.employees).map(employee => {
        return serializeUser(employee, this);
      }),
      isOnline: company.isWorking,
      isPopupOpen: room.mustOpenWidget,
      workHoursStartAt: company.workHoursStartAt,
      elixirChatClientId: client.id,
      elixirChatRoomId: room.id,
      unreadMessagesCount: room.unreadMessagesCount,
      unreadRepliesCount: room.unreadRepliesCount,
      omnichannelCode: client.omnichannelCode,
    };
  }

  private serializeChannels(channels: Array<IJoinRoomChannel>, omnichannelCode: string): Array<IJoinRoomChannel> {

    // TODO: remove mock when backend is finished
    channels = [
      {
        type: 'whatsapp',
        username: '917290961818',
      },
      {
        type: 'telegram',
        username: 'elixirchat_test_bot',
      },
      {
        type: 'vkontakte',
        username: 'club198196792',
      },
      {
        type: 'viber',
        username: 'chathelpdesk',
      },
      {
        type: 'facebook',
        username: 'huntflow',
      },
    ];

    const isMobile = isMobileSizeScreen();
    const manualMessageMask = `Чтобы продолжить, просто отправьте целиком это сообщение. Ваш код: ${omnichannelCode}`;
    const desktopUrlMasks = {
      whatsapp: 'https://web.whatsapp.com/send?phone={{ username }}&text={{ manualMessage }}',
      telegram: 'http://t.me/{{ username }}?start={{ omnichannelCode }}',
      viber: 'viber://pa?chatURI={{ username }}&context={{ omnichannelCode }}',
      facebook: 'https://m.me/{{ username }}?ref={{ omnichannelCode }}',
      vkontakte: 'https://vk.me/{{ username }}?ref={{ omnichannelCode }}',
    };
    const mobileUrlMasks = {
      whatsapp: 'whatsapp://send?phone={{ username }}&text={{ manualMessage }}',
      telegram: 'tg://resolve?domain={{ username }}&start={{ omnichannelCode }}',
      viber: 'viber://pa?chatURI={{ username }}&context={{ omnichannelCode }}',

      // TODO: optimize facebook
      // TODO: optimize vk
      facebook: 'https://m.me/{{ username }}?ref={{ omnichannelCode }}',
      vkontakte: 'https://vk.me/{{ username }}?ref={{ omnichannelCode }}',
    };
    return (channels || []).map(channel => {
      const { username } = channel;
      const type = channel.type.toLowerCase();
      const urlMask = isMobile ? mobileUrlMasks[type] : desktopUrlMasks[type];
      const url = template(urlMask, {
        username,
        omnichannelCode,
        manualMessage: manualMessageMask,
      });
      return { type, username, omnichannelCode, url };
    });
  };

  private checkIfConnected(): Promise<any> {
    if (this.isConnected) {
      return Promise.resolve();
    }
    else {
      const message = 'ElixirChat is not currently connected. Use reconnect({ room, client }) method to connect to a room.';
      this.logError(message);
      return Promise.reject({ message });
    }
  };

  public on = (eventName: string | [string], callback: (data: any) => void): void => {
    if (eventName instanceof Array) {
      eventName.map(singleEventName => this.on(singleEventName, callback));
    }
    else {
      if (!this.eventHandlers[eventName]?.callbacks) {
        this.eventHandlers[eventName] = { callbacks: {} };
      }
      const eventHandler = this.eventHandlers[eventName];

      // Prevents executing the same event handler multiple times when the same component
      // mounts/unmounts periodically (e.g. when user switches back and forth from WelcomeScreen to ChatMessages)
      const hash = this.getCallbackUniqueHash(callback);
      eventHandler.callbacks[hash] = callback;
      if (eventHandler.firedOnce) {
        callback(eventHandler.firedOnceArguments);
      }
    }
  };

  public off = (eventName: string, callback: (data: any) => void): void => {
    const eventHandler = this.eventHandlers[eventName];
    if (callback) {
      for (let hash in eventHandler.callbacks) {
        const currentCallback = eventHandler.callbacks[hash];
        if (currentCallback === callback) {
          delete eventHandler.callbacks[hash];
          return;
        }
      }
    }
    else {
      eventHandler.callbacks = {};
    }
  };

  public triggerEvent = (eventName: string, data?: any, options?: { firedOnce: boolean }): void => {
    options = options || {};
    this.logEvent(eventName, data);

    if (!this.eventHandlers[eventName]?.callbacks) {
      this.eventHandlers[eventName] = { callbacks: {} };
    }
    const eventHandler = this.eventHandlers[eventName];
    eventHandler.firedOnce = options.firedOnce;
    if (options.firedOnce) {
      eventHandler.firedOnceArguments = data;
    }
    Object.values(eventHandler.callbacks).forEach(callback => callback(data));
  };

  private getCallbackUniqueHash(callback: () => any): string {
    const e = new Error();
    const callStackHash = hashCode(
      (e.stack || '')
        .trim()
        .replace(/^Error\n\s*/, '')
        .split(/\n/)
        .map(row => row.trim())
        .filter(row => row)
        .slice(0,3)
        .join('\n')
    );
    const functionCodeHash = hashCode(callback.toString());
    return Math.abs(functionCodeHash + callStackHash);
  };

  public sendMessage = (params: ISentMessageSerialized): Promise<IMessage> => {
    return this.checkIfConnected().then(() => {
      this.typingStatusSubscription.dispatchTypedText(false);
      return this.messageSubscription.sendMessage(params);
    });
  };

  public retrySendMessage = (message: IMessage): Promise<IMessage> => {
    return this.checkIfConnected().then(() => {
      return this.messageSubscription.retrySendMessage(message);
    });
  };

  public fetchMessageHistory = (limit: number): Promise<[IMessage]> => {
    return this.checkIfConnected().then(() => {
      return this.messageSubscription.fetchMessageHistory(limit);
    });
  };

  public fetchPrecedingMessageHistory = (limit: number): Promise<[IMessage]> => {
    return this.checkIfConnected().then(() => {
      return this.messageSubscription.fetchPrecedingMessageHistory(limit);
    });
  };

  public dispatchTypedText = (typedText: string): void => {
    return this.checkIfConnected().then(() => {
      return this.typingStatusSubscription.dispatchTypedText(typedText);
    });
  };

  public setLastReadMessage = (messageId: string): Promise<IUnreadMessagesCounterData> => {
    return this.checkIfConnected().then(() => {
      return this.unreadMessagesCounter.setLastReadMessage(messageId);
    });
  };

  public takeScreenshot = (): Promise<IScreenshot> => {
    return this.screenshotTaker.takeScreenshot();
  };

  public logEvent = (text: string, data: any): void => {
    return this.logger.logEvent(text, data);
  };

  public logInfo = (text: string, data: any): void => {
    return this.logger.logInfo(text, data);
  };

  public logError = (text: string, data: any): void => {
    return this.logger.logError(text, data);
  };

  public sendAPIRequest = (query: string, variables?: any, binaries?: Array<any>): Promise<any> => {
    const graphQLMethod = parseGraphQLMethodFromQuery(query);

    return this.graphQLClient.query(query, variables, binaries)
      .then(data => data[graphQLMethod])
      .catch(rawError => {
        const errorMessage = `${graphQLMethod}: ${getErrorMessageFromResponse(rawError)}`;
        const errorType = rawError?.errors?.[0]?.reason || null;
        const additionalErrorData = {
          errorMessage,
          errorType,
          rawError,
          query,
          variables,
          graphQLMethod,
        };
        this.logError(errorMessage, additionalErrorData);
        throw {
          errorMessage,
          ...additionalErrorData,
        };
      });
  };

  public disconnect = (): void => {
    return this.checkIfConnected().then(() => {
      this.logInfo('Disconnecting from ElixirChat');
      this.isConnected = false;
      this.messageSubscription.unsubscribe();
      this.updateMessageSubscription.unsubscribe();
      this.unreadMessagesCounter.unsubscribe();
      this.typingStatusSubscription.unsubscribe();
      this.onlineStatusSubscription.unsubscribe();
    });
    // TODO: remove firedOnce params? use .off()?
    // TODO: remove eventHandlers?
  };

  public reconnect = (config: { room?: IElixirChatRoom, client?: IElixirChatUser }): Promise<void> => {
    this.logInfo('Attempting to reconnect to another room', config);
    this.disconnect();
    return this.joinRoom(config.room, config.client);
  };
}


if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
