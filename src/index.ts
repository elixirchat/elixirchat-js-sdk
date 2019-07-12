import { uniqueNamesGenerator } from 'unique-names-generator';
import { logEvent, capitalize } from './utils';
import { MessagesSubscription } from './MessagesSubscription';
import {reject} from 'q';


// TODO: remove
(<any>Window).__uniqueNamesGenerator = uniqueNamesGenerator;


export type TGraphQLClientConfig = {
  url: string;
  token?: string;
};

export class GraphQLClient {

  public url: string;
  public token?: string;

  protected headers: any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  constructor({url, token}: TGraphQLClientConfig){
    this.url = url;
    this.token = token;
    if (this.token) {
      this.headers.Authorization = `Bearer ${this.token}`;
    }
  }

  public query(query: string, variables?: object){
    return new Promise((resolve, reject) => {
      fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query, variables })
      })
        .then(response => response.json())
        .then(response => {
          if (response.errors) {
            reject(response);
          }
          else {
            resolve(response.data);
          }
        })
        .catch(response => reject(response));
    });
  }
}



const API_REFERENCE_URL = 'https://github.com/elixirchat/elixirchat-widget/tree/sdk';

export type TElixirChatRoom = {
  id: string;
  title?: string;
};

export type TElixirChatUser = {
  id: string;
  firstName?: string;
  lastName?: string;
};

export type TElixirChatConfig = {
  apiUrl: string;
  socketUrl: string;
  companyId: string;
  room?: TElixirChatRoom;
  client?: TElixirChatUser;
  debug?: boolean,
}

export type TElixirChatReceivedMessage = {
  id: string;
  text: string;
  timestamp: string;
  sender: TElixirChatUser;
  responseToMessage: {
    id: string;
    text: string;
    sender: TElixirChatUser;
  } | null;
}

export type TElixirChatSentMessage = {
  text?: string,
  attachments?: Array<File>,
  responseToMessageId?: string,
};

export class ElixirChat {
  public apiUrl: string;
  public socketUrl: string;
  public companyId: string;
  public room?: TElixirChatRoom;
  public client?: TElixirChatUser;

  public debug: boolean;
  protected authToken: string;

  protected graphQLClient: any;
  protected messagesSubscription: any;

  protected joinRoomQuery: string = `
    mutation ($companyId: ID!, $room: ForeignRoom!, $client: ForeignClient!) {
      joinRoom(companyId: $companyId, room: $room, client: $client) {
        token
        room {
          id
          title
          foreignId
          members {
            client {
              id
              firstName
              lastName
              foreignId
            }
          }
        }
      }
    }
  `;

  protected onMessageCallbacks: Array<(message: TElixirChatReceivedMessage) => void> = [];
  protected onConnectSuccessCallbacks: Array<(data?: any) => void> = [];
  protected onConnectErrorCallbacks: Array<(e: any) => void> = [];
  protected onTypingCallbacks: Array<(user: TElixirChatUser) => void> = [];

