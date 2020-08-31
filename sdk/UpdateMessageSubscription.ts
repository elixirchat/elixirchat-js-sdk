import { ElixirChat } from './ElixirChat';
import { UPDATE_MESSAGES_CHANGE } from './ElixirChatEventTypes';
import { fragmentMessage, serializeMessage } from './serializers/serializeMessage';
import { gql, insertGraphQlFragments } from './GraphQLClient';


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
    const { graphQLClientSocket, triggerEvent, logInfo, logError } = this.elixirChat;

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        logError('UpdateMessageSubscription: Failed to subscribe', { error });
      },
      onStart: () => {
        logInfo('UpdateMessageSubscription: Subscribed');
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
    logInfo('UpdateMessageSubscription: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };
}
