import { ElixirChat } from '../ElixirChat';
import { gql, insertGraphQlFragments } from '../GraphQLClient';
import { IUser, serializeUser, fragmentUser } from './serializeUser';
import { IFile, serializeFile, fragmentFile } from './serializeFile';

export const fragmentMessage = insertGraphQlFragments(gql`
  fragment fragmentMessage on Message {
    id
    text
    timestamp
    isUnread
    isSystem
    
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

export function serializeMessage(message: any, elixirChat: ElixirChat): IMessage {
  let { sender, responseToMessage, attachments, mentions } = message;

  const serializedSender = serializeUser(sender, elixirChat);
  const serializedAttachments = (attachments || []).map(attachment => serializeFile(attachment, elixirChat));

  const serializedResponseToMessage = {
    id: responseToMessage?.id || null,
    text: responseToMessage?.text || '',
    sender: serializeUser(responseToMessage?.sender, elixirChat),
  };
  const serializedMentions = (mentions || []).map(user => {
    return {
      client: serializeUser(user, elixirChat),
      value: user.value,
    };
  });

  return {
    id: message?.id || null,
    tempId: message?.tempId || null,
    text: message?.text || '',
    timestamp: message?.timestamp || '',
    cursor: message?.cursor || null,
    sender: serializedSender,
    responseToMessage: serializedResponseToMessage,
    attachments: serializedAttachments,
    mentions: serializedMentions,
    isSubmitting: message?.isSubmitting || false,
    submissionErrorCode: message?.submissionErrorCode || null,
    openWidget: message?.openWidget || false,
    isUnread: message?.isUnread || false,
    isSystem: message?.isSystem || false,
    systemType: message?.__typename || null,
    systemWorkHoursStartAt: message?.workHoursStartAt || null,
  };
}
