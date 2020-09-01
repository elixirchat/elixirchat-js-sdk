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

  public subscriptionQuery: string = gql`
    subscription {
      updateCompanyWorking {
        isWorking
        workHoursStartAt
      }
    }
  `;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (params: IOnlineStatusParams): void => {
    const { graphQLClientSocket, logInfo, logError } = this.elixirChat;
    const { isOnline, workHoursStartAt } = params || {};

    // TODO: remove mock
    this.onStatusChange({
      isOnline: false,
      workHoursStartAt: '2020-09-02T13:30:00Z',
    });
    // this.onStatusChange({ isOnline, workHoursStartAt });

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        logError('OnlineStatusSubscription: Failed to subscribe', { error });
      },
      onStart: () => {
        logInfo('OnlineStatusSubscription: Subscribed');
      },
      onResult: ({ data }) => {
        const { updateCompanyWorking } = data;
        this.onStatusChange({
          isOnline: updateCompanyWorking?.isWorking,
          workHoursStartAt: updateCompanyWorking?.workHoursStartAt,
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
