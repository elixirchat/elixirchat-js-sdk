import { ElixirChat } from './ElixirChat';
import {
  OPERATOR_ONLINE_STATUS_CHANGE,
  OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS,
  OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR,
} from './ElixirChatEventTypes';

import { gql } from './GraphQLClient';
import { GraphQLClientSocket } from './GraphQLClientSocket';
import { logEvent } from '../utilsCommon';


export class OperatorOnlineStatusSubscription {

  public areAnyOperatorsOnline: boolean;

  protected elixirChat: ElixirChat;
  protected graphQLClientSocket: GraphQLClientSocket;

  protected subscriptionQuery: string = gql`
    subscription {
      updateCompanyWorking
    }
  `;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (areAnyOperatorsOnline): void => {
    const { triggerEvent } = this.elixirChat;
    this.areAnyOperatorsOnline = areAnyOperatorsOnline;
    triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
    this.initializeSocketClient();
  };

  public unsubscribe = (): void => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from operator online status change...');

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
        logEvent(debug, 'Failed to subscribe to operator online status change', error, 'error');
        triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        logEvent(debug, 'Successfully subscribed to operator online status change');
        triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS);
      },
      onResult: ({ data }) => {
        this.areAnyOperatorsOnline = data && data.updateCompanyWorking;
        logEvent(debug, this.areAnyOperatorsOnline ? 'Operators got back online' : 'All operators went offline');
        triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
      },
    });
  };
}
