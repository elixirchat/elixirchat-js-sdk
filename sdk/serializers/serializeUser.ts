import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';
import { extractSerializedData } from '../../utilsCommon';


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
  clientId: string;
  isOperator: boolean;
  isCurrentClient: boolean;
  firstName: string;
  lastName: string;
}


export function serializeUser(data: any, elixirChat: ElixirChat): IUser {
  const clientId = data?.foreignId || null;
  const isOperator = data?.__typename !== 'Client';
  const isCurrentClient = clientId === elixirChat.client.id;

  return {
    ...extractSerializedData(data, {
      id: null,
      firstName: '',
      lastName: '',
    }),
    clientId,
    isOperator,
    isCurrentClient,
  };
}
