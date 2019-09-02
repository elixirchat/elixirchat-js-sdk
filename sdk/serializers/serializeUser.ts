import { _get } from '../../utilsCommon';
import { serializeFile, IFile } from './serializeFile';

export interface IUser {
  id: string | null;
  elixirChatId: string;
  firstName: string;
  lastName: string;
  isOperator: boolean;
  isCurrentClient: boolean;
  avatar: IFile;
}

export interface ISerializeUserOptions {
  apiUrl?: string;
  currentClientId?: string;
}

export function serializeUser(user: any, options?: ISerializeUserOptions): IUser {
  const serializedAvatar = serializeFile(user.avatar || {}, options);
  const elixirChatId = _get(user, 'foreignId') || null;
  return {
    id: _get(user, 'id') || null,
    firstName: _get(user, 'firstName') || '',
    lastName: _get(user, 'lastName') || '',
    avatar: serializedAvatar,
    isOperator: _get(user, '__typename') === 'Employee',
    isCurrentClient: elixirChatId === options.currentClientId,
    elixirChatId,
  };
}
