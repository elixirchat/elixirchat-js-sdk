import { _get, _last } from '../utilsCommon';
import { IMessage } from './serializers/serializeMessage';

export class UnreadMessagesCounter {

  public unreadMessagesCount: number = 0;
  public unreadRepliesCount: number = 0;

  public unreadMessages: Array<IMessage> = [];
  public unreadReplies: Array<IMessage> = [];

  protected receivedMessages: Array<IMessage> = [];
  protected currentClientId: null | string = null;
  protected onUnreadMessagesChangeCallbacks: Array<(unreadMessagesCount: number, unreadMessages: Array<IMessage>) => {}> = [];
  protected onUnreadRepliesChangeCallbacks: Array<(unreadRepliesCount: number, unreadReplies: Array<IMessage>) => {}> = [];

  constructor({ currentClientId }){
    this.currentClientId = currentClientId;
  }

  public setReceivedMessages = (receivedMessages: Array<IMessage>): void => {
    this.receivedMessages = receivedMessages;

    const unreadMessages = this.getUnreadMessages();
    const unreadReplies = this.getUnreadRepliesToCurrentClient();
    this.triggerOnChangeCallbacks(unreadMessages, unreadReplies);
  };

  public onUnreadMessagesChange = (callback: (unreadMessagesCount: number, unreadMessages: Array<IMessage>) => {}): void => {
    this.onUnreadMessagesChangeCallbacks.push(callback);
  };

  public onUnreadRepliesChange = (callback: (unreadRepliesCount: number, unreadReplies: Array<IMessage>) => {}): void => {
    this.onUnreadRepliesChangeCallbacks.push(callback);
  };

  public resetUnreadMessagesAndReplies = (): void => {
    const allRepliesToCurrentClient = this.getAllRepliesToCurrentClient();
    const latestReplyToCurrentClient = _last(allRepliesToCurrentClient);
    if (latestReplyToCurrentClient) {
      localStorage.setItem('elixirchat-latest-unread-reply-id', latestReplyToCurrentClient.id);
    }
    const latestMessage = _last(this.receivedMessages);
    if (latestMessage) {
      localStorage.setItem('elixirchat-latest-unread-message-id', latestMessage.id);
    }

    this.triggerOnChangeCallbacks([], []);
  };

  protected triggerOnChangeCallbacks(unreadMessages: Array<IMessage>, unreadReplies: Array<IMessage>): void {
    if (this.unreadMessagesCount !== unreadMessages.length) {
      this.onUnreadMessagesChangeCallbacks.forEach(callback => callback(unreadMessages.length, unreadMessages));
      this.unreadMessagesCount = unreadMessages.length;
      this.unreadMessages = unreadMessages;
    }
    if (this.unreadRepliesCount !== unreadReplies.length) {
      this.onUnreadRepliesChangeCallbacks.forEach(callback => callback(unreadReplies.length, unreadReplies));
      this.unreadRepliesCount = unreadReplies.length;
      this.unreadReplies = unreadReplies;
    }
  }

  protected getAllRepliesToCurrentClient(): Array<IMessage> {
    return this.receivedMessages.filter(message => {
      const { responseToMessage, sender } = message;
      const isSentByCurrentClient = sender.id === this.currentClientId;
      const isResponseToCurrentClient = _get(responseToMessage, 'sender.id') === this.currentClientId;
      return isResponseToCurrentClient && !isSentByCurrentClient;
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
    const notMineMessages = this.receivedMessages.filter(message => message.sender.id !== this.currentClientId);
    const latestUnreadMessageIndex = notMineMessages
      .map((message): string => message.id)
      .indexOf(latestUnreadMessageId);

    return latestUnreadMessageIndex === -1
      ? notMineMessages
      : notMineMessages.slice(latestUnreadMessageIndex + 1);
  };
}
