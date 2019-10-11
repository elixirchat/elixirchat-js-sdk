import { ElixirChat } from './ElixirChat';
import { UNREAD_MESSAGES_CHANGE, UNREAD_REPLIES_CHANGE } from './ElixirChatEventTypes';
import { _get, _last, logEvent } from '../utilsCommon';
import { IMessage } from './serializers/serializeMessage';


export class UnreadMessagesCounter {

  public unreadMessagesCount: number = 0;
  public unreadRepliesCount: number = 0;
  public unreadMessages: Array<IMessage> = [];
  public unreadReplies: Array<IMessage> = [];

  protected elixirChat: ElixirChat;

  constructor({ elixirChat }: { elixirChat: ElixirChat }){
    this.elixirChat = elixirChat;
  }

  public recount = () => {
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
