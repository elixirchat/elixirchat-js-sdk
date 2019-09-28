import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import AutoLinkText from 'react-autolink-text2';
import { _get, _round } from '../../utilsCommon';
import { isWebImage, getHumanReadableFileSize, inflectDayJSWeekDays } from '../../utilsWidget';
import { getCompatibilityFallback } from '../../sdk/ScreenshotTaker';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: any;
  messages: Array<any>;
  onLoadPreviousMessages: any;
}

export interface IDefaultWidgetMessagesState {
  messages: Array<any>;
}

export class ChatMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    processedMessages: [],
    currentImagePreview: {},
    imagePreviews: [],
    screenshotFallback: null,
  };

  maxThumbnailSize = 256;

  componentDidMount(): void {
    const { messages } = this.props;
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);

    this.setProcessedMessages(messages);
    this.setState({
      screenshotFallback: getCompatibilityFallback(),
    });
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
    const { onImagePreviewOpen } = this.props;
    const { imagePreviews } = this.state;
    this.setState({ currentImagePreview: preview });
    onImagePreviewOpen(preview, imagePreviews);
    e.preventDefault();
  };

  shouldHideMessageBalloon = (message) => {
    const hasText = message.text.trim();
    const hasReply = message.responseToMessage;
    const hasFiles = message.files && message.files.length;
    return message.sender.isCurrentClient && !hasText && !hasReply && !hasFiles;
  };

  scrollToMessage = (message) => {
    const highlightedClassName = 'elixirchat-chat-messages__item--highlighted';
    const messageDOMElement = this.refs[`message-${message.id}`];
    if (messageDOMElement) {
      messageDOMElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      messageDOMElement.classList.add(highlightedClassName);
      setTimeout(() => {
        messageDOMElement.classList.remove(highlightedClassName);
      }, 1000);
    }
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

  renderKeyShortcut = (keySequence) => {
    return (
      <Fragment>
        {keySequence.split(/\+/).map((key, index) => {
          return (
            <Fragment key={index}>
              {!!index && '+'}<kbd>{key}</kbd>
            </Fragment>
          )
        })}
      </Fragment>
    );
  };

  render(): void {
    const { processedMessages, screenshotFallback } = this.state;
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
              <div ref={`message-${message.id}`} className={cn({
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
                      <div className="elixirchat-chat-messages__reply-message"
                        onClick={() => this.scrollToMessage(message.responseToMessage)}>

                        <i className="elixirchat-chat-messages__reply-message-icon icon-reply-right"/>
                        {message.responseToMessage.sender.firstName}&nbsp;
                        {message.responseToMessage.sender.lastName}&nbsp;
                        <span title={message.responseToMessage.text}>
                            {message.responseToMessage.text.substr(0, 100)}
                          </span>
                      </div>
                    )}

                    {message.text && (
                      <div className="elixirchat-chat-messages__text">
                        <AutoLinkText
                          linkProps={{ target: '_blank', rel: 'noopener noreferrer' }}
                          text={message.text}/>
                      </div>
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
                        <span className="elixirchat-chat-messages__reply-button"
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
                    {message.sender.firstName} {message.sender.lastName}
                    {(!message.sender.firstName && !message.sender.lastName) && 'Служба поддержки'}
                  </div>

                  {message.systemData.type === 'SCREENSHOT_REQUESTED' && (
                    <Fragment>
                      <div className="elixirchat-chat-messages__text">
                        Пожалуйста, пришлите скриншот вашего экрана.
                        {(Boolean(screenshotFallback) && Boolean(screenshotFallback.pressKey)) && (
                          <Fragment>
                            &nbsp;Для этого нажмите {this.renderKeyShortcut(screenshotFallback.pressKey)}
                            {screenshotFallback.pressKeySecondary && (
                              <Fragment>&nbsp;({this.renderKeyShortcut(screenshotFallback.pressKeySecondary)})</Fragment>
                            )},
                            а затем вставьте результат в текстовое поле.
                          </Fragment>
                        )}
                      </div>
                      {!Boolean(screenshotFallback) && (
                        <button className="elixirchat-chat-messages__take-screenshot"
                          onClick={this.onTakeScreenshotClick}>
                          Сделать скриншот
                        </button>
                      )}
                    </Fragment>
                  )}

                  {/*
                    TODO: replace ALL_OPERATORS_OFFLINE w/ actual message type
                    TODO: replace message.systemData.workHoursStartAt w/ actual field
                  */}
                  {message.systemData.type === 'ALL_OPERATORS_OFFLINE' && (
                    <Fragment>
                      <div className="elixirchat-chat-messages__text">
                        К сожалению, все операторы поддержки сейчас оффлайн
                        {message.systemData.workHoursStartAt &&
                          ', но будут снова в сети ' +
                          inflectDayJSWeekDays('ru-RU', dayjs(message.systemData.workHoursStartAt).calendar(null, {
                            nextWeek: '[в] dddd [в] H:mm',
                            nextDay: '[завтра в] H:mm',
                            sameDay: '[сегодня в] H:mm',
                            lastDay: 'D MMMM [в] H:mm',
                            lastWeek: 'D MMMM [в] H:mm',
                            sameElse: 'D MMMM [в] H:mm',
                          })
                        )}.
                      </div>
                    </Fragment>
                  )}

                </div>
                <div className="elixirchat-chat-messages__bottom">
                  {dayjs(message.timestamp).format('H:mm')}
                </div>
              </div>
            )}

          </Fragment>
        ))}
      </div>
    );
  }
}
