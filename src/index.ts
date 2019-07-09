import * as withAbsintheSocket from '@absinthe/socket';
import {Socket as PhoenixSocket} from 'phoenix';

const absintheSocket = withAbsintheSocket.create(
  new PhoenixSocket('ws://localhost:4000/socket')
);



type CompanyId = string;

type Room = {
  id: string,
  title?: string,
};

type User = {
  id: string,

  firstName?: string,
  lastName?: string,
};

type Config = {
  companyId: CompanyId,
  room?: Room,
  client?: User,
  debug?: boolean,
}

type ReceivedMessage = {
  id: string,
  text: string,
  timestamp: string,
  sender: User,
  replyByMessageId: {
    id: string,
    text: string,
    sender: User,
  }
};

type SentMessage = {
  text?: string,
  attachments?: Array<File>,
  replyByMessageId?: string,
};

export class ElixirChat {

  public companyId: CompanyId = '';
  public room?: Room = {
    id: '',
  };
  public client?: User = {
    id: '',
  };
  protected debug: boolean;

  protected onMessageCallbacks: Array<(message: ReceivedMessage) => void> = [];
  protected onConnectCallbacks: Array<() => void> = [];
  protected onTypingCallbacks: Array<(user: User) => void> = [];
  protected API_REFERENCE_URL: 'https://github.com/elixirchat/elixirchat-widget/tree/sdk';

  constructor(config: Config) {
    this.companyId = config.companyId;
    this.room = config.room;
    this.client = config.client;
    this.debug = config.debug || false;
    this.initialize();
  }

  protected initialize(): void {
    if (!this.companyId) {
      console.error(`Required parameter companyId is not provided:\nSee more: ${this.API_REFERENCE_URL}#config-companyid`);
      return;
    }
    this.connectToRoom();
  }

  protected connectToRoom(){
    console.log('___ connect to room', this);

    const query = `
      mutation ($companyId: ID!, $roomId: ID!, $roomTitle: String!) {
        joinRoom(companyId: $companyId, room: {id: $roomId, title: $roomTitle) {
          token
          room {
            id
            title
            foreignId
            members {
              id
              client {
               cid 
              }
            }
          }
        }
      }
    `;

    const notifier = withAbsintheSocket.send(absintheSocket, {
      operation: query,
      variables: {
        companyId: this.companyId,
        roomId: this.room.id,
        roomTitle: this.room.title,
      }
    });

    window.__notifier = notifier;
  }

  public sendMessage({ text, attachments, replyByMessageId }: SentMessage): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  public onMessage(callback: (message: ReceivedMessage) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  public onTyping(callback: (peopleWhoAreTyping: User) => void): void {
    this.onTypingCallbacks.push(callback);
  }

  public makeScreenshot(): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  public reconnect({ room, client }: { room?: Room, client?: User }): Promise<void> {
    return new Promise(() => {});
  }

  public onConnect(callback: () => void): void {
    this.onConnectCallbacks.push(callback);
  }
}
