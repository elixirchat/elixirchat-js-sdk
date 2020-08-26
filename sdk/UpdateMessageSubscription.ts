import { ElixirChat } from './ElixirChat';
import {
  UPDATE_MESSAGES_SUBSCRIBE_SUCCESS,
  UPDATE_MESSAGES_SUBSCRIBE_ERROR,
  UPDATE_MESSAGES_CHANGE,
} from './ElixirChatEventTypes';

import { gql, insertGraphQlFragments } from './GraphQLClient';
import { GraphQLClientSocket } from './GraphQLClientSocket';
import { logEvent } from '../utilsCommon';
import { fragmentMessage, serializeMessage } from './serializers/serializeMessage';


export class UpdateMessageSubscription {

  protected elixirChat: ElixirChat;
  protected graphQLClientSocket: GraphQLClientSocket;

  protected subscriptionQuery: string = insertGraphQlFragments(gql`
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
    this.initializeSocketClient();
  };

  public unsubscribe = (): void => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from update message...');

    this.graphQLClientSocket.unsubscribe();
    this.graphQLClientSocket = null;
  };

  protected initializeSocketClient(): void {
    const { socketUrl, authToken, debug, triggerEvent } = this.elixirChat;

    this.graphQLClientSocket = new GraphQLClientSocket({
      socketUrl,
      authToken,
      query: this.subscriptionQuery,
      onAbort: error => {
        logEvent(debug, 'Failed to subscribe to update message', error, 'error');
        triggerEvent(UPDATE_MESSAGES_SUBSCRIBE_ERROR, error, { firedOnce: true });
      },
      onStart: () => {
        logEvent(debug, 'Successfully subscribed to update message');
        triggerEvent(UPDATE_MESSAGES_SUBSCRIBE_SUCCESS, null, { firedOnce: true });
      },
      onResult: (response) => {
        const data = response?.data?.updateMessage;
        if (!data) {
          return;
        }
        const updatedMessage = serializeMessage(data, this.elixirChat);
        logEvent(debug, 'A message was updated', { updatedMessage });
        triggerEvent(UPDATE_MESSAGES_CHANGE, updatedMessage);
      },
    });
  };
}
