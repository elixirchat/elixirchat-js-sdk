import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';
import { extractSerializedData } from '../../utilsCommon';
import { IFile, serializeFile } from './serializeFile';


// TODO: add avatar when backend fixed


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


  let __mock_avatars = [
    'https://omnichannel-mock.surge.sh/operator-1.png',
    'https://omnichannel-mock.surge.sh/operator-2.png',
    'https://omnichannel-mock.surge.sh/operator-3.png',
    'https://omnichannel-mock.surge.sh/operator-4.png',
    'https://omnichannel-mock.surge.sh/operator-5.png',
  ];
  const __mock_avatar_data = {
    url: __mock_avatars[ Math.round(Math.random() * 10 / 2) ],
  };

  return {
    ...extractSerializedData(data, {
      id: null,
      firstName: '',
      lastName: '',
    }),
    avatar: serializeFile(data?.avatar, elixirChat),
    clientId,
    isOperator,
    isCurrentClient,
  };
}
