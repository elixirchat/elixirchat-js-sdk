import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { GraphQLClient } from './index';
import { handleAPIError } from './utils';

type NewMessage = {
  id: string,
  text: string,
};

type MessagesSubscriptionConfig = {
  apiUrl: string,
  socketUrl: string,
  token: string,
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onMessage: (message: NewMessage) => void;
};

export class MessagesSubscription {

  public apiUrl: string;
  public socketUrl: string;
  public token: string;
  public onSubscribeSuccess?: (data: any) => void;
  public onSubscribeError?: (data: any) => void;
  public onMessage: (message: NewMessage) => void;

  protected isBeforeUnload: boolean = false;

  protected subscriptionQuery: string = `
    subscription {
      newMessage {
        id
        text
        system
        timestamp
        data {
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
  `;

  protected sendMessageQuery: string = `
    mutation ($text: String!) {
      sendMessage(text: $text) {
        id
        text
        sender {
          ... on Client { id firstName lastName }
        }
      }
    }
  `;

  protected notifier: any;
  protected absintheSocket: any;
  protected graphQLClient: any;

  constructor(config: MessagesSubscriptionConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.token = config.token;
    this.onSubscribeSuccess = config.onSubscribeSuccess || function () {};
    this.onSubscribeError = config.onSubscribeError || function () {};
    this.onMessage = config.onMessage;
    this.initialize();
  }

  protected initialize(){
    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(this.socketUrl, {params: {
        token: this.token
      }})
    );
    this.graphQLClient = new GraphQLClient({
      url: this.apiUrl,
      token: this.token,
    });
    this.subscribe();

    window.addEventListener('unload', (e) => {
      this.isBeforeUnload = true;
      console.error('___ isBeforeUnload', e);
    });
  }

  protected subscribe() {
    const notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.subscriptionQuery,
    });
    AbsintheSocket.observe(this.absintheSocket, notifier, {
      onAbort: e => this.onSubscribeFail(e, 'onAbort'),
      onError:  e => {
        console.warn('___ onError', this.isBeforeUnload);
        // if (e.message !== 'connection: close') {
        // }
        this.onSubscribeFail(e, 'onError');
      },
      onStart: notifier => {
        this.notifier = notifier;
        this.onSubscribeSuccess(notifier);
      },
      onResult: ({ data }) => {
        if (data && data.newMessage) {
          this.onMessage(data.newMessage);
        }
      },
    })
  }

  protected onSubscribeFail(error: any, methodName: string){
    handleAPIError({
      error,
      variables: { methodName },
      graphQlQuery: this.subscriptionQuery
    });
    this.onSubscribeError(error);
  }

  public unsubscribe() {
    this.absintheSocket = AbsintheSocket.cancel(this.absintheSocket, this.notifier)
  }

  public sendMessage(text: string = ''){

    // TODO: reply by id

    return new Promise((resolve, reject) => {
      if (text.trim()) {
        this.graphQLClient
          .query(this.sendMessageQuery, { text })
          .then(data => {
            if (data && data.sendMessage) {
              resolve(data.sendMessage);
            }
            else {
              handleAPIError({
                error: data,
                variables: { text },
                graphQlQuery: this.subscriptionQuery
              });
              reject(data);
            }
          })
          .catch(error => {
            handleAPIError({
              error,
              variables: { text },
              graphQlQuery: this.subscriptionQuery
            });
            reject(error);
          });
      }
    });
  };
}
