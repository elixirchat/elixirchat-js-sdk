import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import {
  UNREAD_COUNTER_LAST_READ_MESSAGE_CHANGE,
  UNREAD_COUNTER_MESSAGES_CHANGE,
  UNREAD_COUNTER_REPLIES_CHANGE,
  UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES,
  ERROR_ALERT,
} from './ElixirChatEventTypes';


export interface IUnreadCounterData {
  unreadMessagesCount: number;
  unreadRepliesCount: number;
  lastReadMessageId?: string;
}

export class UnreadCounter {

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

  public subscribe = (initialData: IUnreadCounterData) => {
    const { graphQLClientSocket, logInfo, logError, triggerEvent } = this.elixirChat;
    this.onUnreadCounterUpdate(initialData, true);

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        const customMessage = 'UnreadCounter: Failed to subscribe';
        logError(customMessage, { error });
        triggerEvent(ERROR_ALERT, {
          customMessage,
          error,
          retryCallback: () => this.subscribe(initialData),
        });
      },
      onStart: () => {
        logInfo('UnreadCounter: Subscribed');
      },
      onResult: response => {
        const data: IUnreadCounterData = response?.data?.updateReadMessages || {};
        this.onUnreadCounterUpdate(data);
      },
    });
  };

  private onUnreadCounterUpdate(data: IUnreadCounterData, isInitial): void {
    const { triggerEvent, logInfo } = this.elixirChat;
    const { unreadMessagesCount, unreadRepliesCount, lastReadMessageId } = data;
    const normalizedLastReadMessageId = (lastReadMessageId || '').toString().trim();

    if (unreadMessagesCount !== this.unreadMessagesCount) {
      this.unreadMessagesCount = unreadMessagesCount;
      logInfo('Unread messages count changed to ' + unreadMessagesCount);
      triggerEvent(UNREAD_COUNTER_MESSAGES_CHANGE, unreadMessagesCount);
    }
    if (unreadRepliesCount !== this.unreadRepliesCount) {
      const shouldNotifyAboutNew = unreadRepliesCount > this.unreadRepliesCount;
      logInfo('Unread replies count changed to ' + unreadRepliesCount);
      this.unreadRepliesCount = unreadRepliesCount;
      triggerEvent(UNREAD_COUNTER_REPLIES_CHANGE, unreadRepliesCount);

      if (shouldNotifyAboutNew && !isInitial) {
        triggerEvent(UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES, unreadRepliesCount);
      }
    }
    if (normalizedLastReadMessageId !== this.lastReadMessageId) {
      this.lastReadMessageId = normalizedLastReadMessageId;
      logInfo('Last message marked as read changed to: ' + normalizedLastReadMessageId);
      triggerEvent(UNREAD_COUNTER_LAST_READ_MESSAGE_CHANGE, normalizedLastReadMessageId);
    }
  };

  public setLastReadMessage = (messageId: string): Promise<IUnreadCounterData> => {
    const { sendAPIRequest } = this.elixirChat;
    if (messageId !== this.lastReadMessageId) {
      return sendAPIRequest(this.setLastReadMessageQuery, { messageId });
    }
  };

  public unsubscribe = () => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('UnreadCounter: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
    this.onUnreadCounterUpdate({ unreadMessagesCount: 0, unreadRepliesCount: 0 });
  };
}
