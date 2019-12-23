import { ElixirChat } from '../ElixirChat';
import { gql, insertGraphQlFragments } from '../GraphQLClient';
import { _get } from '../../utilsCommon';
import {
  IUser,
  serializeUser,
  fragmentClient,
  fragmentCompanyEmployee,
} from './serializeUser';

import {
  IFile,
  serializeFile,
  fragmentFile,
} from './serializeFile';

export const fragmentMessage = insertGraphQlFragments(gql`
  fragment fragmentMessage on Message {
    id
    tempId
    text
    timestamp
    system
    unread
    sender {
      ... on Client { ...fragmentClient }
      ... on CompanyEmployee { ...fragmentCompanyEmployee }
    }
    attachments {
      ...fragmentFile
    }
    data {
      ... on SystemMessageData {
        type
        author {
          ...fragmentCompanyEmployee
        }
        whenWouldWork
      }
      ... on NotSystemMessageData {
        mentions {
          ...on Client { ...fragmentClient }
          ...on MentionAlias { value }
        },
        responseToMessage {
          id
          text
          sender {
            __typename
            ... on Client { ...fragmentClient }
            ... on CompanyEmployee { ...fragmentCompanyEmployee }
          }
        }
      }
    }
  }
`, {
  fragmentClient,
  fragmentCompanyEmployee,
  fragmentFile,
});


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
  mentions: Array<IUser & {value: string}>,
  systemData: null | {
    type: string | null;
  },
  attachments: Array<IFile>,
  isSubmitting: boolean,
  submissionErrorCode: number | null,
}

export interface ISerializeMessageOptions {
  apiUrl?: string;
  currentClientId?: string;
}

export function serializeMessage(message: any, elixirChat: ElixirChat): IMessage {
  let { sender = {}, attachments, data = {} } = message;
  let { responseToMessage, author = {} } = data;

  const serializedSender = serializeUser({ ...sender, ...author }, elixirChat);
  const serializedAttachments = (attachments || []).map(attachment => serializeFile(attachment, elixirChat));

  const responseToMessageSender = _get(responseToMessage, 'sender', {});
  const serializedResponseToMessage = {
    id: _get(responseToMessage, 'id') || null,
    text: _get(responseToMessage, 'text') || '',
    sender: serializeUser(responseToMessageSender, elixirChat),
  };
  const serializedMentions = (_get(data, 'mentions') || []).map(user => {
    return {
      ...serializeUser(user, elixirChat),
      value: user.value, // value === 'ALL' when mentioning @all
    };
  });

  const isSystem = _get(message, 'system', false);

  return {
    id: _get(message, 'id') || null,
    tempId: _get(message, 'tempId') || null,
    text: _get(message, 'text') || '',
    timestamp: _get(message, 'timestamp') || '',
    cursor: _get(message, 'cursor') || null,
    sender: serializedSender,
    responseToMessage: serializedResponseToMessage.id ? serializedResponseToMessage : null,
    attachments: serializedAttachments,
    isSubmitting: _get(message, 'isSubmitting') || false,
    submissionErrorCode: _get(message, 'submissionErrorCode') || null,
    isUnread: _get(message, 'unread') || false,
    openWidget: _get(message, 'openWidget') || false,
    mentions: serializedMentions,
    isSystem,
    systemData: !isSystem ? null : {
      type: _get(message, 'data.type') || null,
      whenWouldWork: _get(message, 'data.whenWouldWork') || null,
    },
  };
}
