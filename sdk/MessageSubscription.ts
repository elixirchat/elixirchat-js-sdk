import { ElixirChat } from './ElixirChat';
import {
  MESSAGES_FETCH_HISTORY_ERROR,
  MESSAGES_FETCH_HISTORY_SUCCESS, MESSAGES_HISTORY_ADD_MANY, MESSAGES_HISTORY_ADD_ONE, MESSAGES_HISTORY_SET,
  MESSAGES_NEW,
  MESSAGES_SUBSCRIBE_ERROR,
  MESSAGES_SUBSCRIBE_SUCCESS,
} from './ElixirChatEventTypes';

import {_get, logEvent, randomDigitStringId} from '../utilsCommon';
import { serializeMessage, IMessage, fragmentMessage } from './serializers/serializeMessage';
import {
  insertGraphQlFragments,
  simplifyGraphQLJSON,
  GraphQLClient,
  gql,
} from './GraphQLClient';
import {GraphQLClientSocket} from './GraphQLClientSocket';


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
  protected graphQLClientSocket: GraphQLClientSocket;

  public messageHistory: Array<IMessage> = [];
  protected latestMessageHistoryCursorsCache: Array<IMessage> = [];
  protected reachedBeginningOfMessageHistory: boolean = false;

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
    this.initializeSocketClient();
  };

  protected initializeSocketClient(): void {
    const {
      socketUrl,
      authToken,
      backendStaticUrl,
      client,
      debug,
      triggerEvent,
    } = this.elixirChat;

    this.graphQLClientSocket = new GraphQLClientSocket({
      socketUrl,
      authToken,
      query: this.subscriptionQuery,
      onAbort: error => {
        logEvent(debug, 'Failed to subscribe to messages', error, 'error');
        triggerEvent(MESSAGES_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        logEvent(debug, 'Successfully subscribed to messages');
        triggerEvent(MESSAGES_SUBSCRIBE_SUCCESS);
      },
      onResult: ({ data }) => {
        if (data && data.newMessage) {
          const message = serializeMessage(data.newMessage, { backendStaticUrl, client });

          // TODO: unread - remove
          if (!message.sender.isCurrentClient) {
            message.isUnread = true;
          }

          this.messageHistory.push(message);
          logEvent(debug, 'Received new message', message);
          triggerEvent(MESSAGES_HISTORY_ADD_ONE, message, this.messageHistory);
          triggerEvent(MESSAGES_NEW, message);
        }
      },
    });
  };

  protected serializeSendMessageParams(params: ISentMessage): ISentMessageSerialized {
    const text = typeof params.text === 'string' ? params.text.trim() : '';
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

  protected generateNewClientPlaceholderMessage(messageHistory): IMessage {
    const firstMessageTimestamp = _get(messageHistory, '[0].timestamp');
    const timestamp = firstMessageTimestamp || new Date().toISOString();
    return {
      timestamp,
      id: randomDigitStringId(6),
      isSystem: true,
      sender: {},
      attachments: [],
      systemData: {
        type: 'NEW_CLIENT_PLACEHOLDER'
      },
    };
  };


  public sendMessage = (params: ISentMessage): Promise<IMessage> => {
    const { backendStaticUrl, client, debug } = this.elixirChat;
    const { variables, binaries } = this.serializeSendMessageParams(params);

    return new Promise((resolve, reject) => {
      if (!variables.text && !variables.attachments.length) {
        const message = 'Either "text" or "attachments" parameter must not be empty';
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
            let messages = <[IMessage]>simplifyGraphQLJSON(response.messages)
              .map(message => serializeMessage(message, { backendStaticUrl, client }))
              .filter(message => !this.latestMessageHistoryCursorsCache.includes(message.cursor));

            this.latestMessageHistoryCursorsCache = [
              ...messages.map(message => message.cursor),
              ...this.latestMessageHistoryCursorsCache,
            ].slice(0, limit);

            if (messages.length < limit) {
              this.reachedBeginningOfMessageHistory = true;
              messages = [
                this.generateNewClientPlaceholderMessage(messages),
                ...messages,
              ];
            }


            // TODO: unread - remove
            let notMineMessages = messages.filter(message => !message.sender.isCurrentClient);
            notMineMessages.forEach((message, index) => {
              if (index > notMineMessages.length - 5) {
                message.isUnread = true;
              }
            });

            this.messageHistory = this.messageHistory.concat(messages);

            if (beforeCursor) {
              logEvent(debug, 'Fetched additional message history', { messages, limit, beforeCursor });
              triggerEvent(MESSAGES_HISTORY_ADD_MANY, messages, this.messageHistory);
            }
            else {
              logEvent(debug, 'Fetched new message history', { messages, limit });
              triggerEvent(MESSAGES_HISTORY_SET, this.messageHistory);
              triggerEvent(MESSAGES_HISTORY_ADD_MANY, messages, this.messageHistory);
            }
            triggerEvent(MESSAGES_FETCH_HISTORY_SUCCESS, messages);
            resolve(messages);
          }
          else {
            logEvent(debug, 'Failed to fetch message history', { response }, 'error');
            triggerEvent(MESSAGES_FETCH_HISTORY_ERROR, response);
            reject(response);
          }
        })
        .catch(error => {
          logEvent(debug, 'Failed to fetch message history', { error }, 'error');
          triggerEvent(MESSAGES_FETCH_HISTORY_ERROR, error);
          reject(error);
        });
    });
  };

  public unsubscribe = (): void => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from messages...');

    this.graphQLClientSocket.unsubscribe();
    this.graphQLClientSocket = null;
    this.graphQLClient = null;
  };
}
