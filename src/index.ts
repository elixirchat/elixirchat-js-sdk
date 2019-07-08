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
  public room: Room = {
    id: '',
  };
  public client: User = {
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
    this.debug = config.debug;
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

  }

  public sendMessage({ text, attachments, replyByMessageId }: SentMessage): Promise {
    return new Promise(() => {});
  }

  public onMessage(callback: (message: ReceivedMessage) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  public onTyping(callback: (peopleWhoAreTyping: User) => void): void {
    this.onTypingCallbacks.push(callback);
  }

  public makeScreenshot(): Promise {
    return new Promise((resolve, reject) => {
      resolve('...screenshot...');
    });
  }

  public reconnect({ room, client } = { room: Room | undefined, client: User | undefined }): Promise {
    return new Promise(() => {});
  }

  public onConnect(callback: () => void): void {
    this.onConnectCallbacks.push(callback);
  }
}
