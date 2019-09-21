import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/ru'
import { _get, _round } from '../../utilsCommon';
import { isWebImage, getHumanReadableFileSize } from '../../utilsWidget';
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

  maxThumbnailSize = 256;

  componentDidMount(): void {
    const { messages, elixirChatWidget } = this.props;
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);

    elixirChatWidget.widgetChatIframe.contentDocument.addEventListener('keyup', this.onIframeBodyKeyup);
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

  onIframeBodyKeyup = (e) => {
    const { elixirChatWidget } = this.props;
    if (e.which === 27 /* Esc */) {
      elixirChatWidget.closeImagePreview();
    }
    else if (e.which === 37 /* Arrow left */) {
      this.onImagePreviewArrowNavigation(-1);
    }
    else if (e.which === 39 /* Arrow right */) {
      this.onImagePreviewArrowNavigation(1);
    }
  };

  onImagePreviewClick = (e, preview) => {
    const { elixirChatWidget } = this.props;
    this.setState({ currentImagePreview: preview });
    elixirChatWidget.openImagePreview(preview);
    e.preventDefault();
  };

  onImagePreviewArrowNavigation = (delta) => {
    const { imagePreviews, currentImagePreview } = this.state;
    const { elixirChatWidget } = this.props;
    const currentImagePreviewIndex = imagePreviews.map(preview => preview.id).indexOf(currentImagePreview.id);

    let nextImagePreviewIndex = currentImagePreviewIndex + delta;
    if (nextImagePreviewIndex < 0) {
      nextImagePreviewIndex = imagePreviews.length - 1;
    }
    else if (nextImagePreviewIndex >= imagePreviews.length) {
      nextImagePreviewIndex = 0;
    }
    this.setState({
      currentImagePreview: imagePreviews[nextImagePreviewIndex]
    });
    elixirChatWidget.openImagePreview(imagePreviews[nextImagePreviewIndex]);
  };

  shouldHideMessageBalloon = (message) => {
    const hasText = message.text.trim();
    const hasReply = message.responseToMessage;
    const hasFiles = message.files && message.files.length;
    return message.sender.isCurrentClient && !hasText && !hasReply && !hasFiles;
  };

  onTakeScreenshotClick = () => {
    const { elixirChatWidget, onScreenshotRequestFulfilled } = this.props;
    elixirChatWidget.toggleChatVisibility();
    elixirChatWidget.takeScreenshot().then(screenshot => {
      onScreenshotRequestFulfilled(screenshot);
      elixirChatWidget.toggleChatVisibility();
    }).catch(() => {
      elixirChatWidget.toggleChatVisibility();
    });
  };

  render(): void {
    const { processedMessages } = this.state;
    const { onReplyMessage, onSubmitRetry } = this.props;

    return (
      <div className="elixirchat-chat-messages">
        {processedMessages.map(message => (

          <Fragment key={message.id}>

            {message.prependDateTitle && (
              <div className="elixirchat-chat-messages__date-title">
                {dayjs(message.timestamp).calendar(null, {
                  sameDay: '[Сегодня, ] D MMMM',
                  lastDay: '[Вчера, ] D MMMM',
                  lastWeek: 'D MMMM',
                  sameElse: 'D MMMM',
                })}
              </div>
            )}

            {!message.isSystem && (
              <div className={cn({
                'elixirchat-chat-messages__item': true,
                'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
                'elixirchat-chat-messages__item--by-operator': message.sender.isOperator,
              })}>

                {!this.shouldHideMessageBalloon(message) && (
                  <div className="elixirchat-chat-messages__balloon" onDoubleClick={() => onReplyMessage(message.id)}>

                    {!message.sender.isCurrentClient && (
                      <div className="elixirchat-chat-messages__sender">
                        {message.sender.firstName} {message.sender.lastName}
                      </div>
                    )}

                    {Boolean(message.responseToMessage) && (
                      <div className="elixirchat-chat-messages__reply-to">
                        <i className="elixirchat-chat-messages__reply-to-icon icon-reply-right"/>
                        {message.responseToMessage.sender.firstName}&nbsp;
                        {message.responseToMessage.sender.lastName}&nbsp;
                        <span title={message.responseToMessage.text}>
                            {message.responseToMessage.text.substr(0, 100)}
                          </span>
                      </div>
                    )}

                    {message.text && (
                      <div className="elixirchat-chat-messages__text">{message.text}</div>
                    )}

                    {Boolean(message.files) && Boolean(message.files.length) && (
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

                              {(!file.thumbnailUrl && !message.isSubmitting) && (
                                <i className="icon-file"/>
                              )}
                              {message.isSubmitting && (
                                <i className="elixirchat-chat-files__preview-spinner icon-spinner-xs"/>
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
                  </div>
                )}

                {Boolean(message.images) && Boolean(message.images.length) && (
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
                            data-error-message="Файл не найден"
                            onError={e => e.target.parentNode.classList.add('elixirchat-chat-images__item-not-found')}/>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="elixirchat-chat-messages__bottom">
                  {message.isSubmissionError && (
                    <span className="elixirchat-chat-messages__submission-error"
                      title="Нажмите, чтобы отправить еще раз"
                      onClick={() => onSubmitRetry(message)}>
                      Не отправлено
                    </span>
                  )}
                  {!message.isSubmissionError && (
                    <Fragment>
                      {!message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                      {!message.isSystem && (
                        <span className="elixirchat-chat-messages__reply"
                          title="Для ответа также можно дважды кликнуть сообщение"
                          onClick={() => onReplyMessage(message.id)}>
                          Ответить
                        </span>
                      )}
                      {message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                    </Fragment>
                  )}
                </div>
              </div>
            )}

            {message.isSystem && (
              <div className={cn({
                'elixirchat-chat-messages__item': true,
                'elixirchat-chat-messages__item--by-operator': true,
                'elixirchat-chat-messages__item--system': true,
              })}>
                <div className="elixirchat-chat-messages__balloon">
                  <div className="elixirchat-chat-messages__sender">
                    {(message.sender.firstName || '') + ' ' + (message.sender.lastName || '')}
                  </div>
                  <div className="elixirchat-chat-messages__text">
                    Пожалуйста, пришлите скриншот вашего экрана.
                  </div>
                  <button className="elixirchat-chat-messages__take-screenshot"
                    onClick={this.onTakeScreenshotClick}>
                    Сделать скриншот
                  </button>
                </div>
                <div className="elixirchat-chat-messages__bottom">
                  {dayjs(message.timestamp).format('H:mm, D MMMM')}
                </div>
              </div>
            )}

          </Fragment>
        ))}
      </div>
    );
  }
}
