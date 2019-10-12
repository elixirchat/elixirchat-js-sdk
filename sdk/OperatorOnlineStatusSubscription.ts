import * as AbsintheSocket from '@absinthe/socket'
import * as Phoenix from 'phoenix'
import { ElixirChat } from './ElixirChat';
import {
  OPERATOR_ONLINE_STATUS_CHANGE,
  OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS,
  OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR,
} from './ElixirChatEventTypes';

import { gql } from './GraphQLClient';
import { logEvent } from '../utilsCommon';


export class OperatorOnlineStatusSubscription {

  public areAnyOperatorsOnline: boolean;

  protected elixirChat: ElixirChat;
  protected notifier: any;
  protected absintheSocket: any;
  protected isCurrentlySubscribed: boolean = false;

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

    this.initializeSocket();
    this.initializeObserver();
  };

  public unsubscribe = (): void => {
    const { debug } = this.elixirChat;
    logEvent(debug, 'Unsubscribing from operator online status change...');
    AbsintheSocket.cancel(this.absintheSocket, this.notifier);
    this.notifier = null;
    this.absintheSocket = null;
    this.isCurrentlySubscribed = false;
  };

  protected initializeSocket(): void {
    const { socketUrl, authToken } = this.elixirChat;

    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(socketUrl, {
        params: {
          token: authToken
        }
      })
    );
    this.notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.subscriptionQuery,
    });
  };

  protected initializeObserver(): void {
    const { debug, triggerEvent } = this.elixirChat;

    AbsintheSocket.observe(this.absintheSocket, this.notifier, {
      onAbort: e => {
        logEvent(debug, 'Failed to subscribe to operator online status change', e, 'error');
        triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR, e);
      },
      onStart: () => {
        if (!this.isCurrentlySubscribed) {
          this.isCurrentlySubscribed = true;
          logEvent(debug, 'Successfully subscribed to operator online status change');
          triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS);
        }
      },
      onResult: ({ data }) => {
        this.areAnyOperatorsOnline = data && data.updateCompanyWorking;
        logEvent(debug, this.areAnyOperatorsOnline ? 'Operators got back online' : 'All operators went offline');
        triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
      },
    });
  };
}
