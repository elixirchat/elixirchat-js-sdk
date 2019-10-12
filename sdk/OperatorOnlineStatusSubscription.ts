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
    this.initialize();
  }

  protected initialize(): void {
    const { socketUrl, authToken } = this.elixirChat;
    this.absintheSocket = AbsintheSocket.create(
      new Phoenix.Socket(socketUrl, { params: { token: authToken }})
    );
    this.subscribe();
  }

  public setStatus = areAnyOperatorsOnline => {
    const { triggerEvent } = this.elixirChat;
    this.areAnyOperatorsOnline = areAnyOperatorsOnline;
    triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
  };

  public unsubscribe = (): void => {
    this.absintheSocket = AbsintheSocket.cancel(this.absintheSocket, this.notifier);
    this.isCurrentlySubscribed = false;
  };

  protected subscribe(): void {
    const { debug, triggerEvent } = this.elixirChat;
    const notifier = AbsintheSocket.send(this.absintheSocket, {
      operation: this.subscriptionQuery,
    });

    AbsintheSocket.observe(this.absintheSocket, notifier, {
      onAbort: e => {
        logEvent(debug, 'Failed to subscribe to operator online status change', e, 'error');
        triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_ERROR, e);
      },
      onStart: notifier => {
        this.notifier = notifier;
        if (!this.isCurrentlySubscribed) {
          this.isCurrentlySubscribed = true;
          logEvent(debug, 'Successfully subscribed to operator online status change');
          triggerEvent(OPERATOR_ONLINE_STATUS_SUBSCRIBE_SUCCESS, notifier);
        }
      },
      onResult: ({ data }) => {
        this.areAnyOperatorsOnline = data && data.updateCompanyWorking;
        logEvent(debug, this.areAnyOperatorsOnline ? 'Operators got back online' : 'All operators went offline');
        triggerEvent(OPERATOR_ONLINE_STATUS_CHANGE, this.areAnyOperatorsOnline);
      },
    })
  };
}
