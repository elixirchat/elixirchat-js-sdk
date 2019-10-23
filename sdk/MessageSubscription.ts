import { ElixirChat } from './ElixirChat';
import {
  MESSAGES_SUBSCRIBE_SUCCESS,
  MESSAGES_SUBSCRIBE_ERROR,
  MESSAGES_FETCH_HISTORY_SUCCESS,
  MESSAGES_FETCH_HISTORY_ERROR,
  MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS,
  MESSAGES_FETCH_HISTORY_INITIAL_ERROR,
  MESSAGES_HISTORY_SET,
  MESSAGES_HISTORY_APPEND_ONE,
  MESSAGES_HISTORY_CHANGE_ONE,
  MESSAGES_HISTORY_PREPEND_MANY,
} from './ElixirChatEventTypes';

import { IFile } from './serializers/serializeFile';
import { IMessage, serializeMessage, fragmentMessage } from './serializers/serializeMessage';
import { _get, logEvent, randomDigitStringId, isWebImage } from '../utilsCommon';
import { GraphQLClientSocket } from './GraphQLClientSocket';
import {
  gql,
  GraphQLClient,
  simplifyGraphQLJSON,
  insertGraphQlFragments,
} from './GraphQLClient';


export interface ISentMessage {
  text?: string,
  tempId?: string,
  responseToMessageId?: string,
  attachments?: Array<{
    id: string;
    file: File;
    name: string;
    width: number;
    height: number;
    isScreenshot?: boolean;
  }>,
  appendConditionally?: boolean;
  retrySubmissionByTempId?: string;
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
  public hasMessageHistoryBeenEverFetched: boolean = false;
  protected temporaryMessageTempIds: Array<string> = [];
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
    const { socketUrl, authToken, debug, triggerEvent } = this.elixirChat;

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
      onResult: this.onMessageReceive,
    });
  };

  protected onMessageReceive = (response: any): void => {
    const { backendStaticUrl, client, triggerEvent, debug } = this.elixirChat;
    const data = _get(response, 'data.newMessage');
    if (!data) {
      return;
    }
    const message = serializeMessage(data, { backendStaticUrl, client });

    if (this.temporaryMessageTempIds.includes(message.tempId)) {
      this.forgetTemporaryMessage(message.tempId);
    }
    else {
      this.messageHistory.push(message);
      logEvent(debug, 'Received new message', { message });
      triggerEvent(MESSAGES_HISTORY_APPEND_ONE, message, this.messageHistory);
    }
  };

  protected serializeSendMessageParams(params: ISentMessage): ISentMessageSerialized {
    const text = typeof params.text === 'string' ? params.text.trim() : '';
    const tempId = params.tempId;
    const responseToMessageId = typeof params.responseToMessageId === 'string' ? params.responseToMessageId : null;
    const attachments = [];
    const binaries = {};

    try {
      params.attachments.forEach(({ file }) => {
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

  protected generateNewClientPlaceholderMessage(messageHistory: Array<IMessage>): IMessage {
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

  protected generateTemporaryMessage(tempId: string, params: ISentMessage): IMessage {
    const { text, attachments, responseToMessageId } = params;
    const serializedResponseToMessage = this.messageHistory.filter(message => {
      return message.id === responseToMessageId;
    })[0];

    const serializedAttachments = attachments.map((attachment): IFile => {
      const { file } = attachment;
      const contentType = file.type;
      const url = URL.createObjectURL(file);
      let thumbnails = [];
      if (isWebImage(contentType) && attachment.width && attachment.height) {
        thumbnails = [{ id: attachment.id, url }];
      }
      return {
        ...attachment,
        url,
        thumbnails,
        contentType,
        bytesSize: file.size,
      };
    });

    return {
      tempId,
      id: randomDigitStringId(6),
      text: text.trim() || '',
      timestamp: new Date().toISOString(),
      sender: {
        isOperator: false,
        isCurrentClient: true,
      },
      responseToMessage: serializedResponseToMessage || null,
      attachments: serializedAttachments,
      isSubmitting: true,
    };
  }

  protected appendMessageConditionally(message: IMessage): void {
    const { triggerEvent, debug } = this.elixirChat;
    this.messageHistory.push(message);
    this.temporaryMessageTempIds.push(message.tempId);
    logEvent(debug, 'Conditionally appended message', { message });
    triggerEvent(MESSAGES_HISTORY_APPEND_ONE, message);
  };

  protected enrichTemporaryMessage(temporaryMessageTempId: string, messageData: IMessage): void {

    console.error('__ enrichTemporaryMessage 1', { temporaryMessageTempId, messageData, temporaryMessageTempIds: this.temporaryMessageTempIds });

    const { triggerEvent } = this.elixirChat;
    if (this.temporaryMessageTempIds.includes(temporaryMessageTempId)) {

      console.error('__ enrichTemporaryMessage 2', { temporaryMessageTempId, messageData, messageHistory: this.messageHistory });
      window.__messageHistory = this.messageHistory;

      this.messageHistory.forEach(message => {

        console.log('__ enrichTemporaryMessage 3', { temporaryMessageTempId, message });


        if (message.tempId === temporaryMessageTempId) {

          console.error('__ enrichTemporaryMessage 4', { temporaryMessageTempId, message });

          for (let key in messageData) {
            message[key] = messageData[key];
          }

          console.error('__ enrichTemporaryMessage 5', { temporaryMessageTempId, message });

          triggerEvent(MESSAGES_HISTORY_CHANGE_ONE, message, this.messageHistory);
          return;
        }
      });

      console.error('__ enrichTemporaryMessage 6', { temporaryMessageTempId });

    }

    console.error('__ enrichTemporaryMessage 7', { temporaryMessageTempId });

  }

  protected forgetTemporaryMessage(temporaryMessageTempId: string): void {
    this.temporaryMessageTempIds = this.temporaryMessageTempIds.filter(id => id !== temporaryMessageTempId);
  }

  public sendMessage = (params: ISentMessage): Promise<IMessage> => {
    const { backendStaticUrl, client, debug, triggerEvent } = this.elixirChat;
    const { variables, binaries } = this.serializeSendMessageParams(params);
    let tempId;

    if (!variables.text && !variables.attachments.length) {
      const errorMessage = 'Either "text" or "attachments" parameter must not be empty';
      logEvent(debug, errorMessage, { variables }, 'error');
      return new Promise((resolve, reject) => {
        reject({ message: errorMessage });
      });
    }

    if (params.appendConditionally) {
      tempId = randomDigitStringId(6);
      variables.tempId = tempId;
      const temporaryMessage = this.generateTemporaryMessage(tempId, params);
      this.appendMessageConditionally(temporaryMessage);
    }
    else if (params.retrySubmissionByTempId) {
      tempId = params.retrySubmissionByTempId;
      variables.tempId = tempId;
      this.enrichTemporaryMessage(tempId, {
        isSubmitting: true,
        submissionErrorCode: null,
      });
    }

    return new Promise((resolve, reject) => {
      this.graphQLClient
        .query(this.sendMessageQuery, variables, binaries)
        .then(response => {
          if (response && response.sendMessage) {
            const message = serializeMessage(response.sendMessage, { backendStaticUrl, client });
            const { tempId } = message;
            if (tempId) {
              this.enrichTemporaryMessage(tempId, message);
              logEvent(debug, 'Enriched temporary message with actual one', { message });
            }
            else {
              logEvent(debug, 'Sent message', { params, variables, message });
            }
            resolve(message);
          }
          else {
            this.onSendMessageFailure(tempId, response);
            reject(response);
          }
        })
        .catch(error => {
          this.onSendMessageFailure(tempId, error);
          reject(error);
        });
    });
  };

  public retrySendMessage = (message: IMessage): Promise<IMessage> => {
    this.sendMessage({
      text: message.text,
      attachments: message.attachments,
      responseToMessageId: _get(message, 'responseToMessage.id'),
      retrySubmissionByTempId: message.tempId,
    });
  };

  protected onSendMessageFailure(tempId: string, response: any): void {
    const { debug } = this.elixirChat;
    const defaultErrorCode = 400;
    let submissionErrorCode = _get(response, 'errors[0].status') || defaultErrorCode;
    if (!navigator.onLine) {
      submissionErrorCode = 503;
    }
    logEvent(debug, 'Failed to send message with code: ' + submissionErrorCode, { response, tempId }, 'error');
    if (tempId) {
      this.enrichTemporaryMessage(tempId, {
        isSubmitting: false,
        submissionErrorCode,
      });
    }
  }

  public getMessageHistoryByCursor = (limit: number, beforeCursor: string): Promise<[IMessage]> => {
    const { triggerEvent, backendStaticUrl, client } = this.elixirChat;

    return new Promise((resolve, reject) => {
      if (this.reachedBeginningOfMessageHistory) {
        resolve([]);
        return;
      }
      this.graphQLClient.query(this.messageHistoryQuery, { limit, beforeCursor })
        .then(response => {
          if (response.messages) {

            const { hasMessageHistoryBeenEverFetched } = this;
            let processedMessages = <[IMessage]>simplifyGraphQLJSON(response.messages)
              .map(message => serializeMessage(message, { backendStaticUrl, client }))
              .filter(message => {
                // Preventing message duplication if overlapping ranges of messages were fetched
                return !this.latestMessageHistoryCursorsCache.includes(message.cursor);
              });

            this.hasMessageHistoryBeenEverFetched = true;
            this.latestMessageHistoryCursorsCache = [
              ...processedMessages.map(message => message.cursor),
              ...this.latestMessageHistoryCursorsCache,
            ].slice(0, limit);

            this.reachedBeginningOfMessageHistory = processedMessages.length < limit;
            if (this.reachedBeginningOfMessageHistory) {
              processedMessages.unshift(
                this.generateNewClientPlaceholderMessage(processedMessages)
              );
            }
            triggerEvent(
              hasMessageHistoryBeenEverFetched
                ? MESSAGES_FETCH_HISTORY_SUCCESS
                : MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS,
              processedMessages,
              this.messageHistory
            );
            resolve(processedMessages);
          }
          else {
            this.onGetMessageHistoryByCursorFailure(response);
            reject(response);
          }
        })
        .catch(error => {
          this.onGetMessageHistoryByCursorFailure(error);
          reject(error);
        });
    });
  };

  protected onGetMessageHistoryByCursorFailure(error: any): void {
    const { triggerEvent, debug } = this.elixirChat;
    if (this.hasMessageHistoryBeenEverFetched) {
      logEvent(debug, 'Failed to fetch message history', { error }, 'error');
      triggerEvent(MESSAGES_FETCH_HISTORY_ERROR, error);
    }
    else {
      logEvent(debug, 'Failed to fetch initial message history', { error }, 'error');
      triggerEvent(MESSAGES_FETCH_HISTORY_INITIAL_ERROR, error);
    }
  };

  public fetchMessageHistory = (limit: number): Promise<[IMessage | any]> => {
    const { triggerEvent, debug } = this.elixirChat;

    return this.getMessageHistoryByCursor(limit, null)
      .then(processedMessageHistory => {
        this.messageHistory = processedMessageHistory;
        logEvent(debug, 'Fetched new message history', { processedMessageHistory });
        triggerEvent(MESSAGES_HISTORY_SET, processedMessageHistory);
        return processedMessageHistory;
      });
  };

  public fetchPrecedingMessageHistory = (limit: number): Promise<[IMessage | any]> => {
    const { triggerEvent, debug } = this.elixirChat;
    const latestCursor = this.messageHistory[0].cursor;

    if (!latestCursor) {
      return new Promise((resolve, reject) => {
        const errorMessage = 'Failed to fetch previous message history - cursors not found';
        logEvent(debug, errorMessage);
        reject({ message: errorMessage });
      });
    }
    return this.getMessageHistoryByCursor(limit, latestCursor)
      .then(processedMessageHistory => {
        this.messageHistory = processedMessageHistory.concat(this.messageHistory);
        logEvent(debug, 'Fetched and prepended additional message history', { processedMessageHistory });
        triggerEvent(MESSAGES_HISTORY_PREPEND_MANY, processedMessageHistory, this.messageHistory);
        return processedMessageHistory;
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
