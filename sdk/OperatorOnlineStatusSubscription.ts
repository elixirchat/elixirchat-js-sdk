import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { gql } from './GraphQLClient';


export interface IOperatorOnlineStatusSubscriptionConfig {
  isOnline: boolean,
  socketUrl: string,
  token: string,
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onUnsubscribe?: () => void;
  onStatusChange: (isOnline: boolean) => void;
}

export class OperatorOnlineStatusSubscription {

  public isOnline: boolean;
  public socketUrl: string;
  public token: string;
  public onSubscribeSuccess?: (data: any) => void;
  public onSubscribeError?: (data: any) => void;
  public onUnsubscribe?: () => void;
  public onStatusChange: (inOnline: boolean) => void;

  protected notifier: any;
  protected absintheSocket: any;
  protected isCurrentlySubscribed: boolean = false;

  protected subscriptionQuery: string = gql`
    subscription {
      updateCompanyWorking
    }
  `;

  constructor(config: IOperatorOnlineStatusSubscriptionConfig) {
    this.onSubscribeSuccess = config.onSubscribeSuccess || function () {};
    this.onSubscribeError = config.onSubscribeError || function () {};
    this.onUnsubscribe = config.onUnsubscribe || function () {};
    this.onStatusChange = config.onStatusChange;
    this.socketUrl = config.socketUrl;
    this.token = config.token;
    this.isOnline = config.isOnline;
    this.initialize();
  }

  protected initialize(): void {
    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(this.socketUrl, { params: { token: this.token }})
    );
    this.subscribe();
  }

  protected subscribe(): void {
    const notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.subscriptionQuery,
    });
    AbsintheSocket.observe(this.absintheSocket, notifier, {
      onAbort: e => this.onSubscribeAbort(e),
      onStart: notifier => {
        this.notifier = notifier;
        if (!this.isCurrentlySubscribed) {
          this.isCurrentlySubscribed = true;
          this.onSubscribeSuccess(notifier);
        }
      },
      onResult: ({ data }) => {
        const isOnline = data && data.updateCompanyWorking;
        this.onStatusChange(isOnline);
        this.isOnline = isOnline;
      },
    })
  }

  protected onSubscribeAbort(error: any): void {
    this.onSubscribeError({
      error,
      graphQLQuery: this.subscriptionQuery
    });
  }

  public unsubscribe = (): void => {
    this.absintheSocket = AbsintheSocket.cancel(this.absintheSocket, this.notifier);
    this.isCurrentlySubscribed = false;
    this.onUnsubscribe();
  };
}
