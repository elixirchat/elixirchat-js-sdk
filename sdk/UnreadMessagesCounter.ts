import { _get, logEvent } from '../utilsCommon';
import { ElixirChat } from './ElixirChat';
import { gql, GraphQLClient } from './GraphQLClient';
import { GraphQLClientSocket } from './GraphQLClientSocket';
import {
  UNREAD_MESSAGES_SUBSCRIBE_ERROR,
  UNREAD_MESSAGES_SUBSCRIBE_SUCCESS,
  UNREAD_MESSAGES_CHANGE,
  UNREAD_REPLIES_CHANGE, LAST_READ_MESSAGE_CHANGE,
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

  protected subscriptionQuery = gql`
    subscription {
      updateReadMessages {
        unreadMessagesCount
        unreadRepliesCount
        lastReadMessageId
      }
    }
  `;

  protected setLastReadMessageQuery = gql`
    mutation ($messageId: ID!) {
      updateLastReadMessage(messageId: $messageId) {
        unreadMessagesCount,
        unreadRepliesCount,
      }
    }
  `;

  protected elixirChat: ElixirChat;
  protected graphQLClient: GraphQLClient;
  protected graphQLClientSocket: GraphQLClientSocket;

  constructor({ elixirChat }: { elixirChat: ElixirChat }){
    this.elixirChat = elixirChat;
  }

  public subscribe = () => {
    const { apiUrl, authToken } = this.elixirChat;
    this.graphQLClient = new GraphQLClient({
      url: apiUrl,
      token: authToken,
    });
    this.initializeSocketClient();
  };

  public unsubscribe = () => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from unread messages count...');
    this.unreadMessagesCount = 0;
    this.unreadRepliesCount = 0;

    this.graphQLClientSocket.unsubscribe();
    this.graphQLClientSocket = null;
    this.graphQLClient = null;
  };

  public setLastReadMessage =  (messageId: string): Promise<IUnreadMessagesCounterData> => {

    // TODO: unread - remove
    this.elixirChat.triggerEvent(LAST_READ_MESSAGE_CHANGE, messageId);
    return this.graphQLClient.query(this.setLastReadMessageQuery, { messageId });
  };

  protected initializeSocketClient(): void {
    const { socketUrl, authToken, debug, triggerEvent } = this.elixirChat;

    this.graphQLClientSocket = new GraphQLClientSocket({
      socketUrl,
      authToken,
      query: this.subscriptionQuery,
      onAbort: error => {
        logEvent(debug, 'Failed to subscribe to unread messages count', error, 'error');
        triggerEvent(UNREAD_MESSAGES_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        logEvent(debug, 'Successfully subscribed to unread messages count');
        triggerEvent(UNREAD_MESSAGES_SUBSCRIBE_SUCCESS);
      },
      onResult: this.onSocketResult,
    });
  };
  
  protected onSocketResult = (response: any): void => {
    const { debug, triggerEvent } = this.elixirChat;
    const data: IUnreadMessagesCounterData = _get(response, 'data.updateReadMessages') || {};
    const { unreadMessagesCount, unreadRepliesCount, lastReadMessageId } = data;

    if (unreadMessagesCount !== this.unreadMessagesCount) {
      logEvent(debug, 'Unread messages count changed to ' + unreadMessagesCount);
      this.unreadMessagesCount = unreadMessagesCount;
      triggerEvent(UNREAD_MESSAGES_CHANGE, unreadMessagesCount);
    }
    
    if (unreadRepliesCount !== this.unreadRepliesCount) {
      logEvent(debug, 'Unread replies count changed to ' + unreadRepliesCount);
      this.unreadRepliesCount = unreadRepliesCount;
      triggerEvent(UNREAD_REPLIES_CHANGE, unreadRepliesCount);
    }
    
    if (lastReadMessageId !== this.lastReadMessageId) {
      logEvent(debug, 'Last message marked as read changed to ID: ' + lastReadMessageId);
      this.lastReadMessageId = lastReadMessageId;
      triggerEvent(LAST_READ_MESSAGE_CHANGE, lastReadMessageId);
    }
  };

  // TODO: unread - remove manually triggering UNREAD_MESSAGES_CHANGE, UNREAD_REPLIES_CHANGE, LAST_READ_MESSAGE_CHANGE
  public __tempTriggerChange = (messages, replies, messageLastIndex = 0) => {
    const { messageHistory } = this.elixirChat;
    const notMineMessages = messageHistory.filter(message => !message.sender.isCurrentClient);
    const lastMessage = notMineMessages[notMineMessages.length - 1 - messageLastIndex];

    if (typeof messages !== 'number') {
      this.onSocketResult({
        data: {
          updateReadMessages: { unreadMessagesCount: messages }
        }
      });
    }

    if (typeof replies !== 'number') {
      this.onSocketResult({
        data: {
          updateReadMessages: { unreadRepliesCount: replies }
        }
      });
    }

    console.log('%c lastMessage', 'color: green', lastMessage);
    this.setLastReadMessage(lastMessage.id);
  };
}
