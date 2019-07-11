import nanoid from 'nanoid';
import { uniqueNamesGenerator } from 'unique-names-generator';
import { handleAPIError, logEvent, capitalize } from './utils';
import { MessagesSubscription } from './MessagesSubscription';

window.__nanoid = nanoid;
window.__uniqueNamesGenerator = uniqueNamesGenerator;


type GraphQLClientParams = {
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

  constructor({url, token}: GraphQLClientParams){
    this.url = url;
    this.token = token;
    if (this.token) {
      this.headers.Authorization = `Bearer ${this.token}`;
    }
  }

  public query(query: string, variables?: any){
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



const graphQLClient = new GraphQLClient({
  url: 'http://localhost:4000',
});




const API_REFERENCE_URL = 'https://github.com/elixirchat/elixirchat-widget/tree/sdk';

type ElixirChatRoom = {
  id: string,
  title?: string,
};

type ElixirChatUser = {
  id: string,
  firstName?: string,
  lastName?: string,
};

type ElixirChatConfig = {
  apiUrl: string;
  socketUrl: string;
  companyId: string,
  room?: ElixirChatRoom,
  client?: ElixirChatUser,
  debug?: boolean,
}

type ReceivedMessage = {
  id: string,
  text: string,
  timestamp: string,
  sender: ElixirChatUser,
  replyByMessageId: {
    id: string,
    text: string,
    sender: ElixirChatUser,
  }
};

type SentMessage = {
  text?: string,
  attachments?: Array<File>,
  replyByMessageId?: string,
};

export class ElixirChat {

  public apiUrl: string;
  public socketUrl: string;
  public companyId: string;
  public room?: ElixirChatRoom;
  public client?: ElixirChatUser;

  public debug: boolean;
  protected authToken: string;

  protected graphQLClient: any;
  protected messagesSubscription: any;

  // mutation ($companyId: ID!, $roomId: ID!, $roomTitle: String!, $clientId: ID!, $clientFirstName: String!, $clientLastName: String!) {
  // joinRoom(companyId: $companyId, room: {id: $roomId, title: $roomTitle}, client: {id: $clientId, firstName: $clientFirstName, lastName: $clientLastName}) {

  // TODO: more efficient query API
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

  protected onMessageCallbacks: Array<(message: ReceivedMessage) => void> = [];
  protected onConnectCallbacks: Array<() => void> = [];
  protected onTypingCallbacks: Array<(user: ElixirChatUser) => void> = [];

  constructor(config: ElixirChatConfig) {
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
      console.error(`Required parameter companyId is not provided:\nSee more: ${API_REFERENCE_URL}#config-companyid`);
      return;
    }
    this.setDefaultVariableValues();
    this.connectToRoom().then(() => {
      this.subscribeToNewMessages();
    });
  }

  protected getDefaultClientData(): ElixirChatUser {
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

  protected setDefaultVariableValues(): void {
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
            reject(data);
          }
        }).catch((response: any) => {
          logEvent(this.debug, 'Failed to join room', response, 'error');
          reject(response);
        });
    });
  }

  protected subscribeToNewMessages(): void {
    this.messagesSubscription = new MessagesSubscription({
      socketUrl: this.socketUrl,
      apiUrl: this.apiUrl,
      token: this.authToken,
      onSubscribeSuccess: (data) => { console.log('%c onSubscribeSuccess', 'color: green;', data); },
      onSubscribeError: (data) => { console.log('%c onSubscribeError', 'color: green;', data); },
      onMessage: (data) => { console.log('%c onMessage', 'color: green;', data); }
    });
  }

  public sendMessage({ text, attachments, replyByMessageId }: SentMessage): Promise<void> {
    return this.messagesSubscription.sendMessage(text); // TODO: reply by id
  }

  public onMessage(callback: (message: ReceivedMessage) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  public onTyping(callback: (peopleWhoAreTyping: ElixirChatUser) => void): void {
    this.onTypingCallbacks.push(callback);
  }

  public makeScreenshot(): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  public reconnect({ room, client }: { room?: ElixirChatRoom, client?: ElixirChatUser }): Promise<void> {
    return new Promise(() => {});
  }

  public onConnect(callback: () => void): void {
    this.onConnectCallbacks.push(callback);
  }
}
