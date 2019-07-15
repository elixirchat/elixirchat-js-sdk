import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { GraphQLClient, prepareGraphQLQuery, simplifyGraphQLJSON } from './GraphQLClient';

export interface INewMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  responseToMessage: {
    id: string;
    text: string;
    sender: {
      id: string;
      firstName?: string;
      lastName?: string;
    };
  } | null;
}

export interface ISentMessage {
  text?: string,
  attachments?: Array<File>,
  responseToMessageId?: string,
}

export interface IMessagesSubscriptionConfig {
  apiUrl: string,
  socketUrl: string,
  token: string,
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onMessage: (message: INewMessage) => void;
}

export class MessagesSubscription {

  public apiUrl: string;
  public socketUrl: string;
  public token: string;
  public onSubscribeSuccess?: (data: any) => void;
  public onSubscribeError?: (data: any) => void;
  public onMessage: (message: INewMessage) => void;

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
                __typename
                ... on Client { id foreignId firstName lastName }
                ... on Employee { id firstName lastName }
              }
            }
          }
        }
        sender {
          __typename
          ... on Client { id foreignId firstName lastName }
          ... on Employee { id firstName lastName }
        }
      }
    }
  `;

  protected sendMessageQuery: string = `
    sendMessage {
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
              __typename
              ... on Client { id foreignId firstName lastName }
              ... on Employee { id firstName lastName }
            }
          }
        }
      }
      sender {
        __typename
        ... on Client { id foreignId firstName lastName }
        ... on Employee { id firstName lastName }
      }
    }
  `;

  protected messageHistoryQuery: string = `
    messages {
      edges {
        cursor
        node {
          id
          text
          system
          timestamp
          data {
            ... on SystemMessageData {
              format
              type
              author { id firstName lastName }
            }
            ... on NotSystemMessageData {
              responseToMessage {
                id
                text
                sender {
                  __typename
                  ... on Client { id foreignId firstName lastName }
                  ... on Employee { id firstName lastName }
                }
              }
            }
          }
          sender {
            __typename
            ... on Client { id foreignId firstName lastName }
            ... on Employee { id firstName lastName }
          }
        }
      }
    }
  `;

  protected notifier: any;
  protected absintheSocket: any;
  protected graphQLClient: any;

  constructor(config: IMessagesSubscriptionConfig) {
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
    this.onSubscribeError({
      error,
      variables: { methodName },
      graphQLQuery: this.subscriptionQuery
    });
  }

  public unsubscribe = (): void => {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    this.absintheSocket = AbsintheSocket.cancel(this.absintheSocket, this.notifier)
  };

  public sendMessage = ({ text, responseToMessageId }: ISentMessage): Promise<void> => {
    // TODO: send attachments
    const variables: ISentMessage = {
      text: text,
      responseToMessageId: typeof responseToMessageId === 'string' ? responseToMessageId : null,
    };
    const query = prepareGraphQLQuery('mutation', this.sendMessageQuery, variables);

    return new Promise((resolve, reject) => {
      if (variables.text) {
        this.graphQLClient
          .query(query, variables)
          .then(data => {
            if (data && data.sendMessage) {
              resolve(data.sendMessage);
            }
            else {
              reject({ error: data, variables, graphQLQuery: query });
            }
          })
          .catch(error => {
            reject({ error, variables, graphQLQuery: query });
          });
      }
    });
  };

  public fetchMessageHistory = (limit: number, beforeCursor: string): Promise<[INewMessage]> => {
    const variables = {
      first: limit,
      before: beforeCursor,
    };
    const query = prepareGraphQLQuery('query', this.messageHistoryQuery, variables, { before: 'ID' });

    return new Promise((resolve, reject) => {
      this.graphQLClient.query(query, variables)
        .then(response => {
          if (response.messages) {
            let messages = <[INewMessage]>simplifyGraphQLJSON(response.messages);
            if (beforeCursor) {
              messages = <[INewMessage]>messages.slice(1);
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
