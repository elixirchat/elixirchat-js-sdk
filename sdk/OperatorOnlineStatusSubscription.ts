import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import {
  OPERATOR_ONLINE_STATUS_CHANGE,
  OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS,
  OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR,
} from './ElixirChatEventTypes';


export class OperatorOnlineStatusSubscription {

  public elixirChat: ElixirChat;
  public areAnyOperatorsOnline: boolean;
  public subscriptionQuery: string = gql`
    subscription {
      updateCompanyWorking
    }
  `;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = ({ areAnyOperatorsOnline }): void => {
    const { graphQLClientSocket, triggerEvent } = this.elixirChat;

    this.areAnyOperatorsOnline = areAnyOperatorsOnline;
    triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, areAnyOperatorsOnline);

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR, error);
      },
      onStart: () => {
        triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS);
      },
      onResult: ({ data }) => {
        this.areAnyOperatorsOnline = Boolean(data?.updateCompanyWorking);
        triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
      },
    });
  };

  public unsubscribe = (): void => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('Unsubscribing from operator online status change...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };
}
