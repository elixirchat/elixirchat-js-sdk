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
  thumbType?: string | null;
  thumbnails?: Array<IFile>;
}

export interface ISerializeFileOptions {
  apiUrl?: string;
  currentClientId?: string;
}

export function serializeFile(fileData: any, elixirChat: ElixirChat): IFile {
  const file: any = fileData || {};
  let thumbnails = null;

  if (file.thumbnails && file.thumbnails.length) {
    thumbnails = file.thumbnails.map(thumbnail => {
      const serializedThumbnail = serializeFile(thumbnail, elixirChat);
      return {
        id: serializedThumbnail.id,
        url: serializedThumbnail.url,
        name: serializedThumbnail.name,
        bytesSize: serializedThumbnail.bytesSize,
        width: serializedThumbnail.width,
        height: serializedThumbnail.height,
        contentType: serializedThumbnail.contentType,
        thumbType: thumbnail.thumbType || null,
      };
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
    thumbnails: thumbnails,
    contentType: file.contentType || null,
    isScreenshot: file.isScreenshot || false,
  };
}
