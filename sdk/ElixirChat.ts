import { uniqueNamesGenerator } from 'unique-names-generator';
import { isMobile } from '../utilsWidget';
import {
  _uniq,
  _upperFirst,
  parseFullName,
  parseGETParams,
  randomDigitStringId,
  getFromLocalStorage,
  setToLocalStorage,
  template,
  hashCode,
  normalizeErrorStack,
} from '../utilsCommon';

import { IMessage } from './serializers/serializeMessage';
import { IUser, serializeUser, fragmentUser } from './serializers/serializeUser';
import { Logger } from './Logger';
import { ScreenshotTaker, IScreenshot } from './ScreenshotTaker';
import { TypingStatusSubscription } from './TypingStatusSubscription';
import { UpdateMessageSubscription } from './UpdateMessageSubscription';
import { OnlineStatusSubscription } from './OnlineStatusSubscription';
import { UnreadCounter, IUnreadCounterData } from './UnreadCounter';
import { MessageSubscription, ISentMessageSerialized } from './MessageSubscription';
import { GraphQLClientSocket } from './GraphQLClientSocket';
import {
  GraphQLClient,
  gql,
  simplifyGraphQLJSON,
  insertGraphQlFragments,
  parseGraphQLMethodFromQuery,
  extractErrorMessage,
} from './GraphQLClient';


