import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import {
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

  public elixirChat: ElixirChat;

  constructor({ elixirChat }: { elixirChat: ElixirChat }){
    this.elixirChat = elixirChat;
  }

  public subscribe = (params: IUnreadMessagesCounterData) => {
    // TODO: remove mock
    // this.onUnreadCountsUpdate({
    //   unreadMessagesCount: 2,
    //   unreadRepliesCount: 0,
    // });
    // this.onUnreadCountsUpdate(params);
    this.onUnreadCountsUpdate({
      ...params,
      // lastReadMessageId: 'TWFudWFsTWVzc2FnZTo4MDc5MThhNS04ZDdiLTRkMDYtOTdiZS1jZWQwYmJjZTdjMDY=', // TODO: remove mock
      // lastReadMessageId: 'TWFudWFsTWVzc2FnZTo2NWMwMDRhZS00ZGJlLTQ3NjQtYTM0OC0zZjBhYmMwZTQ4MmM=', // TODO: remove mock
      // lastReadMessageId: 'zzz', // TODO: remove mock
    });

    this.initializeSocketClient();
  };

  private initializeSocketClient(): void {
    const { graphQLClientSocket, logInfo, logError } = this.elixirChat;

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        logError('UnreadMessagesCounter: Failed to subscribe', { error });
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
      logInfo('Last message marked as read changed to ID: ' + normalizedLastReadMessageId);
      triggerEvent(LAST_READ_MESSAGE_CHANGE, normalizedLastReadMessageId);
    }
  };

  public setLastReadMessage = (messageId: string): Promise<IUnreadMessagesCounterData> => {
    const { sendAPIRequest } = this.elixirChat;
    return sendAPIRequest(this.setLastReadMessageQuery, { messageId });
  };

  public unsubscribe = () => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('UnreadMessagesCounter: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
    this.onUnreadCountsUpdate({ unreadMessagesCount: 0, unreadRepliesCount: 0 });
  };
}
