import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'

export interface IGraphQLClientSocketConfig {
  socketUrl: string;
  authToken: string;
  query: string;
  onAbort: (error: any) => {};
  onStart: () => {};
  onResult: (response: any) => {};
}

export class GraphQLClientSocket {

  public socketUrl: string;
  public authToken: string;
  public query: string = '';
  public onAbort: (error: any) => {};
  public onStart: () => {};
  public onResult: (response: any) => {};

  protected notifier: any;
  protected absintheSocket: any;
  protected isCurrentlySubscribed = false;

  constructor(config: IGraphQLClientSocketConfig) {
    this.socketUrl = config.socketUrl;
    this.authToken = config.authToken;
    this.query = config.query;
    this.onAbort = config.onAbort || function () {};
    this.onStart = config.onStart || function () {};
    this.onResult = config.onResult || function () {};

    this.initializeSocket();
    this.initializeObserver();
  }

  public unsubscribe = (): void => {
    AbsintheSocket.cancel(this.absintheSocket, this.notifier);
    this.notifier = null;
    this.absintheSocket = null;
    this.isCurrentlySubscribed = false;
  };

  protected initializeSocket(): void {
    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(this.socketUrl, {
        params: {
          token: this.authToken
        }
      })
    );
    this.notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.query,
    });
  };

  protected initializeObserver(): void {
    AbsintheSocket.observe(this.absintheSocket, this.notifier, {
      onStart: () => {
        if (!this.isCurrentlySubscribed) {
          this.isCurrentlySubscribed = true;
          this.onStart();
        }
      },
      onAbort: this.onAbort,
      onResult: this.onResult,
    });
  };
}
