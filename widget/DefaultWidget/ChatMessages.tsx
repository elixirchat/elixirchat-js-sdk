import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import {
  _round,
  _findIndex,
  isWebImage,
  isWebVideo,
  trimEachRow,
  detectBrowser,
  getUserFullName,
  randomDigitStringId,
} from '../../utilsCommon';

import {
  inflect,
  humanizeFileSize,
  humanizeTimezoneName,
  humanizeUpcomingDate,
  generateReplyMessageQuote,
  playNotificationSound,
  unlockNotificationSoundAutoplay,
  replaceMarkdownWithHTML,
  replaceLinksInText,
  sanitizeHTML,
  scrollToElement,
  isMobileSizeScreen,
  exposeComponentToGlobalScope,
} from '../../utilsWidget';

import { ElixirChatWidget } from '../ElixirChatWidget';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { serializeMessage } from '../../sdk/serializers/serializeMessage';
import {
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  TYPING_STATUS_CHANGE,
  MESSAGES_CHANGE,
  MESSAGES_RECEIVE,
} from '../../sdk/ElixirChatEventTypes';

import {
  IMAGE_PREVIEW_OPEN,
  REPLY_MESSAGE,
  TEXTAREA_VERTICAL_RESIZE,
  WIDGET_IFRAME_READY,
  WIDGET_POPUP_TOGGLE,
} from '../ElixirChatWidgetEventTypes';


export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IDefaultWidgetMessagesState {
  isLoading: boolean;
  isLoadingPrecedingMessageHistory: boolean;
  hasReachedBeginningOfMessageHistory: boolean;
  hasScrolledToFirstUnreadMessage: boolean;
  processedMessages: Array<object>,
  fullScreenPreviews: Array<object>,
  screenshotFallback: object | null,
  scrollBlockBottomOffset: number | null;
  currentlyTypingUsers: Array<object>;
}

