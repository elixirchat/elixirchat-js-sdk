import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';
import { _get } from '../../utilsCommon';

export const fragmentClient = gql`
  fragment fragmentClient on Client {
    __typename
    id
    foreignId
    firstName
    lastName
  }
`;

export const fragmentCompanyEmployee = gql`
  fragment fragmentCompanyEmployee on CompanyEmployee {
    employee {
      id
      firstName
      lastName
    }
    __typename
    isWorking
    role
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

export interface ISerializeUserOptions {
  apiUrl?: string;
  currentClientId?: string;
}

export function serializeUser(user: any, elixirChat: ElixirChat): IUser {
  const elixirChatId = _get(user, 'foreignId') || null;
  const isOperator = _get(user, '__typename') !== 'Client';
  const id = isOperator ? _get(user, 'employee.id') : _get(user, 'id');

  return {
    id: id || null,
    firstName: _get(user, 'firstName') || _get(user, 'employee.firstName') || '',
    lastName: _get(user, 'lastName') || _get(user, 'employee.lastName') || '',
    isCurrentClient: elixirChatId === elixirChat.client.id,
    isOperator,
    elixirChatId,
  };
}
