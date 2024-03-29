import { ElixirChat } from './ElixirChat';
import cloneDeep from 'lodash/cloneDeep';
import {
  MESSAGES_RECEIVE,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  MESSAGES_RETRIEVE_LAST_MESSAGE_CURSOR,
  ERROR_ALERT,
  MESSAGES_SEARCH,
  MESSAGES_SEARCH_IDS,
  MESSAGES_PAGINATION,
  MESSAGES_LAST_MESSAGE_ID,
  MESSAGES_HISTORY_APPEND,
} from './ElixirChatEventTypes';
import { IFile } from './serializers/serializeFile';
import { IMessage, serializeMessage, fragmentMessage } from './serializers/serializeMessage';
import { randomDigitStringId, getMediaType, _last, _uniqBy } from '../utilsCommon';
import {
  gql,
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

type searchRequestType = {
  limit: number;
  searchTerm: string;
}

type requestLoadHistoryParams = {
  afterAmount: number;
  beforeAmount?: number;
  messageId: string;
};

export interface IFetchMessageHistoryParams {
  limit: number;
  beforeCursor?: string;
  afterCursor?: string;
}

export class MessageSubscription {

  public MESSAGE_HISTORY_POLLING_TIMEOUT: number = 60 * 1000;

  public elixirChat: ElixirChat;
  public messageHistory: Array<IMessage> = [];

  private pollingInterval: number = null;
  private lastMessageCursor: null | string = null;
  private hasEmptyMessageHistory: boolean = false;
  private temporaryMessageTempIds: Array<string> = [];

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
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `, { fragmentMessage });

  protected searchMessageQuery: string = insertGraphQlFragments(gql`
    query ($searchTerm: String!, $limit: Int!, $afterCursor: String) {
      searchMessages(query: $searchTerm, first: $limit, after: $afterCursor) {
        edges {
          cursor
          node {
            id
            text
            timestamp
          }
        }
      }
    }
  `)

  protected messageHistorySearchQuery: string = insertGraphQlFragments(gql`
    query($messageId: ID!, $beforeAmount: Int, $afterAmount: Int) {
      message_with_page(
      message_id: $messageId,
      before_amount: $beforeAmount,
      after_amount: $afterAmount ) {
        edges {
          cursor
          node {
            ...fragmentMessage
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `, { fragmentMessage });

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (): void => {
    const { graphQLClientSocket, logInfo, logError, triggerEvent } = this.elixirChat;
    this.initializePollingMessageHistoryOnInterval();

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        const customMessage = 'MessageSubscription: Failed to subscribe';
        logError('MessageSubscription: Failed to subscribe', { error });
        triggerEvent(ERROR_ALERT, { customMessage, error, retryCallback: this.subscribe });
      },
      onStart: () => {
        logInfo('MessageSubscription: Subscribed');
      },
      onResult: (response) => {
        const data = response?.data?.newMessage;
        if (!data) {
          return;
        }
        const message = serializeMessage(data, this.elixirChat);
        this.onMessageReceive(message);
      },
    });
  };

  private retrieveLastMessageCursor(): Promise<any> {
    return new Promise(async resolve => {
      if (this.lastMessageCursor) {
        resolve(this.lastMessageCursor);
      }
      else if (!this.hasEmptyMessageHistory) {
        const { triggerEvent } = this.elixirChat;
        const lastMessage = await this.getMessageHistoryByCursor({ limit: 1 }).then(chunk => chunk[0]);
        const lastMessageCursor = lastMessage?.cursor || null;
        if (!lastMessageCursor) {
          this.hasEmptyMessageHistory = true;
        }
        triggerEvent(MESSAGES_RETRIEVE_LAST_MESSAGE_CURSOR, lastMessage);
        this.lastMessageCursor = lastMessageCursor;
        resolve(lastMessageCursor);
      }
      else {
        resolve(null);
      }
    });
  }

  private initializePollingMessageHistoryOnInterval(): void {
    clearInterval(this.pollingInterval);

    this.retrieveLastMessageCursor().then(lastMessageCursor => {
      this.pollingInterval = setInterval(() => {
        if (lastMessageCursor) {
          const pollingParams = {
            limit: 10,
            afterCursor: lastMessageCursor,
          };
          this.getMessageHistoryByCursor(pollingParams).then(chunk => {
            const messageHistoryIds = this.messageHistory.map(({ id }) => id);
            const missedMessages = chunk.filter(message => !messageHistoryIds.includes(message.id));
            if (missedMessages.length) {
              missedMessages.forEach(this.onMessageReceive);
            }
            if (chunk.length) {
              this.lastMessageCursor = _last(chunk)?.cursor || null;
            }
          });
        }
      }, this.MESSAGE_HISTORY_POLLING_TIMEOUT);
    });
  }

  private onMessageReceive = (message: IMessage): void => {
    const { triggerEvent, logInfo } = this.elixirChat;
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
    triggerEvent(MESSAGES_HISTORY_CHANGE, this.messageHistory);
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
    const { logInfo, logError, sendAPIRequest, triggerEvent } = this.elixirChat;
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
        submissionErrorCode: null,
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

  private generateTemporaryMessage(textareaParams: ISentMessage, customData?: any): IMessage {
    const { text, attachments, responseToMessageId } = textareaParams;

    const serializedResponseToMessage = this.messageHistory.filter(message => {
      return message.id === responseToMessageId;
    })[0];

    const serializedAttachments = attachments.map((attachment): IFile => {
      const { id, file, width, height } = attachment;
      const url = URL.createObjectURL(file);
      let thumbnails = [];
      if (getMediaType(file.type) === 'image' && width && height) {
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
  }

  private appendMessageConditionally(message: IMessage): void {
    const { triggerEvent, logInfo } = this.elixirChat;
    this.messageHistory.push(message);
    this.temporaryMessageTempIds.push(message.tempId);
    logInfo('Conditionally appended message', { message });
    triggerEvent(MESSAGES_RECEIVE, message);
  };

  private getMessageHistoryByCursor(params: IFetchMessageHistoryParams): Promise<[IMessage]> {
    const { sendAPIRequest, triggerEvent } = this.elixirChat;
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
      triggerEvent(MESSAGES_PAGINATION, messages.pageInfo);
      return <[IMessage]>simplifyGraphQLJSON(messages).map(message => {
        return serializeMessage(message, this.elixirChat);
      });
    });
  };

  public fetchMessageHistory = (limit: number): Promise<[IMessage] | any> => {
    const { triggerEvent } = this.elixirChat;
    return this.getMessageHistoryByCursor({ limit }).then(messageHistory => {
      triggerEvent(MESSAGES_HISTORY_CHANGE, messageHistory);
      this.messageHistory = messageHistory;
      this.lastMessageCursor = _last(messageHistory)?.cursor || null;
      return messageHistory;
    });
  };

  public fetchPrecedingMessageHistory = (limit: number): Promise<[IMessage] | any> => {
    const { logError, triggerEvent } = this.elixirChat;
    const firstMessageCursor = this.messageHistory[0]?.cursor;

    if (!firstMessageCursor) {
      const errorMessage = 'MessageSubscription: Failed to fetch previous message history - cursors not found';
      logError(errorMessage);
      return Promise.reject({ message: errorMessage });
    }
    return this.getMessageHistoryByCursor({ limit, beforeCursor: firstMessageCursor }).then(precedingMessageHistory => {
      this.messageHistory = _uniqBy([ ...precedingMessageHistory, ...this.messageHistory ], 'id');
      triggerEvent(MESSAGES_HISTORY_PREPEND, precedingMessageHistory);
      return precedingMessageHistory;
    });
  };

  public markPrecedingMessagesRead = (lastReadMessageId: string): Array<IMessage> => {
    const { triggerEvent } = this.elixirChat;
    const messageIds = this.messageHistory.map(message => message.id);
    const lastReadMessageIndex = messageIds.indexOf(lastReadMessageId);
    this.messageHistory.forEach((message, index) => {
      if (lastReadMessageIndex >= index) {
        message.isUnread = false;
      }
    });
    triggerEvent(MESSAGES_HISTORY_CHANGE, this.messageHistory);
  };

  public unsubscribe = () => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;

    this.messageHistory = [];
    this.lastMessageCursor = null;
    this.temporaryMessageTempIds = [];
    clearInterval(this.pollingInterval);

    logInfo('MessageSubscription: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };

  /**
   * Получение списка сообщение, в которых есть искомый текст
   * @param {Object} request
   * @returns {Promise<*>}
   */
  public fetchMessageBySearch = (request: searchRequestType): Array<IMessage> => {
    const { sendAPIRequest, triggerEvent } = this.elixirChat;

    sendAPIRequest(this.searchMessageQuery, request).then(messages => {
      const messagesList = messages?.edges || [];
      const ids = messagesList.map(el => el?.node?.id);

      triggerEvent(MESSAGES_SEARCH, messagesList);
      triggerEvent(MESSAGES_SEARCH_IDS, ids);

      return messagesList;
    });
  };

  /**
   * Получение части лога с определенным сообщением
   * @param messageId
   * @param full Boolean - историю вокруг сообщения, или только после него
   * @returns {Promise<*>}
   */
  private getHistoryToMessage = (messageId: string, full?: boolean): Promise<[IMessage] | any> => {
    const { sendAPIRequest, triggerEvent } = this.elixirChat;
    let requestParams:requestLoadHistoryParams = {
      afterAmount: 10,
      messageId
    };

    if (full) {
      requestParams.beforeAmount = 10;
    }

    return sendAPIRequest(this.messageHistorySearchQuery, requestParams).then(messages => {
      triggerEvent(MESSAGES_PAGINATION, messages.pageInfo);
      return <[IMessage]>simplifyGraphQLJSON(messages).map(message => {
        return serializeMessage(message, this.elixirChat);
      });
    });
  }

  /**
   * Загрузка сообщений лога для результата поиска
   * @param messageId
   */
  public fetchHistoryMessageBySearch = (messageId: string): Promise<[IMessage] | any> => {
    const { triggerEvent } = this.elixirChat;

    return this.getHistoryToMessage(messageId, true).then(messageHistory => {
      triggerEvent(MESSAGES_HISTORY_CHANGE, messageHistory);
      const lastMessage = _last(messageHistory) || {};
      this.messageHistory = messageHistory;
      this.lastMessageCursor = lastMessage?.cursor || null;
      triggerEvent(MESSAGES_LAST_MESSAGE_ID, lastMessage?.id);
      return messageHistory;
    });
  };

  /**
   * Загрузка новой истории от выбранного сообщения
   * @param messageId
   */
  public fetchHistoryMessagePrepend = (messageId: string): Promise<[IMessage] | any> => {
    const { triggerEvent } = this.elixirChat;

    return this.getHistoryToMessage(messageId).then(messageHistory => {
      this.retrieveLastMessageCursor().then(() => {
        const messages = cloneDeep(messageHistory);
        messages.shift();
        triggerEvent(MESSAGES_HISTORY_APPEND, messages);
        const lastMessage = _last(messages) || {};
        this.messageHistory = messages;
        this.lastMessageCursor = lastMessage?.cursor || null;
        triggerEvent(MESSAGES_LAST_MESSAGE_ID, lastMessage?.id);
        return messages;
      })
    });
  };
}
