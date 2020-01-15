import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';


export const fragmentUser = gql`
  fragment fragmentUser on Account {
    __typename
    id
    firstName
    lastName

    ... on Client {
      foreignId
    }
  }
`;


export interface IUser {
  id: string | null;
  elixirChatId: string;
  firstName: string;
  lastName: string;
  isOperator: boolean;
  isCurrentClient: boolean;
}


export function serializeUser(user: any, elixirChat: ElixirChat): IUser {
  const elixirChatId = user?.foreignId || null;
  const isOperator = user?.__typename !== 'Client';

  return {
    id: user?.id || null,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    isCurrentClient: elixirChatId === elixirChat.client.id,
    isOperator,
    elixirChatId,
  };
}
