import { ElixirChat } from './ElixirChat';
import { gql } from './GraphQLClient';
import {ERROR_ALERT, ONLINE_STATUS_CHANGE} from './ElixirChatEventTypes';

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
    const { graphQLClientSocket, logInfo, logError, triggerEvent } = this.elixirChat;
    const { isOnline, workHoursStartAt } = params || {};

    this.onStatusChange({ isOnline, workHoursStartAt });

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        const customMessage = 'OnlineStatusSubscription: Failed to subscribe';
        logError(customMessage, { error });
        triggerEvent(ERROR_ALERT, {
          customMessage,
          error,
          retryCallback: () => this.subscribe(params),
        });
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