import {
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  UNREAD_COUNTER_LAST_READ_MESSAGE_CHANGE,
  UPDATE_MESSAGE_SUBSCRIPTION_CHANGE_MESSAGE,
  ERROR_ALERT,
} from './ElixirChatEventTypes';


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
  fullName?: string;
  isConfidentAboutFirstName: boolean;
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
  isOnline: boolean;
  workHoursStartAt: null | string;
  widgetTitle: string;
  widgetLogo: string;
  channels: Array<IJoinRoomChannel>;
  employeesCount: number;
  employees: Array<IUser>;
  omnichannelCode: string;
  isPopupOpen: boolean;
  unreadMessagesCount: number;
  unreadRepliesCount: number;
  lastReadMessageId: null | string;
  elixirChatClientId: string;
  elixirChatRoomId: string;
  error?: any;
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
  public joinRoomData: IJoinRoomData = {};
  public enabledExperimentalFeatures: Array<string> = [];
  public experimentalFeaturesInTesting: Array<string> = [];

  public isInitialized: boolean = false;
  public isConnected: boolean;

  public get onlineStatus(): boolean {
    return this.onlineStatusSubscription.onlineStatus;
  };
  public get unreadMessagesCount(): number {
    return this.unreadCounter.unreadMessagesCount;
  }
  public get unreadRepliesCount(): number {
    return this.unreadCounter.unreadRepliesCount;
  }
  public get lastReadMessageId(): number {
    return this.unreadCounter.lastReadMessageId;
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
  public unreadCounter: UnreadCounter;
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
    this.unreadCounter = new UnreadCounter({ elixirChat: this });
    this.updateMessageSubscription = new UpdateMessageSubscription({ elixirChat: this });
    this.typingStatusSubscription = new TypingStatusSubscription({ elixirChat: this });
    this.onlineStatusSubscription = new OnlineStatusSubscription({ elixirChat: this });

    this.on(UPDATE_MESSAGE_SUBSCRIPTION_CHANGE_MESSAGE, updatedMessage => {
      this.messageSubscription.changeMessageBy({ id: updatedMessage.id }, updatedMessage);
    });
    this.on(UNREAD_COUNTER_LAST_READ_MESSAGE_CHANGE, lastReadMessageId => {
      this.messageSubscription.markPrecedingMessagesRead(lastReadMessageId);
    });

    this.logInfo('Initializing ElixirChat', config);
    this.initializeExperimentalFeatures();
    return this.joinRoom(this.config.room, this.config.client);
  }

  private serializeClient(rawClient: any): IElixirChatUser {
    rawClient = rawClient || {};
    let isConfidentAboutFirstName = true;

    if (!rawClient.firstName) {
      isConfidentAboutFirstName = false;
    }

    if (rawClient.fullName && !rawClient.firstName && !rawClient.lastName) {
      rawClient = {
        ...rawClient,
        ...parseFullName(rawClient.fullName),
      };
    }

    let clientId = (rawClient.id || '').toString();
    let clientFirstName = rawClient.firstName;
    let clientLastName = rawClient.lastName;

    if (!clientFirstName && !clientLastName) {
      const anonymousClientData = this.generateAnonymousClientData();
      clientId = anonymousClientData.id;
      clientFirstName = anonymousClientData.firstName;
      clientLastName = anonymousClientData.lastName;
      isConfidentAboutFirstName = false;
    }
    return {
      id: clientId.toString(),
      firstName: clientFirstName,
      lastName: clientLastName,
      isConfidentAboutFirstName,
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
      isPrivate: roomId === client.id,
      data: typeof rawRoom.data === 'object' ? rawRoom.data : {},
    };
  };

  private serializeRoomData(rawRoomData: any): string {
    const roomDataObj = {};
    if (typeof rawRoomData === 'object') {
      for (let key in rawRoomData) {
        roomDataObj[key] = rawRoomData[key].toString();
      }
    }
    return JSON.stringify(roomDataObj);
  };

  private generateAnonymousClientData(): IElixirChatUser {
    const separator = ' ';
    const baseTitle = uniqueNamesGenerator({ length: 2, dictionaries: null, separator });
    const [ firstName, lastName ] = baseTitle.split(separator).map(_upperFirst);
    const randomFourDigitPostfix = randomDigitStringId(4);
    const uniqueId = baseTitle.replace(separator, '-') + '-' + randomFourDigitPostfix;
    return {
      id: uniqueId,
      firstName,
      lastName,
    };
  }

  private joinRoom(room: any, client: any): Promise<void> {
    this.client = this.serializeClient(client);
    this.room = this.serializeRoom(room, this.client);

    setToLocalStorage('elixirchat-room', this.room);
    setToLocalStorage('elixirchat-client', this.client);

    const variables = {
      companyId: this.config.companyId,
      client: {
        id: this.client.id,
        firstName: this.client.firstName,
        lastName: this.client.lastName,
      },
      room: {
        id: this.room.id,
        title: this.room.title,
        data: this.serializeRoomData(this.room.data),
      },
    };

    const query = insertGraphQlFragments(gql`
      mutation($companyId: Uuid!, $room: ForeignRoom, $client: ForeignClient!) {
        joinRoom (companyId: $companyId, room: $room, client: $client) {
          token
          company {
            isWorking
            workHoursStartAt
            widgetLogo
            widgetTitle
            omnichannelChannels {
              type
              username
              isConnected
            }
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
            mustOpenWidget
            unreadMessagesCount
            unreadRepliesCount
            lastReadMessageId
          }
        }
      }
    `, { fragmentUser });

    const publicGraphQLClient = new GraphQLClient();
    publicGraphQLClient.initialize({ url: this.config.apiUrl });

    return publicGraphQLClient.query(query, variables)
      .then((response: any) => {
        if (response?.joinRoom) {
          return this.onJoinRoomSuccess(response.joinRoom);
        }
        else {
          throw this.onJoinRoomError(response, room, client);
        }
      }).catch(error => {
        throw this.onJoinRoomError(error, room, client);
      });
  }

  private onJoinRoomSuccess(rawData: any): IJoinRoomData {
    const { apiUrl, socketUrl } = this.config;

    this.joinRoomData = this.serializeJoinRoomData(rawData);
    this.isConnected = true;
    this.logInfo('Joined room', this.joinRoomData);

    const {
      token,
      isOnline,
      workHoursStartAt,
      unreadMessagesCount,
      unreadRepliesCount,
      lastReadMessageId,
    } = this.joinRoomData;

    this.graphQLClient.initialize({ url: apiUrl, token });
    this.graphQLClientSocket.initialize({ url: socketUrl, token });

    this.messageSubscription.subscribe();
    this.updateMessageSubscription.subscribe();
    this.onlineStatusSubscription.subscribe({ isOnline, workHoursStartAt });
    this.unreadCounter.subscribe({ unreadMessagesCount, unreadRepliesCount, lastReadMessageId });

    this.typingStatusSubscription.initialize({ url: socketUrl, token });
    this.typingStatusSubscription.subscribe();

    this.triggerEvent(JOIN_ROOM_SUCCESS, this.joinRoomData, { firedOnce: true });
    return this.joinRoomData;
  }

  private onJoinRoomError(error: any, room: any, client: any): IJoinRoomData {
    this.joinRoomData = this.serializeJoinRoomData(error);
    this.triggerEvent(JOIN_ROOM_ERROR, { ...this.joinRoomData, error });

    setTimeout(() => {
      this.triggerEvent(ERROR_ALERT, {
        customMessage: `joinRoom: ${extractErrorMessage(error)}`,
        retryCallback: () => this.joinRoom(room, client),
        error,
      });
    }, 500);
    throw { ...this.joinRoomData, error };
  };

  private serializeJoinRoomData(data: any): IJoinRoomData {
    const {
      token,
      room = {},
      client = {},
      company = {},
    } = data || {};

    return {
      token: token || '',
      isOnline: company.isWorking || false,
      workHoursStartAt: company.workHoursStartAt || null,
      widgetTitle: company.widgetTitle || '',
      widgetLogo: company.widgetLogo || '',
      channels: this.serializeChannels(company.omnichannelChannels, client.omnichannelCode),
      employeesCount: company.employees?.count || 0,
      employees: simplifyGraphQLJSON(company?.employees).map(employee => {
        return serializeUser(employee, this);
      }),
      omnichannelCode: client.omnichannelCode || '',
      isPopupOpen: room.mustOpenWidget || false,
      unreadMessagesCount: room.unreadMessagesCount || 0,
      unreadRepliesCount: room.unreadRepliesCount || 0,
      lastReadMessageId: room.lastReadMessageId || null,
      elixirChatClientId: client.id || null,
      elixirChatRoomId: room.id || null,
    };
  }

  private serializeChannels(omnichannelChannels: Array<IJoinRoomChannel>, omnichannelCode: string): Array<IJoinRoomChannel> {
    const manualMessageMask = `Чтобы продолжить, просто отправьте целиком это сообщение. Ваш код: ${omnichannelCode}`;
    const desktopUrlMasks = {
      whatsapp: {
        baseUrl: 'https://web.whatsapp.com/send?phone={{ username }}',
        userParams: '&text={{ manualMessage }}',
      },
      telegram: {
        baseUrl: 'http://t.me/{{ username }}',
        userParams: '?start={{ omnichannelCode }}',
      },
      viber: {
        baseUrl: 'viber://pa?chatURI={{ username }}',
        userParams: '&context={{ omnichannelCode }}',
      },
      facebook: {
        baseUrl: 'https://m.me/{{ username }}',
        userParams: '?ref={{ omnichannelCode }}',
      },
      vkontakte: {
        baseUrl: 'https://vk.me/{{ username }}',
        userParams: '?ref={{ omnichannelCode }}',
      },
    };
    const mobileUrlMasks = {
      whatsapp: {
        baseUrl: 'whatsapp://send?phone={{ username }}',
        userParams: '&text={{ manualMessage }}',
      },
      telegram: {
        baseUrl: 'tg://resolve?domain={{ username }}',
        userParams: '&start={{ omnichannelCode }}',
      },
      viber: {
        baseUrl: 'viber://pa?chatURI={{ username }}',
        userParams: '&context={{ omnichannelCode }}',
      },
      vkontakte: {
        baseUrl: 'https://vk.me/{{ username }}',
        userParams: '?ref={{ omnichannelCode }}',
      },
      facebook: {
        baseUrl: 'https://m.me/{{ username }}',
        userParams: '?ref={{ omnichannelCode }}',
      },
    };
    const isMobileBrowser = isMobile();

    return (omnichannelChannels || []).map(channel => {
      const { username, isConnected = false } = channel;
      const type = channel.type.toLowerCase();
      const mask = isMobileBrowser ? mobileUrlMasks[type] : desktopUrlMasks[type];
      const urlMask = isConnected ? mask.baseUrl : mask.baseUrl + mask.userParams;
      const url = template(urlMask, {
        username,
        omnichannelCode,
        manualMessage: manualMessageMask,
      });
      return { type, username, omnichannelCode, url, isConnected };
    });
  };

  private checkIfConnected(): Promise<any> {
    if (this.isConnected) {
      return Promise.resolve();
    }
    else {
      const message = 'ElixirChat is not currently connected. Use reconnect({ room, client }) method to connect to a room.';
      this.logError(message);
      this.triggerEvent(ERROR_ALERT, {
        customMessage: message,
        retryCallback: () => this.joinRoom(this.config.room, this.config.client),
        error: { message },
      });
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

      // Prevents subscribing to the same event with the same callback multiple times when the same component
      // mounts/unmounts periodically (e.g. when user switches back and forth from WelcomeScreen to ChatMessages)
      const hash = this.getCallbackUniqueHash(callback);
      eventHandler.callbacks[hash] = callback;
      if (eventHandler.firedOnce) {
        callback(eventHandler.firedOnceArguments);
      }
    }
  };

  public off = (eventName: string, callback: (data: any) => void): void => {

    if (!this.eventHandlers[eventName]?.callbacks) {
      this.eventHandlers[eventName] = { callbacks: {} };
    }
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
    const callStackHash = hashCode(
      normalizeErrorStack(new Error().stack, 3)
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

  public setLastReadMessage = (messageId: string): Promise<IUnreadCounterData> => {
    return this.checkIfConnected().then(() => {
      return this.unreadCounter.setLastReadMessage(messageId);
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
        const errorMessage = `${graphQLMethod}: ${extractErrorMessage(rawError)}`;
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
      this.unreadCounter.unsubscribe();
      this.typingStatusSubscription.unsubscribe();
      this.onlineStatusSubscription.unsubscribe();
    });
  };

  public reconnect = (config: { room?: IElixirChatRoom, client?: IElixirChatUser }): Promise<void> => {
    this.logInfo('Attempting to reconnect to another room', config);
    this.disconnect();
    return this.joinRoom(config.room, config.client);
  };

  /**
   * To enable an experimental feature, open a link in the following format to a website with an embedded ElixirChat Widget
   * @example
   *  http://example.com/your/path?__elixir-enable-feature=<FEATURE-NAME> (with ?query params)
   *  or http://example.com/your/path#__elixir-enable-feature=<FEATURE-NAME> (with #hash)
   *
   * To disable it, pass the "__elixir-disable-feature" option:
   * @example http://localhost:8001/?__elixir-disable-feature=<FEATURE-NAME> (either with ?query params or #hash)
   */
  private initializeExperimentalFeatures(): void {
    const urlParams = {
      ...parseGETParams(location.search),
      ...parseGETParams(location.hash),
    };
    let enabledExperimentalFeatures = getFromLocalStorage('elixirchat-enabled-features', []);

    if (urlParams['__elixir-enable-feature']) {
      enabledExperimentalFeatures = _uniq([
        ...enabledExperimentalFeatures,
        urlParams['__elixir-enable-feature'].toLowerCase(),
      ]);
    }
    else if (urlParams['__elixir-disable-feature']) {
      enabledExperimentalFeatures = enabledExperimentalFeatures.filter(feature => {
        return feature !== urlParams['__elixir-disable-feature'].toLowerCase();
      });
    }
    setToLocalStorage('elixirchat-enabled-features', enabledExperimentalFeatures);
    this.enabledExperimentalFeatures = enabledExperimentalFeatures;
  };

  public isFeatureEnabled = (featureName: string): boolean => {
    this.experimentalFeaturesInTesting = _uniq([ ...this.experimentalFeaturesInTesting, featureName.toLowerCase() ]);
    return this.enabledExperimentalFeatures.includes(featureName.toLowerCase());
  };
}


if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
