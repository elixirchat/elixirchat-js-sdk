import { _get, _merge } from '../../utilsCommon';
import { serializeUser, IUser } from './serializeUser';
import { serializeFile, IFile } from './serializeFile';

export interface IMessage {
  id: string;
  text: string;
  timestamp: string;
  cursor: string;
  sender: IUser;
  responseToMessage: null | {
    id: string;
    text: string;
    sender: IUser;
  };
  isSystem: boolean;
  systemData: null | {
    type: string | null;
  },
  attachments: Array<IFile>,
  isSubmitting: boolean,
  isSubmissionError: boolean,
}

export interface ISerializeMessageOptions {
  apiUrl?: string;
  currentClientId?: string;
}

export function serializeMessage(message: any, options?: ISerializeMessageOptions): IMessage {
  let { sender = {}, attachments, data = {} } = message;
  let { responseToMessage, author = {} } = data;

  const senderEmployee = _get(sender, 'employee');
  const senderData = senderEmployee || sender || {};
  const authorData = _get(author, 'employee') || {};

  const serializedSender = serializeUser(_merge(senderData, authorData), options);
  const serializedAttachments = (attachments || []).map(attachment => serializeFile(attachment, options));

  const serializedResponseToMessage = {
    id: _get(responseToMessage, 'id') || null,
    text: _get(responseToMessage, 'text') || '',
    sender: serializeUser(_get(responseToMessage, 'sender', {}), options),
  };

  const isSystem = _get(message, 'system', false);

  return {
    id: _get(message, 'id') || null,
    text: _get(message, 'text', ''),
    timestamp: _get(message, 'timestamp', ''),
    cursor: _get(message, 'cursor') || null,
    sender: serializedSender,
    responseToMessage: serializedResponseToMessage.id ? serializedResponseToMessage : null,
    attachments: serializedAttachments,
    isSubmitting: _get(message, 'isSubmitting') || false,
    isSubmissionError: _get(message, 'isSubmissionError') || false,
    isSystem,
    systemData: !isSystem ? null : {
      type: _get(message, 'data.type') || null,
    },
  };
}
