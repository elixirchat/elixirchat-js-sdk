import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { parseGraphQLMethodFromQuery } from './GraphQLClient';

export interface IGraphQLClientSocketConfig {
  url: string;
  token?: string;
}

export interface IGraphQLClientSocketSubscribeParams {
  query: string;
  onAbort: (error: any) => {};
  onStart: () => {};
  onResult: (response: any) => {};
}

export class GraphQLClientSocket {

  public url: string;
  public token?: string;
  protected notifiers: object = {};
  protected absintheSocket: any;

  initialize = ({ url, token }: IGraphQLClientSocketConfig) => {
    this.url = url;
    this.token = token;
    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(this.url, {
        params: {
          token: this.token
        }
      })
    );
  };

  subscribe = (params: IGraphQLClientSocketSubscribeParams) => {
    const { query, onAbort, onStart, onResult } = params;
    const subscriptionName = parseGraphQLMethodFromQuery(query);

    if (this.notifiers[subscriptionName]) {
      this.unsubscribe(subscriptionName);
    }
    const notifier = AbsintheSocket.send(this.absintheSocket, { operation: query });
    AbsintheSocket.observe(this.absintheSocket, notifier, {
      onStart: onStart || function () {},
      onAbort: onAbort || function () {},
      onResult: onResult || function () {},
    });
    this.notifiers[subscriptionName] = notifier;
  };

  unsubscribe = (query) => {
    const subscriptionName = parseGraphQLMethodFromQuery(query);
    if (this.notifiers[subscriptionName]) {
      AbsintheSocket.cancel(this.absintheSocket, this.notifiers[subscriptionName]);
      delete this.notifiers[subscriptionName];
    }
  };

  destroy = () => {
    for (let subscriptionName in this.notifiers) {
      AbsintheSocket.cancel(this.absintheSocket, this.notifiers[subscriptionName]);
      delete this.notifiers[subscriptionName];
    }
    this.url = null;
    this.token = null;
    this.absintheSocket = null;
  };
}



// export class GraphQLClientSocket2222 {
//
//   public socketUrl: string;
//   public authToken: string;
//   public query: string = '';
//   public onAbort: (error: any) => {};
//   public onStart: () => {};
//   public onResult: (response: any) => {};
//
//   protected notifier: any;
//   protected absintheSocket: any;
//   protected isCurrentlySubscribed = false;
//
//   constructor(config: IGraphQLClientSocketConfig) {
//     this.socketUrl = config.socketUrl;
//     this.authToken = config.authToken;
//     this.query = config.query;
//     this.onAbort = config.onAbort || function () {};
//     this.onStart = config.onStart || function () {};
//     this.onResult = config.onResult || function () {};
//
//     this.initializeSocket();
//     this.initializeObserver();
//   }
//
//   public initialize(){};
//
//   protected initializeSocket(): void {
//     this.absintheSocket = AbsintheSocket.create(
//       new Phoenix.Socket(this.socketUrl, {
//         params: {
//           token: this.authToken
//         }
//       })
//     );
//     this.notifier = AbsintheSocket.send(this.absintheSocket, {
//       operation: this.query,
//     });
//   };
//
//   protected initializeObserver(): void {
//     AbsintheSocket.observe(this.absintheSocket, this.notifier, {
//       onStart: () => {
//         if (!this.isCurrentlySubscribed) {
//           this.isCurrentlySubscribed = true;
//           this.onStart();
//         }
//       },
//       onAbort: this.onAbort,
//       onResult: this.onResult,
//     });
//   };
//
//   public unsubscribe = (): void => {
//     AbsintheSocket.cancel(this.absintheSocket, this.notifier);
//     this.notifier = null;
//     this.absintheSocket = null;
//     this.isCurrentlySubscribed = false;
//   };
// }
