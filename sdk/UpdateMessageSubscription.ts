import { ElixirChat } from './ElixirChat';
import {
  UPDATE_MESSAGES_SUBSCRIBE_SUCCESS,
  UPDATE_MESSAGES_SUBSCRIBE_ERROR,
  UPDATE_MESSAGES_CHANGE,
} from './ElixirChatEventTypes';

import { gql, insertGraphQlFragments } from './GraphQLClient';
import { fragmentMessage, serializeMessage } from './serializers/serializeMessage';


export class UpdateMessageSubscription {

  public elixirChat: ElixirChat;
  public subscriptionQuery: string = insertGraphQlFragments(gql`
    subscription {
      updateMessage {
        ...fragmentMessage
      }
    }
  `, { fragmentMessage });

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (): void => {
    const { graphQLClientSocket, triggerEvent } = this.elixirChat;

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        triggerEvent(UPDATE_MESSAGES_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        triggerEvent(UPDATE_MESSAGES_SUBSCRIBE_SUCCESS);
      },
      onResult: (response) => {
        const data = response?.data?.updateMessage;
        if (data) {
          const updatedMessage = serializeMessage(data, this.elixirChat);
          triggerEvent(UPDATE_MESSAGES_CHANGE, updatedMessage);
        }
      },
    });
  };

  public unsubscribe = (): void => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('Unsubscribing from update message...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };
}
