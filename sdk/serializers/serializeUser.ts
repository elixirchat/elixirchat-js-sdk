import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';
import { extractSerializedData } from '../../utilsCommon';
import { IFile, serializeFile } from './serializeFile';


export const fragmentUser = gql`
  fragment fragmentUser on Account {
    __typename
    id
    firstName
    lastName
    avatar {
      thumbnails { url }
    }

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
  avatar: IFile,
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
    // avatar: serializeFile(data?.avatar, elixirChat),
    avatar: data?.id === 'RW1wbG95ZWU6ZmY5MzJhNTYtZTM4NS00ZjliLTk4MTQtZTcyMDkwZmU1Yjc3' || data?.id === 'RW1wbG95ZWU6MjJhOTI0OTUtZmM1NC00YzBkLWEwMzUtNGYwZTA2NWFkM2Uy' ? serializeFile(data?.avatar, elixirChat) : serializeFile({}, elixirChat),
    clientId,
    isOperator,
    isCurrentClient,
  };
}
