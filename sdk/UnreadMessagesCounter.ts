import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import {
  UNREAD_MESSAGES_SUBSCRIBE_SUCCESS,
  UNREAD_MESSAGES_SUBSCRIBE_ERROR,
  UNREAD_MESSAGES_CHANGE,
  UNREAD_REPLIES_CHANGE,
  LAST_READ_MESSAGE_CHANGE,
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

  public fetchUnreadCountsQuery = gql`
    query {
      room {
        unreadMessagesCount
        unreadRepliesCount
      }
    }
  `;

  public elixirChat: ElixirChat;

  constructor({ elixirChat }: { elixirChat: ElixirChat }){
    this.elixirChat = elixirChat;
  }

  public subscribe = () => {
    this.fetchUnreadCounts();
    this.initializeSocketClient();
  };

  private initializeSocketClient(): void {
    const { graphQLClientSocket, triggerEvent } = this.elixirChat;

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        triggerEvent(UNREAD_MESSAGES_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        triggerEvent(UNREAD_MESSAGES_SUBSCRIBE_SUCCESS);
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
    if (lastReadMessageId !== this.lastReadMessageId) {
      this.lastReadMessageId = lastReadMessageId;
      logInfo('Last message marked as read changed to ID: ' + lastReadMessageId);
      triggerEvent(LAST_READ_MESSAGE_CHANGE, lastReadMessageId);
    }
  };

  private fetchUnreadCounts(): Promise<IUnreadMessagesCounterData> {
    const { sendAPIRequest } = this.elixirChat;
    return sendAPIRequest(this.fetchUnreadCountsQuery).then(data => {
      this.onUnreadCountsUpdate(data);
    });
  };

  public setLastReadMessage = (messageId: string): Promise<IUnreadMessagesCounterData> => {
    const { sendAPIRequest } = this.elixirChat;
    return sendAPIRequest(this.setLastReadMessageQuery, { messageId });
  };

  public unsubscribe = () => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('Unsubscribing from unread messages count...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
    this.onUnreadCountsUpdate({ unreadMessagesCount: 0, unreadRepliesCount: 0 });
  };
}
