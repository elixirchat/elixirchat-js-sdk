import { ElixirChat } from '../ElixirChat';
import { gql } from '../GraphQLClient';

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
  url: string;
  name: string;
  bytesSize: number;
  height: number;
  width: number;
  contentType: string | null;
  thumbnails?: Array<IFile>;
}

export function serializeFile(fileData: any, elixirChat: ElixirChat): IFile {
  const file: any = fileData || {};
  let thumbnails = null;

  if (file.thumbnails && file.thumbnails.length) {
    thumbnails = file.thumbnails.map(thumbnail => {
      return serializeFile(thumbnail, elixirChat);
    })
  }

  const uploadsUrlPrefix = elixirChat.apiUrl.replace(/\/$/, '') + '/';
  let fileUrl = '';
  if (file.url) {
    fileUrl = /^uploads/i.test(file.url) ? uploadsUrlPrefix + file.url : file.url;
  }

  return {
    id: file.id || null,
    url: fileUrl,
    name: file.name || '',
    bytesSize: file.bytesSize || 0,
    height: file.height || 0,
    width: file.width || 0,
    duration: file.duration || 0,
    contentType: file.contentType || '',
    isScreenshot: file.isScreenshot || false,
    thumbnails,
  };
}
