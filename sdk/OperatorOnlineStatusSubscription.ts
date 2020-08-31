import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import { OPERATOR_ONLINE_STATUS_CHANGE } from './ElixirChatEventTypes';


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

  public subscribe = (params: { areAnyOperatorsOnline: boolean }): void => {
    const { areAnyOperatorsOnline } = params || {};
    const { graphQLClientSocket, triggerEvent, logInfo, logError } = this.elixirChat;

    this.areAnyOperatorsOnline = areAnyOperatorsOnline;
    triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, areAnyOperatorsOnline);

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        logError('OperatorOnlineStatusSubscription: Failed to subscribed', { error });
      },
      onStart: () => {
        logInfo('OperatorOnlineStatusSubscription: Subscribed');
      },
      onResult: ({ data }) => {
        this.areAnyOperatorsOnline = Boolean(data?.updateCompanyWorking);
        triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
      },
    });
  };

  public unsubscribe = (): void => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('OperatorOnlineStatusSubscription: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };
}
