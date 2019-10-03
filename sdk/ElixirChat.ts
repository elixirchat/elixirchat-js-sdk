import { uniqueNamesGenerator } from 'unique-names-generator';
import { logEvent, capitalize, randomDigitStringId } from '../utilsCommon';
import { IMessage } from './serializers/serializeMessage';
import { fragmentClient } from './serializers/serializeUser';
import { MessagesSubscription, ISentMessage } from './MessagesSubscription';
import { TypingStatusSubscription } from './TypingStatusSubscription';
import { OperatorOnlineStatusSubscription } from './OperatorOnlineStatusSubscription';
import { ScreenshotTaker, IScreenshot } from './ScreenshotTaker';
import { GraphQLClient, insertGraphQlFragments, gql } from './GraphQLClient';

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

export interface IElixirChatReceivedMessage extends IMessage {}
export interface IElixirChatSentMessage extends ISentMessage {}
export interface IElixirChatScreenshot extends IScreenshot {}

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

  public widgetTitle: string = '';
  public defaultWidgetTitle: string = 'Служба поддержки';

  public get reachedBeginningOfMessageHistory(): boolean {
    return this.messagesSubscription ? this.messagesSubscription.reachedBeginningOfMessageHistory : false;
  }

  protected graphQLClient: any;
  protected messagesSubscription: any;
  protected operatorOnlineStatusSubscription: any;
  protected typingStatusSubscription: any;
  protected screenshotTaker: any;

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

  protected onMessageCallbacks: Array<(message: IElixirChatReceivedMessage) => void> = [];
  protected onConnectSuccessCallbacks: Array<(data?: any) => void> = [];
  protected onConnectErrorCallbacks: Array<(e: any) => void> = [];
  protected onTypingCallbacks: Array<(typingUsers: Array<IElixirChatUser>) => void> = [];
  protected onOperatorOnlineStatusChangeCallbacks: Array<(isOnline: boolean) => void> = [];

  constructor(config: IElixirChatConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.backendStaticUrl = config.backendStaticUrl;
    this.companyId = config.companyId;
    this.debug = config.debug || false;
    this.room = config.room;
    this.client = config.client;

    this.isPrivate = !this.room || !this.room.id;

    const localValues = this.getRoomClientFromLocalStorage();
    if (!this.room || !this.room.id) {
      this.room = localValues.room;
    }
    if (!this.client || !this.client.id) {
      this.client = localValues.client;
    }
    this.initialize();
  }

  protected initialize(): void {
    if (!this.companyId) {
      logEvent(
        this.debug,
        `Required parameter companyId is not provided: \nSee more: ${API_REFERENCE_URL}#config-companyid`,
        null,
        'error'
      );
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
    this.screenshotTaker = new ScreenshotTaker();
    this.setDefaultConfigValues();
    this.connectToRoom().then(() => {
      this.saveRoomClientToLocalStorage(this.room, this.client);
      this.subscribeToNewMessages();
      this.subscribeToTypingStatusChange();
      this.subscribeToOperatorOnlineStatusChange();
    });
  }

  protected getDefaultClientData(): IElixirChatUser {
    const baseTitle = uniqueNamesGenerator({ length: 2, separator: ' ', dictionaries: null });
    const [firstName, lastName] = baseTitle.split(' ').map(capitalize);
    const randomFourDigitPostfix = randomDigitStringId(4);
    const uniqueId = baseTitle.replace(' ', '-') + '-' + randomFourDigitPostfix;
    const clientData = {
      id: uniqueId,
      firstName,
      lastName,
    };
    logEvent(this.debug, 'Generated default client data', clientData);
    return clientData;
  }

  protected getRoomClientFromLocalStorage(): { room?: IElixirChatRoom, client?: IElixirChatUser } {
    let room: IElixirChatRoom;
    let client: IElixirChatUser;
    try {
      room = JSON.parse(localStorage.getItem('elixirchat-room'));
    }
    catch (e) {}
    try {
      client = JSON.parse(localStorage.getItem('elixirchat-client'));
    }
    catch (e) {}
    logEvent(this.debug, 'Fetched room, client values from localStorage', { room, client });
    return {
      room,
      client,
    };
  }

  protected saveRoomClientToLocalStorage(room: IElixirChatRoom, client: IElixirChatUser): void {
    localStorage.setItem('elixirchat-room', JSON.stringify(room));
    localStorage.setItem('elixirchat-client', JSON.stringify(client));
  }

  protected setDefaultConfigValues(): void {
    const client : any = this.client || {};
    const room : any = this.room || {};
    const defaultClientData = this.getDefaultClientData();

    const clientId = client.id || defaultClientData.id;
    let clientFirstName = client.firstName;
    let clientLastName = client.lastName;
    if (!clientFirstName && !clientLastName) {
      clientFirstName = defaultClientData.firstName;
      clientLastName = defaultClientData.lastName;
    }
    this.client = {
      id: clientId,
      firstName: clientFirstName,
      lastName: clientLastName,
    };

    const roomId = room.id || clientId;
    const roomTitle = room.title || clientFirstName + ' ' + clientLastName;
    const roomData = room.data || {};
    this.room = {
      id: roomId,
      title: roomTitle,
      data: roomData,
    };

    logEvent(this.debug, 'Set room and client values', {
      room: this.room,
      client: this.client,
    });
  };

  serializeRoomData(data){
    const serializedData = {};
    for (let key in data) {
      serializedData[key] = data[key].toString();
    }
    return JSON.stringify(serializedData);
  };

  protected connectToRoom(): Promise<void> {
    this.graphQLClient = new GraphQLClient({ url: this.apiUrl });

    const query = this.joinRoomQuery;
    const variables = {
      companyId: this.companyId,
      room: {
        id: this.room.id,
        title: this.room.title,
        data: this.serializeRoomData(this.room.data)
      },
      client: this.client,
    };

    return new Promise((resolve, reject) => {
      this.graphQLClient.query(query, variables)
        .then(({ joinRoom }: any) => {
          if (joinRoom) {
            this.authToken = joinRoom.token;
            this.connected = true;

            this.client.firstName = joinRoom.client.firstName;
            this.client.lastName = joinRoom.client.lastName;
            this.client.id = joinRoom.client.foreignId;
            this.elixirChatClientId = joinRoom.client.id;
            this.widgetTitle = joinRoom.company.widgetTitle || this.defaultWidgetTitle;

            this.room.id = joinRoom.room.foreignId;
            this.room.title = joinRoom.room.title;
            this.elixirChatRoomId = joinRoom.room.id;

            logEvent(this.debug, 'Joined room', { joinRoom, room: this.room, client: this.client });
            resolve(joinRoom);
          }
          else {
            logEvent(this.debug, 'Failed to join room', { joinRoom, query, variables }, 'error');
            this.onConnectErrorCallbacks.forEach(callback => callback(joinRoom));
            reject(joinRoom);
          }
        }).catch((response: any) => {
          logEvent(this.debug, 'Failed to join room', { response, query, variables }, 'error');
          this.onConnectErrorCallbacks.forEach(callback => callback(response));
          reject(response);
        });
    });
  }

  protected subscribeToTypingStatusChange(): void {
    this.typingStatusSubscription = new TypingStatusSubscription({
      socketUrl: this.socketUrl,
      token: this.authToken,
      roomId: this.elixirChatRoomId,
      clientId: this.elixirChatClientId,
      onSubscribeSuccess: () => {
        logEvent(this.debug, 'Successfully subscribed to typing status change', { roomId: this.elixirChatRoomId })
      },
      onSubscribeError: (data) => {
        logEvent(this.debug, 'Failed to subscribe to typing status change', data, 'error');
      },
      onChange: (peopleWhoAreTyping: Array<IElixirChatUser>) => {
        logEvent(this.debug, 'Some users started/stopped typing', { peopleWhoAreTyping });
        this.onTypingCallbacks.forEach(callback => callback(peopleWhoAreTyping));
      }
    });
  }

  protected subscribeToOperatorOnlineStatusChange(): void {
    this.operatorOnlineStatusSubscription = new OperatorOnlineStatusSubscription({
      socketUrl: this.socketUrl,
      token: this.authToken,
      onSubscribeSuccess: () => {
        logEvent(this.debug, 'Successfully subscribed to operator online status change')
      },
      onSubscribeError: (data) => {
        logEvent(this.debug, 'Failed to subscribe to operator online status change', data, 'error');
      },
      onStatusChange: (isOnline: boolean) => {
        logEvent(this.debug, isOnline ? 'Operators got back online' : 'All operators went');
        this.onOperatorOnlineStatusChangeCallbacks.forEach(callback => callback(isOnline));
      },
      onUnsubscribe: () => {
        logEvent(this.debug, 'Unsubscribed from  operator online status change');
      },
    });
  }

  protected subscribeToNewMessages(): void {
    this.messagesSubscription = new MessagesSubscription({
      apiUrl: this.apiUrl,
      socketUrl: this.socketUrl,
      backendStaticUrl: this.backendStaticUrl,
      token: this.authToken,
      currentClientId: this.client.id,
      onSubscribeSuccess: () => {
        const roomData = {
          room: this.room,
          client: this.client,
        };
        logEvent(this.debug, 'Successfully subscribed to messages', roomData);
        this.onConnectSuccessCallbacks.forEach(callback => callback(roomData));
      },
      onSubscribeError: (data) => {
        logEvent(this.debug, 'Failed to subscribe to messages', { data }, 'error');
        this.onConnectErrorCallbacks.forEach(callback => callback(data));
      },
      onMessage: (message: IElixirChatReceivedMessage) => {
        logEvent(this.debug, 'Received new message', message);
        this.onMessageCallbacks.forEach(callback => callback(message));
      },
      onUnsubscribe: () => {
        logEvent(this.debug, 'Unsubscribed from messages', {
          room: this.room,
          client: this.client,
        });
      },
    });
  }

  public sendMessage(params: IElixirChatSentMessage): Promise<IElixirChatReceivedMessage> {
    const text = params.text;
    const attachments = params.attachments && params.attachments.length
      ? Array.from(params.attachments).filter(file => file)
      : [];
    const responseToMessageId = typeof params.responseToMessageId === 'string' ? params.responseToMessageId : null;
    const tempId = params.tempId;

    if (text.trim() || attachments.length) {
      return this.messagesSubscription.sendMessage({ text, attachments, responseToMessageId, tempId })
        .then(message => {
          logEvent(this.debug, 'Sent message', {
            message,
            params,
            normalizedParams: {
              text,
              attachments,
              responseToMessageId,
              tempId,
            }
          });
          this.typingStatusSubscription.dispatchTypedText(false);
          return message;
        })
        .catch(error => {
          logEvent(this.debug, 'Failed to send message', error, 'error');
          throw error;
        });
    }
    else {
      const errorMessage = 'Either "text" or "attachment" property must not be empty';
      logEvent(this.debug, errorMessage, params, 'error');
      return new Promise((resolve, reject) => {
        reject({ message: errorMessage, params });
      });
    }
  }

  public dispatchTypedText = (typedText: string): void => {
    this.typingStatusSubscription.dispatchTypedText(typedText);
  };

  public onMessage = (callback: (message: IElixirChatReceivedMessage) => void): void => {
    this.onMessageCallbacks.push(callback);
  };

  public onTyping = (callback: (peopleWhoAreTyping: Array<IElixirChatUser>) => void): void => {
    this.onTypingCallbacks.push(callback);
  };

  public onOperatorOnlineStatusChange = (callback: (isOnline: boolean) => void): void => {
    this.onOperatorOnlineStatusChangeCallbacks.push(callback);
  };

  public reconnect = ({ room, client }: { room?: IElixirChatRoom, client?: IElixirChatUser }): Promise<void> => {
    logEvent(this.debug, 'Attempting to reconnect to another room', { room, client });
    if (room) {
      this.room = room;
    }
    if (client) {
      this.client = client;
    }

    this.isPrivate = !room || !room.id;

    this.setDefaultConfigValues();
    this.messagesSubscription.unsubscribe();
    this.operatorOnlineStatusSubscription.unsubscribe();
    return this.connectToRoom().then(() => {
      this.saveRoomClientToLocalStorage(this.room, this.client);
      this.subscribeToNewMessages();
      this.subscribeToOperatorOnlineStatusChange();
      this.typingStatusSubscription.resubscribeToAnotherRoom(this.room.id);
    });
  };

  public onConnectSuccess = (callback: () => void): void => {
    this.onConnectSuccessCallbacks.push(callback);
  };

  public onConnectError = (callback: () => void): void => {
    this.onConnectErrorCallbacks.push(callback);
  };

  public takeScreenshot = (): Promise<IElixirChatScreenshot> => {
    return this.screenshotTaker.takeScreenshot()
      .then(screenshot => {
        logEvent(this.debug, 'Captured screenshot', screenshot);
        return screenshot;
      })
      .catch(e => {
        logEvent(this.debug, 'Could not capture screenshot', e, 'error');
        throw e;
      });
  };

  public fetchMessageHistory = (limit: number, beforeCursor?: string): Promise<[IElixirChatReceivedMessage]> => {
    return this.messagesSubscription.fetchMessageHistory(limit, beforeCursor)
      .then(messages => {
        logEvent(this.debug, 'Fetched message history', { limit, beforeCursor, messages });
        return messages;
      })
      .catch(data => {
        logEvent(this.debug, 'Could not fetch message history', data, 'error');
        throw data;
      });
  };
}


if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
