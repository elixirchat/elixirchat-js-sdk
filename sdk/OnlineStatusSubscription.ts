import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import { ONLINE_STATUS_CHANGE } from './ElixirChatEventTypes';

export interface IOnlineStatusParams {
  isOnline: boolean;
  workHoursStartAt: null | string;
}

export class OnlineStatusSubscription {

  public elixirChat: ElixirChat;
  public onlineStatus: IOnlineStatusParams = {
    isOnline: false,
    workHoursStartAt: null,
  };

  // TODO: add workHoursStartAt
  public subscriptionQuery: string = gql`
    subscription {
      updateCompanyWorking
    }
  `;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (params: IOnlineStatusParams): void => {
    const { graphQLClientSocket, logInfo, logError } = this.elixirChat;
    const { isOnline, workHoursStartAt } = params || {};

    // this.onStatusChange({ isOnline, workHoursStartAt });
    this.onStatusChange({
      isOnline: false,
      workHoursStartAt: '2020-09-03T13:30:00Z',
    });

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        logError('OnlineStatusSubscription: Failed to subscribe', { error });
      },
      onStart: () => {
        logInfo('OnlineStatusSubscription: Subscribed');
      },
      onResult: ({ data }) => {
        // TODO: change when workHoursStartAt is added on backend
        this.onStatusChange({
          isOnline: data?.updateCompanyWorking,
          workHoursStartAt: null,
        });
      },
    });
  };

  private onStatusChange(params: IOnlineStatusParams): void {
    const { triggerEvent } = this.elixirChat;
    const { isOnline, workHoursStartAt } = params || {};

    const serialized = {
      isOnline: Boolean(isOnline),
      workHoursStartAt: workHoursStartAt || null,
    };
    if (serialized.isOnline !== this.onlineStatus.isOnline || serialized.workHoursStartAt !== this.onlineStatus.workHoursStartAt) {
      this.onlineStatus = serialized;
      triggerEvent(ONLINE_STATUS_CHANGE, serialized);
    }
  };

  public unsubscribe = (): void => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('OnlineStatusSubscription: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };
}
