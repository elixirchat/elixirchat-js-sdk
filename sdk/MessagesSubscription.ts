import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { serializeMessage, IMessage } from './serializers/serializeMessage';
import { GraphQLClient, simplifyGraphQLJSON } from './GraphQLClient';
import { gql } from '../utilsCommon';

export interface ISentMessage {
  text?: string,
  attachments?: Array<File>,
  responseToMessageId?: string,
}

export interface IMessagesSubscriptionConfig {
  apiUrl: string,
  socketUrl: string,
  token: string,
  currentClientId: string;
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onMessage: (message: IMessage) => void;
}

export class MessagesSubscription {

  public apiUrl: string;
  public socketUrl: string;
  public token: string;
  public currentClientId: string;
  public onSubscribeSuccess?: (data: any) => void;
  public onSubscribeError?: (data: any) => void;
  public onMessage: (message: IMessage) => void;

  protected notifier: any;
  protected absintheSocket: any;
  protected graphQLClient: any;

  protected latestMessageHistoryCursorsCache: Array<IMessage> = [];
  protected reachedBeginningOfMessageHistory: boolean = false;
  protected isBeforeUnload: boolean = false;

  protected subscriptionQuery: string = gql`
    subscription {
      newMessage {
        id
        text
        timestamp
        attachments {
          id
          url
          name
          bytesSize
          height
          width
          contentType
          thumbnails { id url name bytesSize height width contentType thumbType }
        }
        data {
          ... on NotSystemMessageData {
            responseToMessage {
              id
              text
              sender {
                __typename
                ... on Client { id foreignId firstName lastName }
                ... on CompanyEmployee {
                  id
                  employee {
                    firstName lastName
                  }
                }
              }
            }
          }
        }
        sender {
          __typename
          ... on Client { id foreignId firstName lastName }
          ... on CompanyEmployee {
            id
            employee {
              firstName lastName
            }
          }
        }
      }
    }
  `;

  protected sendMessageQuery: string = gql`
    mutation ($text: String!, $responseToMessageId: ID, $attachments: [Upload!]) {
      sendMessage(text: $text, responseToMessageId: $responseToMessageId, attachments: $attachments) {
        id
        text
        timestamp
        attachments {
          id
          url
          name
          bytesSize
          height
          width
          contentType
          thumbnails { id url name bytesSize height width contentType thumbType }
        }
        data {
          ... on NotSystemMessageData {
            responseToMessage {
              id
              text
              sender {
                __typename
                ... on Client { id foreignId firstName lastName }
                ... on CompanyEmployee {
                  id
                  employee { firstName lastName }
                }
              }
            }
          }
        }
        sender {
          __typename
          ... on Client { id foreignId firstName lastName }
          ... on CompanyEmployee {
            id
            employee { firstName lastName }
          }
        }
      }
    }
  `;

  protected messageHistoryQuery: string = gql`
    query ($beforeCursor: String, $limit: Int!) {
      messages(before: $beforeCursor, last: $limit) {
        edges {
          cursor
          node {
            id
            text
            timestamp
            attachments {
              id
              url
              name
              bytesSize
              height
              width
              contentType
              thumbnails { id url name bytesSize height width contentType thumbType }
            }
            data {
              ... on NotSystemMessageData {
                responseToMessage {
                  id
                  text
                  sender {
                    __typename
                    ... on Client { id foreignId firstName lastName }
                    ... on CompanyEmployee {
                      id
                      employee { firstName lastName }
                    }
                  }
                }
              }
            }
            sender {
              __typename
              ... on Client { id foreignId firstName lastName }
              ... on CompanyEmployee {
                id
                employee { firstName lastName }
              }
            }
          }
        }
      }
    }
  `;

  constructor(config: IMessagesSubscriptionConfig) {
    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.token = config.token;
    this.currentClientId = config.currentClientId;
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
          const message = serializeMessage(data.newMessage, {
            apiUrl: this.apiUrl,
            currentClientId: this.currentClientId,
          });
          this.onMessage(message);
        }
      },
    })
  }

  protected onSubscribeFail(error: any, methodName: string): void {
    this.onSubscribeError({
      error,
      variables: { methodName },
      graphQLQuery: this.subscriptionQuery
    });
  }

  public unsubscribe = (): void => {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    this.absintheSocket = AbsintheSocket.cancel(this.absintheSocket, this.notifier);
    this.latestMessageHistoryCursorsCache = [];
    this.reachedBeginningOfMessageHistory = false;
  };

  public sendMessage = ({ text, attachments, responseToMessageId }: ISentMessage): Promise<IMessage> => {
    const query = this.sendMessageQuery;
    const variables = {
      text,
      attachments,
      responseToMessageId,
    };

    return new Promise((resolve, reject) => {
      this.graphQLClient
        .query(query, variables, { asFormData: true })
        .then(data => {
          if (data && data.sendMessage) {
            const message = serializeMessage(data.sendMessage, {
              apiUrl: this.apiUrl,
              currentClientId: this.currentClientId,
            });
            resolve(message);
          }
          else {
            reject({ error: data, variables, query });
          }
        })
        .catch(error => {
          reject({ error, variables, query });
        });
    });
  };

  public fetchMessageHistory = (limit: number, beforeCursor: string): Promise<[IMessage] | any[]> => {
    const query = this.messageHistoryQuery;
    const variables = { limit, beforeCursor };

    return new Promise((resolve, reject) => {
      if (this.reachedBeginningOfMessageHistory) {
        resolve([]);
        return;
      }

      this.graphQLClient.query(query, variables)
        .then(response => {
          if (response.messages) {

            const messages = <[IMessage]>simplifyGraphQLJSON(response.messages)
              .map(message => {
                return serializeMessage(message, {
                  apiUrl: this.apiUrl,
                  currentClientId: this.currentClientId,
                });
              })
              .filter(message => !this.latestMessageHistoryCursorsCache.includes(message.cursor));

            this.latestMessageHistoryCursorsCache = [
              ...messages.map(message => message.cursor),
              ...this.latestMessageHistoryCursorsCache,
            ].slice(0, limit);

            if (messages.length < limit) {
              this.reachedBeginningOfMessageHistory = true;
            }
            resolve(messages);
          }
          else {
            reject({ response, limit, beforeCursor, query, variables });
          }
        })
        .catch(error => {
          reject({ error, limit, beforeCursor, query, variables });
        });
    });
  };
}
