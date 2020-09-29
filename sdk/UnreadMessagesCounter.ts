import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import {
  UNREAD_MESSAGES_CHANGE,
  UNREAD_REPLIES_CHANGE,
  LAST_READ_MESSAGE_CHANGE, ERROR_ALERT_SHOW,
} from './ElixirChatEventTypes';

export interface IUnreadMessagesCounterData {
  unreadMessagesCount: number;
  unreadRepliesCount: number;
  lastReadMessageId?: string;
}

export class UnreadMessagesCounter {

  public unreadMessagesCount: number = 0;
  public unreadRepliesCount: number = 0;
  public lastReadMessageId: string | null = null;

  public subscriptionQuery = gql`
    subscription {
      updateReadMessages {
        unreadMessagesCount
        unreadRepliesCount
        lastReadMessageId
      }
    }
  `;

  public setLastReadMessageQuery = gql`
    mutation ($messageId: ID!) {
      updateLastReadMessage(messageId: $messageId) {
        unreadMessagesCount,
        unreadRepliesCount,
      }
    }
  `;

  public elixirChat: ElixirChat;

  constructor({ elixirChat }: { elixirChat: ElixirChat }){
    this.elixirChat = elixirChat;
  }

  public subscribe = (params: IUnreadMessagesCounterData) => {
    const { graphQLClientSocket, logInfo, logError, triggerEvent } = this.elixirChat;
    this.onUnreadCountsUpdate(params);

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        const customMessage = 'UnreadMessagesCounter: Failed to subscribe';
        logError(customMessage, { error });
        triggerEvent(ERROR_ALERT_SHOW, {
          customMessage,
          error,
          retryCallback: () => this.subscribe(params),
        });
      },
      onStart: () => {
        logInfo('UnreadMessagesCounter: Subscribed');
      },
      onResult: response => {
        const data: IUnreadMessagesCounterData = response?.data?.updateReadMessages || {};
        this.onUnreadCountsUpdate(data);
      },
    });
  };

  private onUnreadCountsUpdate(data: IUnreadMessagesCounterData): void {
    const { triggerEvent, logInfo } = this.elixirChat;
    const { unreadMessagesCount, unreadRepliesCount, lastReadMessageId } = data;
    const normalizedLastReadMessageId = (lastReadMessageId || '').toString().trim();

    if (unreadMessagesCount !== this.unreadMessagesCount) {
      this.unreadMessagesCount = unreadMessagesCount;
      logInfo('Unread messages count changed to ' + unreadMessagesCount);
      triggerEvent(UNREAD_MESSAGES_CHANGE, unreadMessagesCount);
    }
    if (unreadRepliesCount !== this.unreadRepliesCount) {
      this.unreadRepliesCount = unreadRepliesCount;
      logInfo('Unread replies count changed to ' + unreadRepliesCount);
      triggerEvent(UNREAD_REPLIES_CHANGE, unreadRepliesCount);
    }
    if (normalizedLastReadMessageId !== this.lastReadMessageId) {
      this.lastReadMessageId = normalizedLastReadMessageId;
      logInfo('Last message marked as read changed to: ' + normalizedLastReadMessageId);
      triggerEvent(LAST_READ_MESSAGE_CHANGE, normalizedLastReadMessageId);
    }
  };

  public setLastReadMessage = (messageId: string): Promise<IUnreadMessagesCounterData> => {
    const { sendAPIRequest } = this.elixirChat;
    if (messageId !== this.lastReadMessageId) {
      return sendAPIRequest(this.setLastReadMessageQuery, { messageId });
    }
  };

  public unsubscribe = () => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('UnreadMessagesCounter: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
    this.onUnreadCountsUpdate({ unreadMessagesCount: 0, unreadRepliesCount: 0 });
  };
}
