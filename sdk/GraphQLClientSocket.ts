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
