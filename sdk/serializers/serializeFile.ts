import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';
import { extractSerializedData } from '../../utilsCommon';

export const fragmentFile: string = gql`
  fragment fragmentFile on File {
    id
    url
    name
    bytesSize
    height
    width
    contentType
    duration
    thumbnails {
      id
      url
      name
      bytesSize
      height
      width
      contentType
      thumbType
    }
  }
`;

export interface IFile {
  id: string | null;
  name: string;
  bytesSize: number;
  height: number;
  width: number;
  duration: number,
  contentType: string | null;
  thumbnails?: Array<IFile>;
  url: string;
}

export function serializeFileUrl(url: string, elixirChat: ElixirChat): string {
  const uploadsUrlPrefix = elixirChat.apiUrl.replace(/\/$/, '') + '/';
  if (url) {
    return /^uploads/i.test(url) ? uploadsUrlPrefix + url : url;
  }
  else {
    return '';
  }
}

export function serializeFile(data: any, elixirChat: ElixirChat): IFile {
  const { url, thumbnails } = data || {};
  const firstThumbnailUrl = thumbnails?.[0]?.url;
  const firstThumbnail = {
    url: serializeFileUrl(firstThumbnailUrl || url, elixirChat),
  };
  return {
    ...extractSerializedData(data, {
      id: null,
      name: '',
      bytesSize: 0,
      height: 0,
      width: 0,
      duration: 0,
      contentType: '',
      isScreenshot: false,
    }),
    thumbnails: [ firstThumbnail ],
    url: serializeFileUrl(url),
  };
}
