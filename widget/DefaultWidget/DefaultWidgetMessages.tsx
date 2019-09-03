import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/ru'
import { _get, _round, isWebImage, getHumanReadableFileSize } from '../../utilsCommon';
import { DefaultWidgetMessagesStyles } from './styles';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: any;
  messages: Array<any>;
  onLoadPreviousMessages: any;
}

export interface IDefaultWidgetMessagesState {
  messages: Array<any>;
}

export class DefaultWidgetMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    processedMessages: [],
    currentImagePreview: {},
    imagePreviews: [],
  };

  maxThumbnailSize = 250;

  componentDidMount(): void {
    const { messages, elixirChatWidget } = this.props;
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);
    elixirChatWidget.injectIframeStyles(DefaultWidgetMessagesStyles);
    this.setProcessedMessages(messages);
  }

  componentDidUpdate(prevProps): void {
    const { messages } = this.props;
    if (prevProps.messages !== messages) {
      this.setProcessedMessages(messages);
    }
  }

  setProcessedMessages = (messages) => {
    let imagePreviews = [];
    const processedMessages = messages.map((message, i) => {
      const processedMessage = { ...message };
      const previousMessage = messages[i - 1];
      if (previousMessage) {
        const isDayEarlier = dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));
        if (isDayEarlier) {
          processedMessage.prependDateTitle = true;
        }
      }
      if (processedMessage.attachments.length) {
        const { files, images } = this.processAttachments(message.attachments, message.sender);
        imagePreviews = imagePreviews.concat(images);
        processedMessage.files = files;
        processedMessage.images = images;
      }

      return processedMessage;
    });

    this.setState({ processedMessages, imagePreviews });
  };

  processAttachments = (attachments, sender) => {
    const images = [];
    const files = [];

    attachments.forEach(attachment => {
      const thumbnailUrl = _get(attachment, 'thumbnails[0].url', null);
      const thumbnailRatio = this.maxThumbnailSize / Math.max(attachment.width, attachment.height);
      const thumbnailWidth = attachment.width * thumbnailRatio;
      const thumbnailHeight = attachment.height * thumbnailRatio;

      if (isWebImage(attachment.contentType) && thumbnailWidth && thumbnailHeight) {
        images.push({
          ...attachment,
          sender,
          thumbnailUrl,
          thumbnailWidth,
          thumbnailHeight,
        });
      }
      else {
        files.push({
          ...attachment,
          thumbnailUrl,
        })
      }
    });
    return { images, files };
  };

  onImagePreviewClick = (e, preview) => {
    console.warn('___ onImagePreviewClick', preview);
  };

  render(): void {
    const { processedMessages } = this.state;
    window.__messages = processedMessages;

    return (
      <div className="elixirchat-chat-messages">
        {processedMessages.map(message => (
          <Fragment key={message.id}>
            {message.prependDateTitle && (
              <div className="elixirchat-chat-messages__date-title">
                {dayjs(message.timestamp).calendar(null, { // TODO: handle US date format e.g. "2:30 PM, July 10"
                  sameDay: '[Сегодня, ] D MMMM',
                  lastDay: '[Вчера, ] D MMMM',
                  lastWeek: 'D MMMM',
                  sameElse: 'D MMMM',
                })}
              </div>
            )}
            <div className={cn({
              'elixirchat-chat-messages__item': true,
              'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
              'elixirchat-chat-messages__item--by-agent': message.sender.isOperator,
            })}>
              <div className="elixirchat-chat-messages__balloon">
                <div className="elixirchat-chat-messages__sender">
                  {message.sender.isCurrentClient ? 'Я' : (message.sender.firstName || '') + ' ' + (message.sender.lastName || '')}
                </div>
                {Boolean(message.responseToMessage) && (
                  <div className="elixirchat-chat-messages__reply-to">
                    <i className="elixirchat-chat-messages__reply-to-icon"/>
                    {message.responseToMessage.sender.firstName}&nbsp;
                    {message.responseToMessage.sender.lastName}&nbsp;
                    <span title={message.responseToMessage.text}>
                        {message.responseToMessage.text.substr(0, 100)}
                      </span>
                  </div>
                )}
                <div className="elixirchat-chat-messages__text">{message.text}</div>

                {Boolean(message.files) && (
                  <ul className="elixirchat-chat-files">
                    {message.files.map(file => (
                      <li key={file.id} className="elixirchat-chat-files__item">
                        <a className={cn({
                          ['elixirchat-chat-files__preview']: true,
                          ['elixirchat-chat-files__preview-image']: file.thumbnailUrl,
                          ['elixirchat-chat-files__preview-submitting']: message.isSubmitting,
                        })}
                          style={{ backgroundImage: `url(${file.thumbnailUrl})` }}
                          href={file.url}
                          target="_blank">
                          {message.isSubmitting && (
                            <i className="elixirchat-chat-files__preview-spinner"/>
                          )}
                        </a>
                        <div className="elixirchat-chat-files__text">
                          <a className="elixirchat-chat-files__text-link" href={file.url} target="_blank">{file.name}</a>
                          <br/>
                          <span className="elixirchat-chat-files__text-secondary">
                              {message.isSubmitting ? 'Загрузка...' : getHumanReadableFileSize('ru-RU', file.bytesSize)}
                            </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {Boolean(message.images) && (
                  <ul className="elixirchat-chat-images">
                    {message.images.map(image => (
                      <li key={image.id} className="elixirchat-chat-images__item">
                        <a className="elixirchat-chat-images__link"
                          href={image.url}
                          target="_blank"
                          onClick={e => this.onImagePreviewClick(e, { ...image, sender: message.sender })}>
                          <img className="elixirchat-chat-images__img"
                            width={_round(image.thumbnailWidth, 2)}
                            height={_round(image.thumbnailHeight)}
                            src={image.thumbnailUrl}
                            alt={image.name}
                            onError={e => e.target.classList.add('elixirchat-chat-images__img-not-found')}/>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

              </div>
              <div className="elixirchat-chat-messages__timestamp">
                {dayjs(message.timestamp).format('H:mm, D MMMM') /* TODO: handle US date format e.g. "2:30 PM, July 10" */}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
