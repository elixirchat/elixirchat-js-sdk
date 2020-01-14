import { ElixirChat } from '../ElixirChat';
import { gql, insertGraphQlFragments } from '../GraphQLClient';
import { _get } from '../../utilsCommon';
import { IUser, serializeUser, fragmentUser } from './serializeUser';
import { IFile, serializeFile, fragmentFile } from './serializeFile';

export const fragmentMessage = insertGraphQlFragments(gql`
  fragment fragmentMessage on Message {
    id
    text
    timestamp
    isUnread
    
    ... on ManualMessage {
      tempId
      sender { ...fragmentUser }
      attachments { ...fragmentFile }
      mentions {
        value
        client { ...fragmentUser }
      }
      responseToMessage {
        id
        text
        sender { ...fragmentUser }
      }
    }
    
    ... on ScreenshotRequestedMessage {
      __typename
      sender { ...fragmentUser }
    }

    ... on NobodyWorkingMessage {
      __typename
      workHoursStartAt
    }
  }
`, { fragmentUser, fragmentFile });


export interface IMessage {
  id: string;
  tempId: string | null;
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
  isUnread: boolean;
  mentions: Array<{value: string, client: IUser}>,
  systemType: string | null;
  systemWorkHoursStartAt: string | null;
  attachments: Array<IFile>,
  isSubmitting: boolean,
  submissionErrorCode: number | null,
}

export interface ISerializeMessageOptions {
  apiUrl?: string;
  currentClientId?: string;
}

export function serializeMessage(message: any, elixirChat: ElixirChat): IMessage {
  let { sender, responseToMessage, attachments, mentions } = message;

  const serializedSender = serializeUser(sender, elixirChat);
  const serializedAttachments = (attachments || []).map(attachment => serializeFile(attachment, elixirChat));

  const serializedResponseToMessage = {
    id: _get(responseToMessage, 'id') || null,
    text: _get(responseToMessage, 'text') || '',
    sender: serializeUser(_get(responseToMessage, 'sender'), elixirChat),
  };
  const serializedMentions = (mentions || []).map(user => {
    return {
      client: serializeUser(user, elixirChat),
      value: user.value,
    };
  });

  return {
    id: _get(message, 'id') || null,
    tempId: _get(message, 'tempId') || null,
    text: _get(message, 'text') || '',
    timestamp: _get(message, 'timestamp') || '',
    cursor: _get(message, 'cursor') || null,
    sender: serializedSender,
    responseToMessage: serializedResponseToMessage,
    attachments: serializedAttachments,
    mentions: serializedMentions,
    isSubmitting: _get(message, 'isSubmitting') || false,
    submissionErrorCode: _get(message, 'submissionErrorCode') || null,
    openWidget: _get(message, 'openWidget') || false,
    isUnread: _get(message, 'unread') || false,

    // isSystem: _get(message, 'isSystem', false),
    isSystem: !!_get(message, '__typename'), // TODO: remove after supported by backend

    systemType: _get(message, '__typename') || null,
    systemWorkHoursStartAt: _get(message, 'workHoursStartAt') || null,
  };
}
