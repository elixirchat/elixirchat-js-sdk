import { uniqueNamesGenerator } from 'unique-names-generator';
import { logEvent, capitalize } from './utils';
import { MessagesSubscription, INewMessage, ISentMessage } from './MessagesSubscription';
import {
  GraphQLClient,
  prepareGraphQLQuery,
  simplifyGraphQLJSON,
} from './GraphQLClient';
import { ScreenshotTaker } from './ScreenshotTaker';
import {reject} from 'q';

export const API_REFERENCE_URL = 'https://github.com/elixirchat/elixirchat-widget/tree/sdk';

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

export interface IElixirChatReceivedMessage extends INewMessage {}
export interface IElixirChatSentMessage extends ISentMessage {}

export class ElixirChat {
  public apiUrl: string;
  public socketUrl: string;
  public companyId: string;
  public room?: IElixirChatRoom;
  public client?: IElixirChatUser;

  public debug: boolean;
  protected authToken: string;

  protected graphQLClient: any;
  protected messagesSubscription: any;
  protected screenshotTaker: any;

  protected joinRoomQuery: string = `
    joinRoom {
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
  `;

  protected roomMessagesQuery: string = `
    messages {
      edges {
        cursor
        node {
          id
          text
          system
          timestamp
          data {
            ... on SystemMessageData {
              format
              type
              author { id firstName lastName }
            }
            ... on NotSystemMessageData {
              responseToMessage {
                id
                text
                sender {
                  ... on Client { id firstName lastName }
                  ... on Employee { id firstName lastName }
                }
              }
            }
          }
          sender {
            ... on Client { id firstName lastName }
            ... on Employee { id firstName lastName }
          }
        }
      }
    }
  `;

  protected onMessageCallbacks: Array<(message: IElixirChatReceivedMessage) => void> = [];
  protected onConnectSuccessCallbacks: Array<(data?: any) => void> = [];
  protected onConnectErrorCallbacks: Array<(e: any) => void> = [];
  protected onTypingCallbacks: Array<(user: IElixirChatUser) => void> = [];

  constructor(config: IElixirChatConfig) {
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
    this.screenshotTaker = new ScreenshotTaker();
    this.setDefaultConfigValues();
    this.connectToRoom().then(() => {
      this.subscribeToNewMessages();
    });
  }

  protected getDefaultClientData(): IElixirChatUser {
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
    const variables = {
      companyId: this.companyId,
      room: this.room,
      client: this.client,
    };
    const query = prepareGraphQLQuery('mutation', this.joinRoomQuery, variables, {
      companyId: 'ID',
      room: 'ForeignRoom',
      client: 'ForeignClient',
    });
    return new Promise((resolve, reject) => {
      this.graphQLClient.query(query, variables)
        .then((data: any) => {
          if (data && data.joinRoom) {
            logEvent(this.debug, 'Joined room', data.joinRoom);
            this.authToken = data.joinRoom.token;
            resolve(data.joinRoom);
          }
          else {
            logEvent(this.debug, 'Failed to join room', { data, query, variables }, 'error');
            this.onConnectErrorCallbacks.forEach(callback => callback(data));
            reject(data);
          }
        }).catch((response: any) => {
          logEvent(this.debug, 'Failed to join room', { response, query, variables }, 'error');
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
        logEvent(this.debug, 'Failed to subscribe to messages', { data }, 'error');
        this.onConnectErrorCallbacks.forEach(callback => callback(data));
      },
      onMessage: (response: any) => {
        const message : IElixirChatReceivedMessage = {
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

  public sendMessage(params: IElixirChatSentMessage): Promise<void> {
    const { text, attachments } = params;

    if (text.trim() || (attachments && attachments.length)) {
      return this.messagesSubscription.sendMessage(params)
        .then(message => {
          logEvent(this.debug, 'Sent message', { message, params });
        })
        .catch(error => {
          logEvent(this.debug, 'Failed to send message', error, 'error');
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

  public onMessage = (callback: (message: IElixirChatReceivedMessage) => void): void => {
    this.onMessageCallbacks.push(callback);
  };

  public onTyping = (callback: (peopleWhoAreTyping: IElixirChatUser) => void): void => {
    this.onTypingCallbacks.push(callback);
  };

  public reconnect = ({ room, client }: { room?: IElixirChatRoom, client?: IElixirChatUser }): Promise<void> => {
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

  public takeScreenshot = (): Promise<void> => {
    return this.screenshotTaker.takeScreenshot()
      .then(screenshot => {
        logEvent(this.debug, 'Captured screenshot', screenshot);
      })
      .catch(e => {
        logEvent(this.debug, 'Could not capture screenshot', e, 'error');
      });
  };

  // TODO: replace 'before' w/ message indexes on backend?
  public fetchMessageHistory = (limit: number, beforeCursor: string): Promise<[IElixirChatReceivedMessage]> => {
    const variables = {
      first: limit,
      before: beforeCursor,
    };
    const query = prepareGraphQLQuery('query', this.roomMessagesQuery, variables, { before: 'ID' });

    return new Promise((resolve) => {
      this.graphQLClient.query(query, variables, this.authToken)
        .then(response => {
          if (response.messages) {
            const messages = simplifyGraphQLJSON(response.messages);
            logEvent(this.debug, 'Fetched message history', { limit, beforeCursor, messages });
            resolve(messages);
          }
          else {
            logEvent(this.debug, 'Could not fetch message history', { limit, beforeCursor, response, query, variables }, 'error');
            reject(response);
          }
        })
        .catch(error => {
          logEvent(this.debug, 'Fetching message history returned an error', { limit, beforeCursor, error, query, variables }, 'error');
          reject(error);
        });
    });
  };
}