export class ChatMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    isLoadingError: false, // TODO: fix
    loadingErrorInfo: null, // TODO: fix

    isLoading: false,
    isLoadingPrecedingMessageHistory: false,
    hasReachedBeginningOfMessageHistory: false,
    hasScrolledToFirstUnreadMessage: false,

    processedMessages: [],
    fullScreenPreviews: [],
    screenshotFallback: null,
    scrollBlockBottomOffset: null, // TODO: fix
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
    exposeComponentToGlobalScope('ChatMessages', this, elixirChatWidget);

    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);

    this.setState({
      screenshotFallback: getScreenshotCompatibilityFallback()
    });

    elixirChatWidget.on(WIDGET_IFRAME_READY, iframeDocument => {
      iframeDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
    });
    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      this.setState({ isLoading: true });
      elixirChatWidget.fetchMessageHistory(this.MESSAGE_CHUNK_SIZE).then(() => {
        this.setState({ isLoading: false });
        this.onMessageHistoryFetch();
      });
    });
    elixirChatWidget.on([MESSAGES_CHANGE, MESSAGES_RECEIVE], () => {
      this.updateMessages(elixirChatWidget.messageHistory);
    });
    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, isOpen => {
      if (isOpen && detectBrowser() === 'safari') {
        this.preventSafariFromLockingScroll();
      }
    });
    elixirChatWidget.on(MESSAGES_RECEIVE, this.onMessageReceive);

    requestAnimationFrame(this.onPostMount);



    // TODO: fix [INITIALIZATION_ERROR, JOIN_ROOM_ERROR, MESSAGES_FETCH_HISTORY_INITIAL_ERROR]
    // elixirChatWidget.on(JOIN_ROOM_ERROR, (e) => {
    //   const errorMessage = e && e.message ? e.message : 'Unknown error';
    //   const loadingErrorInfo = `Message: ${errorMessage}\nData: ${JSON.stringify(e)}`;
    //   this.setState({
    //     isLoading: false,
    //     isLoadingError: true,
    //     loadingErrorInfo,
    //   });
    // });
    // elixirChatWidget.on(TEXTAREA_VERTICAL_RESIZE, scrollBlockBottomOffset => {
    //   const hasUserScroll = this.hasUserScroll();
    //   this.setState({ scrollBlockBottomOffset });
    //   if (!hasUserScroll) {
    //     this.scrollToBottom();
    //   }
    // });
    // elixirChatWidget.on(TYPING_STATUS_CHANGE, currentlyTypingUsers => {
    //   this.setState({ currentlyTypingUsers });
    // });
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.off(MESSAGES_RECEIVE, this.onMessageReceive);
    this.messageVisibilityObserver?.disconnect?.();
  }

  onMessageHistoryFetch = () => {
    const { elixirChatWidget } = this.props;
    if (elixirChatWidget.widgetIsPopupOpen) {
      this.scrollToFirstUnreadMessage();
    }
    else {
      elixirChatWidget.on(WIDGET_POPUP_TOGGLE, isOpen => {
        const { hasScrolledToFirstUnreadMessage } = this.state;
        if (isOpen && !hasScrolledToFirstUnreadMessage) {
          this.scrollToFirstUnreadMessage();
        }
      });
    }
  };

  onPostMount = () => {
    this.messageVisibilityObserver = new IntersectionObserver(this.onIntersectionObserverTrigger, {
      root: this.scrollBlock.current,
      threshold: 1,
    });
  };

  onIntersectionObserverTrigger = (entries) => {
    const entry = entries[0];
    const messageElement = entry.target;

    if (entry.isIntersecting) {
      this.setDatasetValues(messageElement, { isIntersecting: true });
      const messageData = this.getDatasetValue(messageElement, 'messageData');
      if (messageData.isUnread) {
        this.onScrollOverUnreadMessage(messageData.id);
      }
    }
    else {
      this.setDatasetValues(messageElement, { isIntersecting: false });
    }
  };

  onScrollOverUnreadMessage = (messageId) => {
    const { elixirChatWidget } = this.props;
    setTimeout(() => {
      const messageElement = this.messageRefs[messageId];
      const isMessageWithinViewport = this.getDatasetValue(messageElement, 'isIntersecting');
      if (isMessageWithinViewport) {
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

  onMessageReceive = message => {

    // window.__arguments = arguments;

    const { elixirChatWidget } = this.props;
    const {
      sender: { isCurrentClient },
      mustOpenWidget: shouldOpenPopup,
    } = message;

    const shouldPlayNotificationSound = !isCurrentClient && !elixirChatWidget.widgetIsMuted; // TODO: fix

    if (shouldOpenPopup) {
      elixirChatWidget.openPopup();
    }
    if (shouldPlayNotificationSound) {
      playNotificationSound();
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

  updateMessages = (messageHistory) => {
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

  scrollToFirstUnreadMessage = () => {
    const { elixirChatWidget } = this.props;
    const { messageHistory, lastReadMessageId } = elixirChatWidget;
    const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });
    this.setState({ hasScrolledToFirstUnreadMessage: true });

    // If lastReadMessageId isn't within the latest loaded chunk, it means it's preceding
    // currently loaded messages, therefore the scroll must be set all the way up
    const lastReadMessagePrecedesLoadedMessageHistory = lastReadMessageId && !lastReadMessageIndex;

    if (!lastReadMessagePrecedesLoadedMessageHistory) {
      requestAnimationFrame(() => {
        const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });
        const firstUnreadMessage = messageHistory[lastReadMessageIndex + 1];
        const messageElementToScrollTo = this.messageRefs[firstUnreadMessage?.id];
        if (messageElementToScrollTo) {
          scrollToElement(messageElementToScrollTo, { position: 'end' });
        }
        else {
          this.scrollToBottom();
        }
      });
    }
  };

  processMessages = (messages, hasReachedBeginningOfMessageHistory) => {
    if (!messages.length) {
      return {
        processedMessages: [ this.generateNewClientPlaceholderMessage() ],
        fullScreenPreviews: [],
      };
    }

    let fullScreenPreviews = [];
    let processedMessages = messages.map((message, i) => {
      let files = [];
      let previews = [];
      let showDateLabel = false;

      const previousMessage = messages[i - 1] || {};
      const isFirstEverMessageInChat = !previousMessage && hasReachedBeginningOfMessageHistory;
      const isDifferentDateFromPreviousMessage = previousMessage.id
        && dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));

      if (isDifferentDateFromPreviousMessage || isFirstEverMessageInChat) {
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
        isFirstEverMessageInChat,
      };
    });
    return { processedMessages, fullScreenPreviews };
  };

  generateNewClientPlaceholderMessage = () => {
    const { elixirChatWidget } = this.props;
    return serializeMessage({
      id: randomDigitStringId(6),
      isSystem: true,
      timestamp: new Date().toISOString(),
      __typename: 'NewClientPlaceholderMessage',
    }, elixirChatWidget);
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

  onMessagesScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    if (scrollBlock.scrollTop <= 0) {
      this.loadPrecedingMessageHistory();
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

  onReplyOriginalMessageClick = (messageId) => {
    const flashedClassName = 'elixirchat-chat-messages__item--flashed';
    const messageRef = this.messageRefs[messageId] || {};
    const messageElement = messageRef.current;

    scrollToElement(messageElement, { isSmooth: true, position: 'start' }, () => {
      messageElement.classList.add(flashedClassName);
      setTimeout(() => {
        messageElement.classList.remove(flashedClassName);
      }, 1000);
    });
  };

  loadPrecedingMessageHistory = (): void => {
    const { elixirChatWidget } = this.props;
    const { isLoadingPrecedingMessageHistory, hasReachedBeginningOfMessageHistory } = this.state;
    const scrollBlock = this.scrollBlock.current;
    const initialScrollHeight = scrollBlock.scrollHeight;

    if (!isLoadingPrecedingMessageHistory && !hasReachedBeginningOfMessageHistory) {
      this.setState({ isLoadingPrecedingMessageHistory: true });

      elixirChatWidget.fetchPrecedingMessageHistory(this.MESSAGE_CHUNK_SIZE).finally(() => {
        this.setState({ isLoadingPrecedingMessageHistory: false });
        scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
      });
    }
  };

  onReplyMessageClick = (messageId) => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.triggerEvent(REPLY_MESSAGE, messageId);
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

  createMessageRef = (messageElement, message) => {
    if (messageElement) {
      const { id, isUnread } = message;
      this.setDatasetValues(messageElement, {
        messageData: { id, isUnread }
      });
      this.messageRefs[message.id] = messageElement;
    }
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

  render() {
    const { elixirChatWidget, className } = this.props;
    const {
      processedMessages,
      screenshotFallback,
      isLoading,
      isLoadingError,
      isLoadingPrecedingMessageHistory,
      scrollBlockBottomOffset,
      currentlyTypingUsers,
    } = this.state;

    return (
      <div className={cn('elixirchat-chat-scroll', className)}
        onScroll={this.onMessagesScroll}
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

          {/*{isLoadingError && (*/}
          {/*  <div className="elixirchat-chat-fatal-error">*/}
          {/*    Ошибка загрузки. <br/>*/}
          {/*    Пожалуйста, перезагрузите*/}
          {/*    страницу <span className="m-nw">или напишите</span> администратору*/}
          {/*    на <a href={this.generateSupportMailtoLink()} target="_blank">{elixirChatWidget.widgetSupportEmail}</a>*/}
          {/*  </div>*/}
          {/*)}*/}

          {processedMessages.map(message => (
            <Fragment key={message.id}>

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
                        onDoubleClick={() => this.onReplyMessageClick(message.id)}>

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
                          <div className="elixirchat-chat-messages__text" dangerouslySetInnerHTML={{
                            __html: replaceMarkdownWithHTML(
                              replaceLinksInText(sanitizeHTML(message.text))
                            )
                          }}/>
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
                                // data-error-message="Файл не найден"
                                onError={e => {
                                  e.target.parentNode.classList.add('elixirchat-chat-previews__item-not-found')
                                }}/>
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
                              title="Для ответа дважды кликните сообщение"
                              onClick={() => this.onReplyMessageClick(message.id)}>
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
                          Здравствуйте! Как мы можем вам помочь?
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
