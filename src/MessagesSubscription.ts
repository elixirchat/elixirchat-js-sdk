import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { GraphQLClient, TElixirChatReceivedMessage } from './index';
import { handleAPIError } from './utils';

type TNewMessage = TElixirChatReceivedMessage;

type TMessagesSubscriptionConfig = {
  apiUrl: string,
  socketUrl: string,
  token: string,
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onMessage: (message: TNewMessage) => void;
};

export class MessagesSubscription {

  public apiUrl: string;
  public socketUrl: string;
  public token: string;
  public onSubscribeSuccess?: (data: any) => void;
  public onSubscribeError?: (data: any) => void;
  public onMessage: (message: TNewMessage) => void;

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
    mutation ($text: String!, $responseToMessageId: ID) {
      sendMessage(text: $text, responseToMessageId: $responseToMessageId) {
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

  protected notifier: any;
  protected absintheSocket: any;
  protected graphQLClient: any;

  constructor(config: TMessagesSubscriptionConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.token = config.token;
    this.onSubscribeSuccess = config.onSubscribeSuccess || function () {};
    this.onSubscribeError = config.onSubscribeError || function () {};
    this.onMessage = config.onMessage;
    this.initialize();
  }

  protected initialize(): void {
    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(this.socketUrl, {params: {
        token: this.token
      }})
    );
    this.graphQLClient = new GraphQLClient({
      url: this.apiUrl,
      token: this.token,
    });
    window.addEventListener('beforeunload', this.onBeforeUnload);
    this.subscribe();
  }

  protected onBeforeUnload = (): boolean => {
    this.isBeforeUnload = true;
    return false;
  };

  protected subscribe(): void {
    const notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.subscriptionQuery,
    });
    AbsintheSocket.observe(this.absintheSocket, notifier, {
      onAbort: e => this.onSubscribeFail(e, 'onAbort'),
      onError:  e => {
        if (!this.isBeforeUnload) {
          this.onSubscribeFail(e, 'onError');
        }
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

  protected onSubscribeFail(error: any, methodName: string): void {
    handleAPIError({
      error,
      variables: { methodName },
      graphQlQuery: this.subscriptionQuery
    });
    this.onSubscribeError(error);
  }

  public unsubscribe = (): void => {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    this.absintheSocket = AbsintheSocket.cancel(this.absintheSocket, this.notifier)
  };

  public sendMessage = (text: string = '', responseToMessageIdRaw: string): Promise<void> => {
    const responseToMessageId = typeof responseToMessageIdRaw === 'string' ? responseToMessageIdRaw : null;
    return new Promise((resolve, reject) => {
      if (text.trim()) {
        this.graphQLClient
          .query(this.sendMessageQuery, { text, responseToMessageId })
          .then(data => {
            if (data && data.sendMessage) {
              resolve(data.sendMessage);
            }
            else {
              handleAPIError({
                error: data,
                variables: { text, responseToMessageId },
                graphQlQuery: this.subscriptionQuery
              });
              reject(data);
            }
          })
          .catch(error => {
            handleAPIError({
              error,
              variables: { text, responseToMessageId },
              graphQlQuery: this.subscriptionQuery
            });
            reject(error);
          });
      }
    });
  };
}
