import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { ElixirChat } from './ElixirChat';
import {
  MESSAGES_FETCH_HISTORY,
  MESSAGES_NEW,
  MESSAGES_SUBSCRIBE_ERROR,
  MESSAGES_SUBSCRIBE_SUCCESS,
} from './ElixirChatEventTypes';

import { logEvent } from '../utilsCommon';
import { serializeMessage, IMessage, fragmentMessage } from './serializers/serializeMessage';
import {
  insertGraphQlFragments,
  simplifyGraphQLJSON,
  GraphQLClient,
  gql,
} from './GraphQLClient';


export interface ISentMessage {
  text?: string,
  attachments?: Array<File>,
  responseToMessageId?: string,
  tempId?: string,
}

export interface ISentMessageSerialized {
  variables: {
    text: string,
    tempId: string | null,
    attachments: Array<string>,
    responseToMessageId: string | null,
  },
  binaries: object,
}

export class MessageSubscription {

  protected elixirChat: ElixirChat;
  protected graphQLClient: GraphQLClient;
  protected notifier: any;
  protected absintheSocket: any;

  protected latestMessageHistoryCursorsCache: Array<IMessage> = [];
  protected reachedBeginningOfMessageHistory: boolean = false;
  protected isCurrentlySubscribed: boolean = false;

  protected subscriptionQuery: string = insertGraphQlFragments(gql`
    subscription {
      newMessage {
        ...fragmentMessage
      }
    }
  `, { fragmentMessage });

  protected sendMessageQuery: string = insertGraphQlFragments(gql`
    mutation ($text: String!, $responseToMessageId: ID, $attachments: [Upload!], $tempId: ID) {
      sendMessage(text: $text, responseToMessageId: $responseToMessageId, attachments: $attachments, tempId: $tempId) {
        ...fragmentMessage
      }
    }
  `, { fragmentMessage });

  protected messageHistoryQuery: string = insertGraphQlFragments(gql`
    query ($beforeCursor: String, $limit: Int!) {
      messages(before: $beforeCursor, last: $limit) {
        edges {
          cursor
          node {
            ...fragmentMessage
          }
        }
      }
    }
  `, { fragmentMessage });

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (): void => {
    const { apiUrl, authToken } = this.elixirChat;
    this.graphQLClient = new GraphQLClient({
      url: apiUrl,
      token: authToken,
    });
    this.initializeSocket();
    this.initializeObserver();
  };

  protected initializeSocket(): void {
    const { socketUrl, authToken } = this.elixirChat;

    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(socketUrl, {
        params: {
          token: authToken,
        }
      })
    );
    this.notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.subscriptionQuery,
    });
  };

  protected initializeObserver(): void {
    const { backendStaticUrl, client, debug, triggerEvent } = this.elixirChat;

    AbsintheSocket.observe(this.absintheSocket, this.notifier, {
      onAbort: error => {
        logEvent(debug, 'Failed to subscribe to messages', error, 'error');
        triggerEvent(MESSAGES_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        if (!this.isCurrentlySubscribed) {
          this.isCurrentlySubscribed = true;
          logEvent(debug, 'Successfully subscribed to messages');
          triggerEvent(MESSAGES_SUBSCRIBE_SUCCESS);
        }
      },
      onResult: ({ data }) => {
        if (data && data.newMessage) {
          const message = serializeMessage(data.newMessage, { backendStaticUrl, client });
          logEvent(debug, 'Received new message', message);
          triggerEvent(MESSAGES_NEW, message);
        }
      },
    });
  };

  protected serializeSendMessageParams(params: ISentMessage): ISentMessageSerialized {
    const text = typeof params.text === 'string' ? text.trim() : '';
    const tempId = params.tempId;
    const responseToMessageId = typeof params.responseToMessageId === 'string' ? params.responseToMessageId : null;
    const attachments = [];
    const binaries = {};

    try {
      params.attachments.forEach(file => {
        attachments.push(file.name);
        binaries[file.name] = file;
      });
    }
    catch (e) {}

    return {
      variables: {
        text,
        tempId,
        attachments,
        responseToMessageId,
      },
      binaries,
    };
  };

  public sendMessage = (params: ISentMessage): Promise<IMessage> => {
    const { backendStaticUrl, client, debug } = this.elixirChat;
    const { variables, binaries } = this.serializeSendMessageParams(params);

    return new Promise((resolve, reject) => {
      if (!variables.text || !variables.attachments.length) {
        const message = 'Either "text" or "attachment" parameter must not be empty';
        logEvent(debug, message, { variables }, 'error');
        reject({ message });
        return;
      }
      this.graphQLClient
        .query(this.sendMessageQuery, variables, binaries)
        .then(data => {
          if (data && data.sendMessage) {
            const message = serializeMessage(data.sendMessage, { backendStaticUrl, client });
            logEvent(this.debug, 'Sent message', { params, variables, message });
            resolve(message);
          }
          else {
            logEvent(debug, 'Failed to send message', { data }, 'error');
            reject(data);
          }
        })
        .catch(error => {
          logEvent(debug, 'Failed to send message', { error }, 'error');
          reject(error);
        });
    });
  };

  public fetchMessageHistory = (limit: number, beforeCursor: string): Promise<[IMessage] | any[]> => {
    const { backendStaticUrl, client, triggerEvent, debug } = this.elixirChat;
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

            // TODO: remove latestMessageHistoryCursorsCache?
            const messages = <[IMessage]>simplifyGraphQLJSON(response.messages)
              .map(message => serializeMessage(message, { backendStaticUrl, client }))
              .filter(message => !this.latestMessageHistoryCursorsCache.includes(message.cursor));

            this.latestMessageHistoryCursorsCache = [
              ...messages.map(message => message.cursor),
              ...this.latestMessageHistoryCursorsCache,
            ].slice(0, limit);

            if (messages.length < limit) {
              this.reachedBeginningOfMessageHistory = true;
            }

            logEvent(debug, 'Fetched message history', { messages, limit, beforeCursor });
            triggerEvent(MESSAGES_FETCH_HISTORY, messages);
            resolve(messages);
          }
          else {
            logEvent(debug, 'Failed to fetch message history', { response }, 'error');
            reject({ response, limit, beforeCursor, query, variables });
          }
        })
        .catch(error => {
          logEvent(debug, 'Failed to fetch message history', { error }, 'error');
          reject({ error, limit, beforeCursor, query, variables });
        });
    });
  };

  public unsubscribe = (): void => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from messages...');
    AbsintheSocket.cancel(this.absintheSocket, this.notifier);
    this.graphQLClient = null;
    this.notifier = null;
    this.absintheSocket = null;
    this.isCurrentlySubscribed = false;
  };
}
