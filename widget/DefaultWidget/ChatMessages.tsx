import React, { Component, Fragment } from 'react';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import {
  cn,
  _round,
  _findIndex,
  isWebImage,
  isWebVideo,
  detectBrowser,
  getUserFullName,
  randomDigitStringId,
} from '../../utilsCommon';

import {
  inflect,
  humanizeFileSize,
  humanizeUpcomingDate,
  humanizeTimezoneName,
  generateReplyMessageQuote,
  exposeComponentToGlobalScope,
  isMobileSizeScreen,
} from '../../utilsWidget';

import { ElixirChatWidget } from '../ElixirChatWidget';
import { FormattedMarkdown } from './FormattedMarkdown';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { serializeMessage } from '../../sdk/serializers/serializeMessage';
import {
  JOIN_ROOM_SUCCESS,
  TYPING_STATUS_CHANGE,
  MESSAGES_CHANGE_HISTORY,
  MESSAGES_RECEIVE,
  ERROR_ALERT,
} from '../../sdk/ElixirChatEventTypes';

import {
  IMAGE_PREVIEW_OPEN,
  TEXTAREA_VERTICAL_RESIZE,
  REPLY_MESSAGE,
  WIDGET_IFRAME_READY,
  WIDGET_POPUP_OPEN,
} from '../ElixirChatWidgetEventTypes';


export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IDefaultWidgetMessagesState {
  isLoading: boolean;
  isLoadingPrecedingMessageHistory: boolean;
  hasReachedBeginningOfMessageHistory: boolean;
  processedMessages: Array<object>,
  fullScreenPreviews: Array<object>,
  screenshotFallback: object | null,
  scrollBlockBottomOffset: number | null;
  currentlyTypingUsers: Array<object>;
}

