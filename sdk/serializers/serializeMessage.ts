import { _get, _omit } from '../../utilsCommon';
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

  // TODO: change backend API structure into same-format inline objects
  const senderData = {
    ..._omit(sender, ['employee']),
    ..._get(sender, 'employee'),
    ..._omit(author, ['employee']),
    ..._get(author, 'employee'),
  };

  const serializedSender = serializeUser(senderData, options);
  const serializedAttachments = (attachments || []).map(attachment => serializeFile(attachment, options));

  const responseToMessageSender = _get(responseToMessage, 'sender', {});
  const responseToMessageSenderData = {
    ..._omit(responseToMessageSender, ['employee']),
    ..._get(responseToMessageSender, 'employee')
  };
  const serializedResponseToMessage = {
    id: _get(responseToMessage, 'id') || null,
    text: _get(responseToMessage, 'text') || '',
    sender: serializeUser(responseToMessageSenderData, options),
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
