import { ElixirChat } from './ElixirChat';
import {gql, GraphQLClient} from './GraphQLClient';
import { GraphQLClientSocket } from './GraphQLClientSocket';
import {
  UNREAD_MESSAGES_SUBSCRIBE_ERROR,
  UNREAD_MESSAGES_SUBSCRIBE_SUCCESS,
  UNREAD_MESSAGES_CHANGE,
  UNREAD_REPLIES_CHANGE, LAST_READ_MESSAGE_CHANGE,
} from './ElixirChatEventTypes';
import { _get, _last, logEvent } from '../utilsCommon';
import { IMessage } from './serializers/serializeMessage';


export interface IUnreadMessagesCounterData {
  unreadMessagesCount: number;
  unreadRepliesCount: number;
  lastReadMessageId?: string;
}


export class UnreadMessagesCounter {

  public unreadMessagesCount: number = 0;
  public unreadRepliesCount: number = 0;
  public lastReadMessageId: string | null = null;

  public unreadMessages: Array<IMessage> = [];
  public unreadReplies: Array<IMessage> = [];

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

  protected graphQLClient: GraphQLClient;
  protected graphQLClientSocket: GraphQLClientSocket;

  protected elixirChat: ElixirChat;

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
      onResult: this.onUnreadMessagesResult,
    });

  };
  
  protected onUnreadMessagesResult(response: any): void {
    const data:IUnreadMessagesCounterData = _get(response, 'data.updateReadMessages') || {};
    const { unreadMessagesCount, unreadRepliesCount, lastReadMessageId } = data;

    if (unreadMessagesCount !== this.unreadMessagesCount) {
      logEvent(debug, 'Unread messages count changed to ' + unreadMessagesCount);
      this.unreadMessagesCount = unreadMessagesCount;
      triggerEvent(UNREAD_MESSAGES_CHANGE, unreadMessagesCount);
    }
    
    if (unreadRepliesCount !== this.unreadRepliesCount) {
      logEvent(debug, 'Unread replies count changed to ' + unreadRepliesCount);
      this.unreadMessagesCount = unreadRepliesCount;
      triggerEvent(UNREAD_REPLIES_CHANGE, unreadRepliesCount);
    }
    
    if (lastReadMessageId !== this.lastReadMessageId) {
      logEvent(debug, 'Last message marked as read changed to ID: ' + lastReadMessageId);
      this.lastReadMessageId = lastReadMessageId;
      triggerEvent(LAST_READ_MESSAGE_CHANGE, unreadRepliesCount);
    }
  };

  public recount = () => {
    return; // TODO: remove

    const { client, debug } = this.elixirChat;
    if (!client.id) {
      logEvent(debug, 'UnreadMessagesCounter.recount: cannot find elixirChat.client.id', client, 'error');
      return;
    }
    const unreadMessages = this.getUnreadMessages();
    const unreadReplies = this.getUnreadRepliesToCurrentClient();
    this.triggerOnChangeEvent(unreadMessages, unreadReplies);
  };

  public reset = (): void => {

    console.error('__ RESET UNREAD');

    return; // TODO: remove

    const allRepliesToCurrentClient = this.getAllRepliesToCurrentClient();
    const latestReplyToCurrentClient = _last(allRepliesToCurrentClient);
    if (latestReplyToCurrentClient) {
      localStorage.setItem('elixirchat-latest-unread-reply-id', latestReplyToCurrentClient.id);
    }
    const notCurrentClientsMessages = this.getAllMessagesByNotCurrentClient();
    const latestMessage = _last(notCurrentClientsMessages);
    if (latestMessage) {
      localStorage.setItem('elixirchat-latest-unread-message-id', latestMessage.id);
    }
    this.triggerOnChangeEvent([], []);
  };

  protected triggerOnChangeEvent(unreadMessages: Array<IMessage>, unreadReplies: Array<IMessage>): void {
    return; // TODO: remove

    const unreadMessagesCount = unreadMessages.length;
    const unreadRepliesCount = unreadReplies.length;
    const { debug, triggerEvent } = this.elixirChat;

    if (this.unreadMessagesCount !== unreadMessagesCount) {
      this.unreadMessagesCount = unreadMessagesCount;
      this.unreadMessages = unreadMessages;
      logEvent(debug, 'Unread messages count changed to ' + unreadMessagesCount, { unreadMessages });
      triggerEvent(UNREAD_MESSAGES_CHANGE, unreadMessagesCount, unreadMessages);
    }
    if (this.unreadRepliesCount !== unreadRepliesCount) {
      this.unreadRepliesCount = unreadRepliesCount;
      this.unreadReplies = unreadReplies;
      logEvent(debug, 'Unread replies count changed to ' + unreadRepliesCount, { unreadReplies });
      triggerEvent(UNREAD_REPLIES_CHANGE, unreadRepliesCount, unreadReplies);
    }
  }

  protected getAllRepliesToCurrentClient(): Array<IMessage> {
    const { messageHistory, client } = this.elixirChat;
    return messageHistory.filter(message => {
      const { responseToMessage, sender } = message;
      const isSentByCurrentClient = sender.id === client.id;
      const isResponseToCurrentClient = _get(responseToMessage, 'sender.id') === client.id;
      return isResponseToCurrentClient && !isSentByCurrentClient;
    });
  }

  protected getAllMessagesByNotCurrentClient(): Array<IMessage> {
    const { messageHistory, client } = this.elixirChat;
    return messageHistory.filter(message => {
      return message.sender.id !== client.id;
    });
  }

  protected getUnreadRepliesToCurrentClient = () : Array<IMessage> => {
    const allRepliesToCurrentClient = this.getAllRepliesToCurrentClient();
    const latestUnreadReplyId: string = localStorage.getItem('elixirchat-latest-unread-reply-id');
    const latestUnreadReplyIndex = allRepliesToCurrentClient
      .map((message): string => message.id)
      .indexOf(latestUnreadReplyId);

    return latestUnreadReplyIndex === -1
      ? allRepliesToCurrentClient
      : allRepliesToCurrentClient.slice(latestUnreadReplyIndex + 1);
  };

  protected getUnreadMessages = (): Array<IMessage> => {
    const latestUnreadMessageId: string = localStorage.getItem('elixirchat-latest-unread-message-id');
    const notCurrentClientMessages = this.getAllMessagesByNotCurrentClient();
    const latestUnreadMessageIndex = notCurrentClientMessages
      .map((message): string => message.id)
      .indexOf(latestUnreadMessageId);

    return latestUnreadMessageIndex === -1
      ? notCurrentClientMessages
      : notCurrentClientMessages.slice(latestUnreadMessageIndex + 1);
  };
}