export class ChatMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    isLoading: false,
    isLoadingPrecedingMessageHistory: false,
    hasReachedBeginningOfMessageHistory: false,
    processedMessages: [],
    fullScreenPreviews: [],
    screenshotFallback: null,
    scrollBlockBottomOffset: null,
    currentlyTypingUsers: [], // TODO: fix
  };

  MAX_THUMBNAIL_SIZE: number = isMobileSizeScreen() ? 208 : 256;
  MESSAGE_CHUNK_SIZE: number = 20;
  MARK_AS_READ_TIMEOUT: number = 2000; // ms

  scrollBlock: { current: HTMLElement } = React.createRef();
  scrollBlockInner: { current: HTMLElement } = React.createRef();
  messageVisibilityObserver: IntersectionObserver = null;
  messageRefs: object = {};

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope(this, elixirChatWidget);

    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);

    this.setState({
      screenshotFallback: getScreenshotCompatibilityFallback()
    });

    elixirChatWidget.on(WIDGET_POPUP_OPEN, () => {
      if (detectBrowser() === 'safari') {
        this.preventSafariFromLockingScroll();
      }
    });
    elixirChatWidget.on(JOIN_ROOM_SUCCESS, this.loadInitialMessages);
    elixirChatWidget.on(MESSAGES_RECEIVE, this.onMessageReceive);

    elixirChatWidget.on([MESSAGES_CHANGE_HISTORY, MESSAGES_RECEIVE], () => {
      this.onMessageHistoryUpdate(elixirChatWidget.messageHistory);
    });

    requestAnimationFrame(() => {
      this.messageVisibilityObserver = new IntersectionObserver(this.onIntersectionObserverTrigger, {
        root: this.scrollBlock.current,
        threshold: 0.9, // triggers when 90% of message is visible
      });
    });

    elixirChatWidget.on(TEXTAREA_VERTICAL_RESIZE, scrollBlockBottomOffset => {
      const hasUserScroll = this.hasUserScroll();
      this.setState({ scrollBlockBottomOffset });
      if (!hasUserScroll) {
        this.scrollToBottom();
      }
    });

    // TODO: fix
    // elixirChatWidget.on(TYPING_STATUS_CHANGE, currentlyTypingUsers => {
    //   this.setState({ currentlyTypingUsers });
    // });
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.off(MESSAGES_RECEIVE, this.onMessageReceive);
    this.messageVisibilityObserver?.disconnect?.();
  }

  loadInitialMessages = () => {
    const { elixirChatWidget } = this.props;
    this.setState({ isLoading: true });

    elixirChatWidget.fetchMessageHistory(this.MESSAGE_CHUNK_SIZE)
      .then(() => {
        if (elixirChatWidget.widgetIsPopupOpen) {
          this.scrollToFirstUnreadMessageOnce();
        }
        else {
          elixirChatWidget.on(WIDGET_POPUP_OPEN, this.scrollToFirstUnreadMessageOnce);
        }
      })
      .catch(e => {
        elixirChatWidget.triggerEvent(ERROR_ALERT, {
          customMessage: e.errorMessage,
          retryCallback: this.loadInitialMessages,
          error: e.rawError,
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  loadPrecedingMessages = () => {
    const { elixirChatWidget } = this.props;
    const { isLoadingPrecedingMessageHistory, hasReachedBeginningOfMessageHistory } = this.state;
    const scrollBlock = this.scrollBlock.current;
    const initialScrollHeight = scrollBlock.scrollHeight;

    if (!isLoadingPrecedingMessageHistory && !hasReachedBeginningOfMessageHistory) {
      this.setState({ isLoadingPrecedingMessageHistory: true });

      elixirChatWidget.fetchPrecedingMessageHistory(this.MESSAGE_CHUNK_SIZE)
        .then(() => {
          scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
        })
        .catch(e => {
          elixirChatWidget.triggerEvent(ERROR_ALERT, {
            customMessage: e.errorMessage,
            retryCallback: this.loadPrecedingMessages,
            error: e.rawError,
          });
          throw e;
        })
        .finally(() => {
          this.setState({ isLoadingPrecedingMessageHistory: false });
        });
    }
  };

  onMessageReceive = (message) => {
    const { elixirChatWidget } = this.props;
    const {
      sender: { isCurrentClient },
      mustOpenWidget: shouldOpenPopup,
    } = message;

    if (shouldOpenPopup) {
      elixirChatWidget.openPopup();
    }
    requestAnimationFrame(() => {
      const shouldScrollMessagesToBottom = document.hasFocus()
        && elixirChatWidget.widgetIsPopupOpen
        && (isCurrentClient || !this.hasUserScroll());

      if (shouldScrollMessagesToBottom) {
        this.scrollToBottom();
      }
    });
  };

  onMessageHistoryUpdate = (messageHistory) => {

    // TODO: fix w/ both initial & preceding messages
    const hasReachedBeginningOfMessageHistory = messageHistory.length < this.MESSAGE_CHUNK_SIZE;
    const { processedMessages, fullScreenPreviews } = this.processMessages(messageHistory, hasReachedBeginningOfMessageHistory);

    this.setState({
      processedMessages,
      fullScreenPreviews,
      hasReachedBeginningOfMessageHistory,
    });

    requestAnimationFrame(() => {
      for (let messageId in this.messageRefs) {
        this.messageVisibilityObserver.observe( this.messageRefs[messageId] );
      }
    });
  };

  processMessages = (messages, hasReachedBeginningOfMessageHistory) => {
    let firstEverMessageInHistory = hasReachedBeginningOfMessageHistory ? messages[0] : null;
    let fullScreenPreviews = [];

    let processedMessages = messages.map((message, i) => {
      let files = [];
      let previews = [];
      let showDateLabel = false;

      const previousMessage = messages[i - 1] || {};
      const isDifferentDateFromPreviousMessage = previousMessage.id
        && dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));

      if (isDifferentDateFromPreviousMessage) {
        showDateLabel = true;
      }
      if (!message.isDeleted) {
        let {} = { files, previews } = this.processAttachments(message.attachments);
        fullScreenPreviews = fullScreenPreviews.concat(previews);
      }
      const hasText = message.text.trim();
      const hasFiles = files.length;
      const hasReply = message.responseToMessage.id && !message.responseToMessage.isDeleted;
      const hasPreviewsOnly = message.sender.isCurrentClient && !hasText && !hasReply && !hasFiles;

      return {
        ...message,
        files,
        previews,
        showDateLabel,
        hasPreviewsOnly,
      };
    });
    if (hasReachedBeginningOfMessageHistory && (firstEverMessageInHistory?.sender?.isClient || !firstEverMessageInHistory)) {
      processedMessages = [
        this.generateNewClientPlaceholderMessage(firstEverMessageInHistory),
        ...processedMessages,
      ];
    }
    return { processedMessages, fullScreenPreviews };
  };

  processAttachments = (attachments) => {
    const previews = [];
    const files = [];

    attachments.forEach(attachment => {
      const thumbnailRatio = this.MAX_THUMBNAIL_SIZE / Math.max(attachment.width, attachment.height);
      let thumbnailWidth = attachment.width;
      let thumbnailHeight = attachment.height;

      if (thumbnailRatio < 1) {
        thumbnailWidth = attachment.width * thumbnailRatio;
        thumbnailHeight = attachment.height * thumbnailRatio;
      }
      const isImage = isWebImage(attachment.contentType) && thumbnailWidth && thumbnailHeight;
      const isVideo = isWebVideo(attachment.contentType) && thumbnailWidth && thumbnailHeight;

      if (isImage || isVideo) {
        previews.push({
          ...attachment,
          thumbnailWidth,
          thumbnailHeight,
          previewType: isImage ? 'image' : 'video',
        });
      }
      else {
        files.push(attachment)
      }
    });
    return { previews, files };
  };

  generateNewClientPlaceholderMessage = (firstEverMessageInHistory) => {
    const { elixirChatWidget } = this.props;

    const placeholderMessage = serializeMessage({
      id: randomDigitStringId(6),
      isSystem: true,
      timestamp: firstEverMessageInHistory?.timestamp || new Date().toISOString(),
      __typename: 'NewClientPlaceholderMessage',
    }, elixirChatWidget);

    return {
      ...placeholderMessage,
      showGroupChatLabel: true,
    };
  };

  scrollToFirstUnreadMessageOnce = () => {
    return;

    const { elixirChatWidget } = this.props;
    const { messageHistory, lastReadMessageId } = elixirChatWidget;
    const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });
    elixirChatWidget.off(WIDGET_POPUP_OPEN, this.scrollToFirstUnreadMessageOnce);

    // If lastReadMessageId isn't within the latest loaded chunk, it means it precedes currently loaded
    // messages, therefore the scroll must be set all the way up to the beginning
    const lastReadMessagePrecedesLoadedMessageHistory = lastReadMessageId && !lastReadMessageIndex;

    if (!lastReadMessagePrecedesLoadedMessageHistory) {
      requestAnimationFrame(() => {
        const firstUnreadMessage = messageHistory[lastReadMessageIndex + 1];
        const messageElementToScrollTo = this.messageRefs[firstUnreadMessage?.id];

        console.error('__ SCROLL TO 1ST UNREAD', {
          lastReadMessageId,
          lastReadMessageIndex,
          firstUnreadMessage,
        }, messageElementToScrollTo);

        if (messageElementToScrollTo) {
          setTimeout(() => {
            messageElementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }, 500);
        }
        else {
          this.scrollToBottom();
        }
      });
    }
  };

  hasUserScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    return scrollBlock.scrollTop <= scrollBlock.scrollHeight - scrollBlock.offsetHeight - 30;
  };

  scrollToBottom = () => {
    setTimeout(() => {
      this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
    });
  };

  onIntersectionObserverTrigger = (entries) => {
    const { elixirChatWidget } = this.props;
    const { messageHistory } = elixirChatWidget;
    const entry = entries[0];
    const messageElement = entry.target;

    console.warn('__ is intersecting 1', entry.isIntersecting, messageElement, {
      entry,
      messageData: this.getDatasetValue(messageElement, 'messageData'),
    });

    if (entry.isIntersecting) {
      this.setDatasetValues(messageElement, { isMessageWithinViewport: true });
      const messageData = this.getDatasetValue(messageElement, 'messageData');
      if (messageData.isUnread) {
        this.onScrollOverUnreadMessage(messageData.id);
      }
      if (messageData.id === messageHistory[0]?.id) {
        this.loadPrecedingMessages();
      }
    }
    else {
      this.setDatasetValues(messageElement, { isMessageWithinViewport: false });
    }
  };

  onScrollOverUnreadMessage = (messageId) => {
    const { elixirChatWidget } = this.props;
    setTimeout(() => {
      const messageElement = this.messageRefs[messageId];
      const isMessageStillWithinViewportAfterTimeout = this.getDatasetValue(messageElement, 'isMessageWithinViewport');
      if (isMessageStillWithinViewportAfterTimeout) {
        elixirChatWidget.setLastReadMessage(messageId);
      }
    }, this.MARK_AS_READ_TIMEOUT);
  };

  getDatasetValue = (element, key) => {
    let value;
    try {
      value = JSON.parse(element.dataset[key]);
    }
    catch (e) {}
    return value;
  };

  setDatasetValues = (element, values) => {
    for (let key in values) {
      element.dataset[key] = JSON.stringify( values[key] );
    }
  };

  // Hack to fix weird Safari bug when it disables scrolling of this.scrollBlock
  // when new messages were received while the popup was closed
  preventSafariFromLockingScroll = () => {
    const { backgroundColor = '' } = this.scrollBlock.current.style.backgroundColor;
    this.scrollBlock.current.style.backgroundColor = 'inherit';
    setTimeout(() => {
      this.scrollBlock.current.style.backgroundColor = backgroundColor;
    });
  };

  onReplyOriginalMessageClick = (messageId) => {
    const flashedClassName = 'elixirchat-chat-messages__item--flashed';
    const messageElement = this.messageRefs[messageId];

    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add(flashedClassName);
      requestAnimationFrame(() => {
        messageElement.classList.remove(flashedClassName);
      },0);
    }
  };

  onReplyButtonClick = (messageId) => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.triggerEvent(REPLY_MESSAGE, messageId);
  };

  onPreviewClick = (e, preview, sender) => {
    const { elixirChatWidget } = this.props;
    const { fullScreenPreviews } = this.state;
    elixirChatWidget.triggerEvent(IMAGE_PREVIEW_OPEN, {
      preview,
      sender,
      gallery: fullScreenPreviews,
    });
    e.preventDefault();
  };

  onTakeScreenshotClick = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.closePopup();
    elixirChatWidget.takeScreenshot();
  };

  formatVideoDuration = (durationInSeconds) => {
    const totalHours = Math.floor(durationInSeconds / 60 / 60);
    const totalMinutes = Math.floor(durationInSeconds / 60);
    const leftoverMinutes = totalMinutes - (totalHours * 60);
    const leftoverSeconds = Math.round(durationInSeconds - (totalMinutes * 60));
    const durationArr = [
      leftoverMinutes.toString().padStart(2, '0'),
      leftoverSeconds.toString().padStart(2, '0'),
    ];
    if (totalHours) {
      durationArr.unshift(
        totalHours.toString().padStart(2, '0')
      )
    }
    return durationArr.join(':');
  };

  renderKeyShortcut = (keySequence) => {
    return (
      <Fragment>
        {keySequence.split(/\+/).map((key, index) => {
          return (
            <Fragment key={index}>
              {Boolean(index) && '+'}<kbd>{key}</kbd>
            </Fragment>
          )
        })}
      </Fragment>
    );
  };

  renderSubmissionErrorMessage = (message) => {
    const { elixirChatWidget } = this.props;
    const defaultMessage = (
      <Fragment>
        Ошибка отправки
        <span className="elixirchat-chat-messages__submission-error-link"
          onClick={() => elixirChatWidget.retrySendMessage(message)}>
          Еще раз
        </span>
      </Fragment>
    );
    const badConnectionMessage = (
      <Fragment>
        Не отправлено
        <span className="elixirchat-chat-messages__submission-error-link"
          onClick={() => elixirChatWidget.retrySendMessage(message)}>
          Еще раз
        </span>
      </Fragment>
    );
    const unsupportedFileTypeMessage = (
      <Fragment>Вложения такого типа<br/> не поддерживаются</Fragment>
    );
    const tooLargeFileMessage = (
      <Fragment>Поддерживаются файлы до 5Мб</Fragment>
    );
    const messageByErrorCode = {
      '415': unsupportedFileTypeMessage,
      '413': tooLargeFileMessage,
      '503': badConnectionMessage,
    };
    return messageByErrorCode[message.submissionErrorCode] || defaultMessage;
  };

  createMessageRef = (messageElement, message) => {
    if (messageElement) {
      const { id, isUnread } = message;
      this.setDatasetValues(messageElement, {
        messageData: { id, isUnread }
      });
      this.messageRefs[message.id] = messageElement;
    }
  };

  render() {
    const { elixirChatWidget, className } = this.props;
    const {
      processedMessages,
      screenshotFallback,
      isLoading,
      isLoadingPrecedingMessageHistory,
      scrollBlockBottomOffset,
      currentlyTypingUsers,
    } = this.state;

    return (
      <div className={cn('elixirchat-chat-scroll', className)}
        style={{ bottom: scrollBlockBottomOffset }}
        ref={this.scrollBlock}>

        <i className={cn({
          'elixirchat-chat-scroll-progress-bar': true,
          'elixirchat-chat-scroll-progress-bar--animating': isLoadingPrecedingMessageHistory,
        })}/>

        <div className={cn({
          'elixirchat-chat-messages': true,
          'elixirchat-chat-messages--loading': isLoading,
        })} ref={this.scrollBlockInner}>

          {processedMessages.map(message => (
            <Fragment key={message.id}>

              {message.showGroupChatLabel && !elixirChatWidget.room.isPrivate && (
                <div className="elixirchat-chat-messages__group-chat-label">
                  Это групповой чат поддержки для всех членов {elixirChatWidget.room.title}
                </div>
              )}

              {message.showDateLabel && (
                <div className="elixirchat-chat-messages__date-title">
                  {dayjs(message.timestamp).calendar(null, {
                    sameDay: '[Сегодня, ] D MMMM',
                    lastDay: '[Вчера, ] D MMMM',
                    lastWeek: 'D MMMM',
                    sameElse: 'D MMMM',
                  })}
                </div>
              )}

              {!message.isSystem && !message.isDeleted && (
                <div className={cn({
                  'elixirchat-chat-messages__item': true,
                  'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
                  'elixirchat-chat-messages__item--by-operator': message.sender.isOperator,
                  'elixirchat-chat-messages__item--by-another-client': !message.sender.isOperator && !message.sender.isCurrentClient,
                  'elixirchat-chat-messages__item--unread': message.isUnread,
                })}
                  ref={element => this.createMessageRef(element, message)}>

                  <div className="elixirchat-chat-messages__inner">
                    {!message.hasPreviewsOnly && (
                      <div className="elixirchat-chat-messages__balloon"
                        onDoubleClick={() => this.onReplyButtonClick(message.id)}>

                        {!message.sender.isCurrentClient && (
                          <div className="elixirchat-chat-messages__sender">
                            <b>{getUserFullName(message.sender) || elixirChatWidget.widgetMainTitle}</b>
                            {Boolean(message.mentions.length) && (
                              <Fragment>
                                &nbsp;→ @&nbsp;
                                {message.mentions.map(mention => {
                                  return mention.value === 'ALL' ? 'Все' : getUserFullName(mention.client, '\u00A0');
                                }).join(', ')}
                              </Fragment>
                            )}
                          </div>
                        )}

                        {Boolean(message.responseToMessage.id) && !message.responseToMessage.isDeleted && (
                          <div className="elixirchat-chat-messages__reply-message"
                            onClick={() => this.onReplyOriginalMessageClick(message.responseToMessage.id)}>
                            {generateReplyMessageQuote(message.responseToMessage, elixirChatWidget)}
                          </div>
                        )}

                        {message.text && (
                          <FormattedMarkdown className="elixirchat-chat-messages__text" markdown={message.text}/>
                        )}

                        {Boolean(message.files.length) && (
                          <ul className="elixirchat-chat-files">
                            {message.files.map(file => (
                              <li key={file.id} className="elixirchat-chat-files__item">
                                <a className={cn({
                                  'elixirchat-chat-files__preview': true,
                                  'elixirchat-chat-files__preview-image': file.thumbnails[0].url,
                                  'elixirchat-chat-files__preview-submitting': message.isSubmitting,
                                })}
                                  style={{backgroundImage: `url(${file.thumbnails[0].url})`}}
                                  href={file.url}
                                  target="_blank">

                                  {(!file.thumbnails[0].url && !message.isSubmitting) && (
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
                                    {message.isSubmitting ? 'Загрузка...' : humanizeFileSize(file.bytesSize)}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {Boolean(message.previews.length) && (
                      <ul className="elixirchat-chat-previews">
                        {message.previews.map(preview => (
                          <li key={preview.id} className="elixirchat-chat-previews__item">
                            <a className="elixirchat-chat-previews__link"
                              href={preview.url}
                              target="_blank"
                              onClick={e => this.onPreviewClick(e, preview, message.sender)}>

                              {message.isSubmitting && (
                                <i className="elixirchat-chat-previews__spinner icon-spinner-xs"/>
                              )}
                              {preview.previewType === 'video' && (
                                <Fragment>
                                  <span className="elixirchat-chat-previews__video-play">&#x25B6;</span>
                                  <span className="elixirchat-chat-previews__video-label">
                                    {this.formatVideoDuration(preview.duration)}
                                  </span>
                                </Fragment>
                              )}
                              <img className={cn({
                                'elixirchat-chat-previews__img': true,
                                'elixirchat-chat-previews__img--submitting': message.isSubmitting,
                              })}
                                width={_round(preview.thumbnailWidth)}
                                height={_round(preview.thumbnailHeight)}
                                src={preview.thumbnails[0].url}
                                alt={preview.name}
                                onError={e => {
                                  e.target.parentNode.classList.add('elixirchat-chat-previews__item-not-found')
                                }}/>
                              <span className="elixirchat-chat-previews__item-not-found-placeholder">
                                Файл не найден<br/>{preview.name}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="elixirchat-chat-messages__bottom">
                      {message.submissionErrorCode && (
                        <span className="elixirchat-chat-messages__submission-error">
                        {this.renderSubmissionErrorMessage(message)}
                      </span>
                      )}
                      {!message.submissionErrorCode && (
                        <Fragment>
                          {!message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                          {!message.isSystem && (
                            <span className="elixirchat-chat-messages__reply-button"
                              onClick={() => this.onReplyButtonClick(message.id)}>
                            Ответить
                          </span>
                          )}
                          {message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {message.isSystem && (
                <div className={cn({
                  'elixirchat-chat-messages__item': true,
                  'elixirchat-chat-messages__item--by-operator': true,
                  'elixirchat-chat-messages__item--system': true,
                  'elixirchat-chat-messages__item--unread': message.isUnread,
                })}
                  ref={element => this.createMessageRef(element, message)}>

                  <div className="elixirchat-chat-messages__inner">
                    <div className="elixirchat-chat-messages__balloon">
                      <div className="elixirchat-chat-messages__sender">
                        <b>{getUserFullName(message.sender) || elixirChatWidget.widgetMainTitle}</b>
                      </div>

                      {message.systemData.type === 'ScreenshotRequestedMessage' && (
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

                      {message.systemData.type === 'NobodyWorkingMessage' && (
                        <div className="elixirchat-chat-messages__text">
                          К сожалению, все операторы поддержки сейчас оффлайн
                          {message.systemData?.workHoursStartAt && (
                            <Fragment>, но будут снова в сети и ответят на ваш
                              вопрос {humanizeUpcomingDate(message.systemData?.workHoursStartAt)} {humanizeTimezoneName(message.systemData?.workHoursStartAt)}.
                            </Fragment>
                          )}
                        </div>
                      )}

                      {message.systemData.type === 'NewClientPlaceholderMessage' && (
                        <div className="elixirchat-chat-messages__text">
                          {elixirChatWidget.client.isConfidentAboutFirstName
                            ? `Здравствуйте, ${elixirChatWidget.client.firstName}! `
                            : 'Здравствуйте! '
                          }
                          Как мы можем вам помочь?
                        </div>
                      )}
                    </div>

                    <div className="elixirchat-chat-messages__bottom">
                      {dayjs(message.timestamp).format('H:mm')}
                    </div>
                  </div>
                </div>
              )}

            </Fragment>
          ))}

          <div className={cn({
            'elixirchat-chat-typing': true,
            'elixirchat-chat-typing--visible': Boolean(currentlyTypingUsers.length),
          })}>
            <Fragment>
              <i className="elixirchat-chat-typing__icon icon-typing"/>
              {inflect(currentlyTypingUsers.length, [
                'человек пишет...',
                'человека пишут...',
                'человек пишут...',
              ])}
            </Fragment>
          </div>

        </div>
      </div>
    );
  }
}
