import { ElixirChat } from './ElixirChat';
import {
  // MESSAGES_FETCH_HISTORY_SUCCESS,
  // MESSAGES_FETCH_HISTORY_ERROR,
  // MESSAGES_FETCH_HISTORY_INITIAL_SUCCESS,
  // MESSAGES_FETCH_HISTORY_INITIAL_ERROR,
  // MESSAGES_HISTORY_SET,
  // MESSAGES_HISTORY_APPEND_ONE,
  // MESSAGES_HISTORY_PREPEND_MANY,
  // MESSAGES_HISTORY_CHANGE_MANY,
  // INITIALIZATION_ERROR,
  // MESSAGES_SUBSCRIBE_ERROR,
  // MESSAGES_SUBSCRIBE_SUCCESS,
  MESSAGES_RECEIVE, MESSAGES_CHANGE,
} from './ElixirChatEventTypes';

import { IFile } from './serializers/serializeFile';
import { IMessage, serializeMessage, fragmentMessage } from './serializers/serializeMessage';
import {logEvent, randomDigitStringId, isWebImage, _findLast, _last, _uniqBy} from '../utilsCommon';
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

export interface IFetchMessageHistoryParams {
  limit: number;
  beforeCursor?: string;
  afterCursor?: string;
}

export class MessageSubscription {

  protected elixirChat: ElixirChat;
  // protected graphQLClient: GraphQLClient;
  // protected graphQLClientSocket: GraphQLClientSocket;