  constructor(config: TElixirChatConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.companyId = config.companyId;
    this.room = config.room;
    this.client = config.client;
    this.debug = config.debug || false;
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
      companyId: this.companyId,
      room: this.room,
      client: this.client,
      debug: this.debug,
    });
    this.setDefaultConfigValues();
    this.connectToRoom().then(() => {
      this.subscribeToNewMessages();
    });
  }

  protected getDefaultClientData(): TElixirChatUser {
    const baseTitleArr = uniqueNamesGenerator({ length: 2, separator: ' ' }).split(' ');
    const displayTitle = baseTitleArr.map(capitalize);
    const fourDigitPostfix = (Array(4).join('0') + Math.random()).slice(-4);
    const uniqueId = baseTitleArr.join('-') + '-' + fourDigitPostfix;
    return {
      id: uniqueId,
      firstName: displayTitle[0],
      lastName: displayTitle[1]
    }
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

    const roomId = room.id || defaultClientData.id;
    const roomTitle = room.title || defaultClientData.firstName + ' ' + defaultClientData.lastName;
    this.room = {
      id: roomId,
      title: roomTitle,
    };

    logEvent(this.debug, 'Set room and client values', {
      room: this.room,
      client: this.client,
    });
  };

  protected connectToRoom(): Promise<void> {
    this.graphQLClient = new GraphQLClient({ url: this.apiUrl });

    return new Promise((resolve, reject) => {
      this.graphQLClient.query(this.joinRoomQuery, {
        companyId: this.companyId,
        room: this.room,
        client: this.client,
      })
        .then((data: any) => {
          if (data && data.joinRoom) {
            logEvent(this.debug, 'Joined room', data.joinRoom);
            this.authToken = data.joinRoom.token;
            resolve(data.joinRoom);
          }
          else {
            logEvent(this.debug, 'Failed to join room', data, 'error');
            this.onConnectErrorCallbacks.forEach(callback => callback(data));
            reject(data);
          }
        }).catch((response: any) => {
          logEvent(this.debug, 'Failed to join room', response, 'error');
          this.onConnectErrorCallbacks.forEach(callback => callback(response));
          reject(response);
        });
    });
  }

  protected subscribeToNewMessages(): void {
    this.messagesSubscription = new MessagesSubscription({
      socketUrl: this.socketUrl,
      apiUrl: this.apiUrl,
      token: this.authToken,
      onSubscribeSuccess: () => {
        const roomData = {
          room: this.room,
          client: this.client,
        };
        logEvent(this.debug, 'Successfully subscribed to messages', roomData);
        this.onConnectSuccessCallbacks.forEach(callback => callback(roomData));
      },
      onSubscribeError: (data) => {
        logEvent(this.debug, 'Failed to subscribe to messages', data, 'error');
        this.onConnectErrorCallbacks.forEach(callback => callback(data));
      },
      onMessage: (response: any) => {
        const message : TElixirChatReceivedMessage = {
          id: response.id,
          text: response.text,
          sender: response.sender,
          timestamp: response.timestamp,
          responseToMessage: response.data.responseToMessage,
        };
        logEvent(this.debug, 'Received new message', message);
        this.onMessageCallbacks.forEach(callback => callback(message));
      }
    });
  }

  public sendMessage(params: TElixirChatSentMessage): Promise<void> {
    const {
      text,
      attachments,
      responseToMessageId,
    } = params;

    if (text.trim() || (attachments && attachments.length)) {
      logEvent(this.debug, 'Sending a message', params);
      return this.messagesSubscription.sendMessage(text, responseToMessageId);
    }
    else {
      const errorMessage = 'Either "text" or "attachment" property must not be empty';
      logEvent(this.debug, errorMessage, params, 'error');
      return new Promise((resolve, reject) => {
        reject({ message: errorMessage, params });
      });
    }
  }

  public onMessage = (callback: (message: TElixirChatReceivedMessage) => void): void => {
    this.onMessageCallbacks.push(callback);
  };

  public onTyping = (callback: (peopleWhoAreTyping: TElixirChatUser) => void): void => {
    this.onTypingCallbacks.push(callback);
  };

  public reconnect = ({ room, client }: { room?: TElixirChatRoom, client?: TElixirChatUser }): Promise<void> => {
    logEvent(this.debug, 'Attempting to reconnect to another room', { room, client });
    if (room) {
      this.room = room;
    }
    if (client) {
      this.client = client;
    }
    this.setDefaultConfigValues();
    this.messagesSubscription.unsubscribe();
    return this.connectToRoom().then(() => {
      this.subscribeToNewMessages();
    });
  };

  public onConnectSuccess = (callback: () => void): void => {
    this.onConnectSuccessCallbacks.push(callback);
  };

  public onConnectError = (callback: () => void): void => {
    this.onConnectErrorCallbacks.push(callback);
  };

  public makeScreenshot = (): Promise<void> => {
    // TODO: fix
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  public fetchMessageHistory = (): Promise<[TElixirChatReceivedMessage]> => {
    return new Promise((resolve, reject) => {
      resolve([{
        a: 5
      }]);
    });
  };
}
