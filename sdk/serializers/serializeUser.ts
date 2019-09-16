import { _get } from '../../utilsCommon';

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

export function serializeUser(user: any, options?: ISerializeUserOptions): IUser {
  const elixirChatId = _get(user, 'foreignId') || null;
  return {
    id: _get(user, 'id') || null,
    firstName: _get(user, 'firstName') || '',
    lastName: _get(user, 'lastName') || '',
    isOperator: _get(user, '__typename') !== 'Client',
    isCurrentClient: elixirChatId === options.currentClientId,
    elixirChatId,
  };
}