  public messageHistory: Array<IMessage> = [];
  public hasMessageHistoryBeenEverFetched: boolean = false;
  protected temporaryMessageTempIds: Array<string> = [];
  protected messageHistoryRequestInterval: number = null;
  protected MESSAGE_HISTORY_REQUEST_INTERVAL: number = 30 * 1000;

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
    query ($first: Int, $last: Int, $before: String, $after: String) {
      messages(first: $first, last: $last, before: $before, after: $after) {
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
    const { graphQLClientSocket, logInfo, logError } = this.elixirChat;
    this.updateMessageHistoryOnInterval();

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        logError('MessageSubscription: Failed to subscribe', { error });
      },
      onStart: () => {
        logInfo('MessageSubscription: Subscribed');
      },
      onResult: this.onMessageReceive,
    });
  };

  private updateMessageHistoryOnInterval(): void {
    this.messageHistoryRequestInterval = setInterval(() => {
      const limit = 20;
      const afterCursor = _last(this.messageHistory)?.cursor || null;
      this.getMessageHistoryByCursor({ limit, afterCursor }).then(missedMessages => {
        missedMessages.forEach(this.onMessageReceive);
      });
    }, this.MESSAGE_HISTORY_REQUEST_INTERVAL);
  }

  private onMessageReceive = (response: any): void => {
    const { triggerEvent, logInfo } = this.elixirChat;
    const data = response?.data?.newMessage;
    if (!data) {
      return;
    }
    const message = serializeMessage(data, this.elixirChat);
    if (this.temporaryMessageTempIds.includes(message.tempId)) {
      this.forgetTemporaryMessage(message.tempId);
    }
    else {
      this.messageHistory.push(message);
      logInfo('Received new message', { message });
      triggerEvent(MESSAGES_RECEIVE, message);
    }
  };

  private forgetTemporaryMessage(temporaryMessageTempId: string): void {
    this.temporaryMessageTempIds = this.temporaryMessageTempIds.filter(id => id !== temporaryMessageTempId);
  }

  public changeMessageBy = (query: object, diff: object) => {
    const { triggerEvent } = this.elixirChat;
    this.messageHistory = this.messageHistory.map(message => {
      let updatedMessage = { ...message };

      if ( this.doesMessageMatchQuery(message, query) ) {
        updatedMessage = {
          ...updatedMessage,
          ...diff,
        };
      }
      if (message.responseToMessage?.id && this.doesMessageMatchQuery(message.responseToMessage, query)) {
        updatedMessage.responseToMessage = {
          ...updatedMessage.responseToMessage,
          ...diff,
        };
      }
      return updatedMessage;
    });
    triggerEvent(MESSAGES_CHANGE, this.messageHistory);
  };

  private doesMessageMatchQuery(message: IMessage, query: object){
    for (let queryKey in query) {
      if (query[queryKey] !== message[queryKey]) {
        return false;
      }
    }
    return true;
  }

  public sendMessage = (textareaParams: ISentMessage): Promise<IMessage> => {
    const { logInfo, logError, sendAPIRequest } = this.elixirChat;
    const { variables, binaries } = this.serializeSendMessageParams(textareaParams);
    let tempId;

    if (!variables.text && !variables.attachments.length) {
      const errorMessage = 'MessageSubscription: Either "text" or "attachments" parameter must not be empty';
      logError(errorMessage, variables);
      return Promise.reject({ message: errorMessage });
    }
    else if (textareaParams.appendConditionally) {
      tempId = randomDigitStringId(6);
      variables.tempId = tempId;
      const temporaryMessage = this.generateTemporaryMessage(textareaParams, { tempId });
      this.appendMessageConditionally(temporaryMessage);
    }
    else if (textareaParams.retrySubmissionByTempId) {
      tempId = textareaParams.retrySubmissionByTempId;
      variables.tempId = tempId;
      this.changeMessageBy({ tempId }, {
        isSubmitting: true,
        submissionErrorCode: null, // TODO: fix
      });
    }

    return sendAPIRequest(this.sendMessageQuery, variables, binaries)
      .then(data => {
        const sentMessage = serializeMessage(data, this.elixirChat);
        const { tempId } = sentMessage;
        if (tempId) {
          logInfo('MessageSubscription: Enriched temporary message with actual one', { sentMessage });
          this.changeMessageBy({ tempId }, sentMessage);
        }
        else {
          logInfo('MessageSubscription: Sent message', { textareaParams, variables, sentMessage });
        }
        return sentMessage;
      })
      .catch(e => {
        const submissionErrorCode = this.getSubmissionErrorCode(e);
        this.changeMessageBy({ tempId }, {
          isSubmitting: false,
          submissionErrorCode,
        });
        throw e;
      });
  };

  private getSubmissionErrorCode(e){
    const defaultErrorCode = 400;
    let submissionErrorCode = e.rawError?.errors?.[0]?.status || defaultErrorCode;
    if (!navigator.onLine) {
      submissionErrorCode = 503;
    }
    return submissionErrorCode;
  };

  public retrySendMessage = (message: IMessage): Promise<IMessage> => {
    return this.sendMessage({
      text: message.text,
      attachments: message.attachments,
      responseToMessageId: message?.responseToMessage?.id,
      retrySubmissionByTempId: message.tempId,
    });
  };

  private serializeSendMessageParams(params: ISentMessage): ISentMessageSerialized {
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

  // TODO: fix?
  private generateTemporaryMessage(textareaParams: ISentMessage, customData?: any): IMessage {
    const { text, attachments, responseToMessageId } = textareaParams;

    const serializedResponseToMessage = this.messageHistory.filter(message => {
      return message.id === responseToMessageId;
    })[0];

    const serializedAttachments = attachments.map((attachment): IFile => {
      const { id, file, width, height } = attachment;
      const url = URL.createObjectURL(file);
      let thumbnails = [];
      if (isWebImage(file.type) && width && height) {
        thumbnails = [{ id, url }];
      }
      return {
        ...attachment,
        url,
        thumbnails,
        contentType: file.type,
        bytesSize: file.size,
      };
    });

    return serializeMessage({
      id: randomDigitStringId(6),
      text: text.trim() || '',
      timestamp: new Date().toISOString(),
      responseToMessage: serializedResponseToMessage || {},
      attachments: serializedAttachments,
      isSubmitting: true,
      sender: {
        __typename: 'Client',
        foreignId: this.elixirChat.client.id,
      },
      ...customData,
    }, this.elixirChat);

    // return {
    //   tempId,
    //   id: randomDigitStringId(6),
    //   text: text.trim() || '',
    //   timestamp: new Date().toISOString(),
    //   sender: {
    //     isOperator: false,
    //     isCurrentClient: true,
    //   },
    //   responseToMessage: serializedResponseToMessage || {},
    //   attachments: serializedAttachments,
    //   isSubmitting: true,
    // };
  }

  private appendMessageConditionally(message: IMessage): void {
    const { triggerEvent, logInfo } = this.elixirChat;
    this.messageHistory.push(message);
    this.temporaryMessageTempIds.push(message.tempId);
    logInfo('Conditionally appended message', { message });
    triggerEvent(MESSAGES_RECEIVE, message);
  };

  // TODO: insert into history? Fix bug
  // private generateNewClientPlaceholderMessage(messageHistory: Array<IMessage>): IMessage {
  //   const firstMessageTimestamp = messageHistory?.[0]?.timestamp;
  //   const timestamp = firstMessageTimestamp || new Date().toISOString();
  //   return {
  //     timestamp,
  //     id: randomDigitStringId(6),
  //     isSystem: true,
  //     sender: {},
  //     attachments: [],
  //     responseToMessage: {},
  //     systemType: 'NewClientPlaceholderMessage',
  //   };
  // };

  private getMessageHistoryByCursor(params: IFetchMessageHistoryParams): Promise<[IMessage]> {
    const { sendAPIRequest } = this.elixirChat;
    const { limit, beforeCursor, afterCursor } = params;
    let variables;

    if (beforeCursor) {
      variables = {
        last: limit,
        before: beforeCursor,
      };
    }
    else if (afterCursor) {
      variables = {
        first: limit,
        after: afterCursor,
      };
    }
    else {
      variables = {
        last: limit,
      }
    }
    return sendAPIRequest(this.messageHistoryQuery, variables).then(messages => {

      const processedMessageHistory = <[IMessage]>simplifyGraphQLJSON(messages).map(message => {
        return serializeMessage(message, this.elixirChat);
      });

      console.error('__ getMessageHistoryByCursor 2', {
        messages,
        processedMessageHistory,
      });

      // this.reachedBeginningOfMessageHistory = processedMessageHistory.length < limit;
      return processedMessageHistory;
    });
  };

  private onMessageHistoryChange(messageHistory: Array<IMessage>): Array<IMessage> {
    const { triggerEvent } = this.elixirChat;
    this.messageHistory = messageHistory;
    triggerEvent(MESSAGES_CHANGE, messageHistory);
    return messageHistory;
  };

  public fetchMessageHistory = (limit: number): Promise<[IMessage] | any> => {

    console.warn('__ messageHistory 1', limit);

    return this.getMessageHistoryByCursor({ limit, zz: 222 }).then(messageHistory => {

      console.warn('__ messageHistory 2', messageHistory, limit);

      return this.onMessageHistoryChange(messageHistory);
    });
  };

  public fetchPrecedingMessageHistory = (limit: number): Promise<[IMessage] | any> => {
    const { logError } = this.elixirChat;
    const latestCursor = this.messageHistory[0]?.cursor;

    if (!latestCursor) {
      const errorMessage = 'MessageSubscription: Failed to fetch previous message history - cursors not found';
      logError(errorMessage);
      return Promise.reject({ message: errorMessage });
    }
    return this.getMessageHistoryByCursor({ limit, beforeCursor: latestCursor })
      .then(messageHistory => {
        const updatedMessageHistory = _uniqBy([ ...messageHistory, ...this.messageHistory ], 'id');
        return this.onMessageHistoryChange(updatedMessageHistory);
      });
  };

  public markPrecedingMessagesRead = (lastReadMessageId: string): Array<IMessage> => {
    const messageIds = this.messageHistory.map(message => message.id);
    const lastReadMessageIndex = messageIds.indexOf(lastReadMessageId);
    this.messageHistory.forEach((message, index) => {
      if (lastReadMessageIndex >= index) {
        message.isUnread = false;
      }
    });
    this.onMessageHistoryChange(this.messageHistory);
  };

  public unsubscribe = () => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;

    this.messageHistory = [];
    this.temporaryMessageTempIds = [];
    clearInterval(this.messageHistoryRequestInterval);

    logInfo('MessageSubscription: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.companyMessageSubscription);
  };
}
