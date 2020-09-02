import { ElixirChat } from '../ElixirChat';
import { gql, insertGraphQlFragments } from '../GraphQLClient';
import { IUser, serializeUser, fragmentUser } from './serializeUser';
import { IFile, serializeFile, fragmentFile } from './serializeFile';
import { extractSerializedData } from '../../utilsCommon';


export const fragmentMessage = insertGraphQlFragments(gql`
  fragment fragmentMessage on Message {
    id
    text
    timestamp
    isUnread
    isSystem
    
    ... on ManualMessage {
      tempId
      isDeleted
      mustOpenWidget
      sender { ...fragmentUser }
      attachments { ...fragmentFile }
      mentions {
        value
        client { ...fragmentUser }
      }
      responseToMessage {
        id
        text
        isDeleted
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


// TODO: update
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
  isDeleted: boolean;
  mentions: Array<{value: string, client: IUser}>,
  systemType: string | null;
  systemWorkHoursStartAt: string | null;
  attachments: Array<IFile>,
  isSubmitting: boolean,
  submissionErrorCode: number | null,
}


export function serializeMessage(data: any, elixirChat: ElixirChat): IMessage {
  let { sender, responseToMessage, attachments, mentions } = data || {};
  return {
    ...extractSerializedData(data, {
      id: null,
      tempId: null,
      cursor: null,
      text: '',
      timestamp: '',
      mustOpenWidget: false,
      submissionErrorCode: null,
      isSubmitting: false,
      isUnread: false,
      isSystem: false,
      isDeleted: false,
    }),
    sender: serializeUser(sender, elixirChat),
    attachments: (attachments || []).map(attachment => serializeFile(attachment, elixirChat)),
    responseToMessage: {
      ...extractSerializedData(responseToMessage, {
        id: null,
        text: '',
        isDeleted: false,
      }),
      sender: serializeUser(responseToMessage?.sender, elixirChat),
    },
    mentions: (mentions || []).map(mention => {
      return {
        client: serializeUser(mention.client, elixirChat),
        value: mention.value,
      };
    }),
    systemData: {
      type: data?.__typename || null,
      workHoursStartAt: data?.workHoursStartAt || null,
    },
  };
}
