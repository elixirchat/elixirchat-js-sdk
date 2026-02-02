import { ElixirChat } from './ElixirChat';
import { ERROR_ALERT, NEW_RATING } from './ElixirChatEventTypes';
import { gql } from './GraphQLClient';


export interface IMessageRatingPayload {
  id: string;
  rating: 'POSITIVE' | 'NEGATIVE';
  comment: string | null;
  message_id: string;
}


export class MessageRatingSubscription {

  public elixirChat: ElixirChat;
  public subscriptionQuery: string = gql`
    subscription {
      new_rating {
        id
        rating
        comment
        message_id
      }
    }
  `;

  constructor({ elixirChat }: { elixirChat: ElixirChat }) {
    this.elixirChat = elixirChat;
  }

  public subscribe = (): void => {
    const { graphQLClientSocket, triggerEvent, logInfo, logError } = this.elixirChat;

    graphQLClientSocket.subscribe({
      query: this.subscriptionQuery,
      onAbort: error => {
        const customMessage = 'MessageRatingSubscription: Failed to subscribe';
        logError(customMessage, { error });
        triggerEvent(ERROR_ALERT, { customMessage, error, retryCallback: this.subscribe });
      },
      onStart: () => {
        logInfo('MessageRatingSubscription: Subscribed');
      },
      onResult: (response) => {
        const data = response?.data?.new_rating;
        if (data) {
          const ratingPayload: IMessageRatingPayload = {
            id: data.id,
            rating: data.rating,
            comment: data.comment ?? null,
            message_id: data.message_id,
          };
          triggerEvent(NEW_RATING, ratingPayload);
        }
      },
    });
  };

  public unsubscribe = (): void => {
    const { graphQLClientSocket, logInfo } = this.elixirChat;
    logInfo('MessageRatingSubscription: Unsubscribing...');
    graphQLClientSocket.unsubscribe(this.subscriptionQuery);
  };
}
