import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { GraphQLClient, prepareGraphQLQuery, simplifyGraphQLJSON } from './GraphQLClient';

export interface INewMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: {
    elixirChatId: string;
    firstName?: string;
    lastName?: string;
    isAgent: boolean;
    isCurrentClient: boolean;
    id?: string;
  };
  cursor?: string;
  responseToMessage: {
    id: string;
    text: string;
    sender: {
      elixirChatId: string;
      firstName?: string;
      lastName?: string;
      isAgent: boolean;
      isCurrentClient: boolean;
      id?: string;
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
  currentClientId: string;
  onSubscribeSuccess?: (data: any) => void;
  onSubscribeError?: (data: any) => void;
  onMessage: (message: INewMessage) => void;
}

export class MessagesSubscription {

  public apiUrl: string;
  public socketUrl: string;
  public token: string;
  public currentClientId: string;
  public onSubscribeSuccess?: (data: any) => void;
  public onSubscribeError?: (data: any) => void;
  public onMessage: (message: INewMessage) => void;

  protected latestMessageHistoryCursorsCache: Array<INewMessage> = [];
  protected reachedBeginningOfMessageHistory: boolean = false;
  protected isBeforeUnload: boolean = false;

  protected subscriptionQuery: string = `
    subscription {
      newMessage {
        id
        text
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
    }
  `;

  protected notifier: any;
  protected absintheSocket: any;
  protected graphQLClient: any;

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
          this.onMessage(this.serializeMessage(data.newMessage));
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

  protected serializeMessage = (message: any): INewMessage => {
    let responseToMessage = message.data.responseToMessage;
    if (responseToMessage && responseToMessage.sender) {
      let responseToMessageSender = {
        elixirChatId: responseToMessage.sender.id,
        firstName: responseToMessage.sender.firstName,
        lastName: responseToMessage.sender.lastName,
        isAgent: responseToMessage.sender.__typename === 'Employee',
        isCurrentClient: false,
      };
      if (!responseToMessageSender.isAgent) {
        responseToMessageSender.id = responseToMessage.sender.foreignId;
        responseToMessageSender.isCurrentClient = responseToMessage.sender.foreignId === this.currentClientId;
      }
      responseToMessage = { ...responseToMessage, responseToMessageSender };
    }
    let sender = {
      elixirChatId: message.sender.id,
      firstName: message.sender.firstName,
      lastName: message.sender.lastName,
      isAgent: message.sender.__typename === 'Employee',
      isCurrentClient: false,
    };
    if (!sender.isAgent) {
      sender.id = message.sender.foreignId;
      sender.isCurrentClient = message.sender.foreignId === this.currentClientId;
    }
    return {
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      sender,
      responseToMessage,
      cursor: message.cursor || null,
    };
  };

  public sendMessage = ({ text, responseToMessageId }: ISentMessage): Promise<INewMessage> => {
    const variables = { text, responseToMessageId }; // TODO: change when able to send attachments
    const query = prepareGraphQLQuery('mutation', this.sendMessageQuery, variables);
    return new Promise((resolve, reject) => {
      if (variables.text) {
        this.graphQLClient
          .query(query, variables)
          .then(data => {
            if (data && data.sendMessage) {
              resolve(this.serializeMessage(data.sendMessage));
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

  public fetchMessageHistory = (limit: number, beforeCursor: string): Promise<[INewMessage] | any[]> => {
    const variables = {
      last: limit,
      before: beforeCursor,
    };
    const query = prepareGraphQLQuery('query', this.messageHistoryQuery, variables, { before: 'String' });

    return new Promise((resolve, reject) => {
      if (this.reachedBeginningOfMessageHistory) {
        resolve([]);
        return;
      }

      this.graphQLClient.query(query, variables)
        .then(response => {
          if (response.messages) {

            let messages = <[INewMessage]>simplifyGraphQLJSON(response.messages).map(this.serializeMessage);
            messages = messages.filter(message => !this.latestMessageHistoryCursorsCache.includes(message.cursor));

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
