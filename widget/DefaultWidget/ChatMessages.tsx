import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import {
  _last,
  _round,
  isWebImage,
  detectBrowser,
  trimEachRow, isVideoConvertibleIntoMp4,
} from '../../utilsCommon';

import {
  inflectDayJSWeekDays,
  getHumanReadableFileSize,
  generateReplyMessageQuote,
  generateCustomerSupportSenderName,
  unlockNotificationSoundAutoplay,
  playNotificationSound,
  scrollToElement,
  inflect,
  replaceMarkdownWithHTML,
  replaceLinksInText,
  sanitizeHTML,
  isMobileSizeScreen,
} from '../../utilsWidget';

import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { ElixirChatWidget } from '../ElixirChatWidget';
import {
  IMAGE_PREVIEW_OPEN,
  REPLY_MESSAGE,
  TEXTAREA_VERTICAL_RESIZE,
  WIDGET_IFRAME_READY,
  WIDGET_POPUP_OPEN,
} from '../ElixirChatWidgetEventTypes';
import {
  JOIN_ROOM_ERROR,
  MESSAGES_SUBSCRIBE_ERROR,
  MESSAGES_FETCH_HISTORY_INITIAL_ERROR,
  MESSAGES_HISTORY_SET,
  MESSAGES_HISTORY_APPEND_ONE,
  MESSAGES_HISTORY_PREPEND_MANY,
  MESSAGES_HISTORY_CHANGE_MANY,
  JOIN_ROOM_SUCCESS,
  TYPING_STATUS_CHANGE,
} from '../../sdk/ElixirChatEventTypes';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
  messages: Array<any>;
}

export interface IDefaultWidgetMessagesState {
  isLoading: boolean;
  isLoadingError: boolean;
  loadingErrorInfo: string | null;
  isLoadingPrecedingMessageHistory: boolean;
  hasMessageHistoryEverBeenVisible: boolean;
  processedMessages: Array<object>,
  fullScreenPreviews: Array<object>,
  screenshotFallback: object | null,
  scrollBlockBottomOffset: number | null;
  currentlyTypingUsers: Array<object>;
}

export class ChatMessages extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    isLoading: true,
    isLoadingError: false,
    loadingErrorInfo: null,
    isLoadingPrecedingMessageHistory: false,
    hasMessageHistoryEverBeenVisible: false,
    processedMessages: [],
    fullScreenPreviews: [],
    screenshotFallback: null,
    scrollBlockBottomOffset: null,
    currentlyTypingUsers: [],
  };

  scrollBlock: { current: HTMLElement } = React.createRef();
  scrollBlockInner: { current: HTMLElement } = React.createRef();

  maxThumbnailSize: number = isMobileSizeScreen() ? 208 : 256;
  messageChunkSize: number = 20;
  messageRefs: object = {};
  messagesWithinCurrentViewport: object = {};
  messagesAlreadyMarkedRead: object = {};
  multipleMessagesBeingViewedSimultaneouslyIsThrottling: boolean = false;
  multipleMessagesBeingViewedSimultaneouslyTimeout: object = null;

  componentDidMount() {
    const { elixirChatWidget } = this.props;
    dayjs.locale('ru');
    dayjs.extend(dayjsCalendar);

    this.setState({
      screenshotFallback: getScreenshotCompatibilityFallback(),
    });

    elixirChatWidget.on(JOIN_ROOM_SUCCESS, () => {
      elixirChatWidget.fetchMessageHistory(this.messageChunkSize);
    });
    elixirChatWidget.on(WIDGET_IFRAME_READY, () => {
      elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', unlockNotificationSoundAutoplay);
    });
    elixirChatWidget.on(WIDGET_POPUP_OPEN, () => {
      const { hasMessageHistoryEverBeenVisible } = this.state;
      this.onMultipleMessagesBeingViewedSimultaneously(this.markLatestViewedMessageRead);
      if (!hasMessageHistoryEverBeenVisible && elixirChatWidget.hasMessageHistoryBeenEverFetched) {
        this.onMessageHistoryInitiallyBecomeVisible();
      }
      if (detectBrowser() === 'safari') {
        this.preventSafariFromLockingScroll();
      }
    });

    elixirChatWidget.on(MESSAGES_HISTORY_APPEND_ONE, this.onMessageReceive);

    elixirChatWidget.on(MESSAGES_HISTORY_SET, messages => {
      this.setProcessedMessages(messages);
      this.setState({ isLoading: false });
      if (elixirChatWidget.isWidgetPopupOpen) {
        this.onMessageHistoryInitiallyBecomeVisible();
      }
    });
    elixirChatWidget.on(MESSAGES_HISTORY_PREPEND_MANY, messages => {
      this.setProcessedMessages(messages, { insertBefore: true });
    });
    elixirChatWidget.on(MESSAGES_HISTORY_CHANGE_MANY, messages => {
      this.setProcessedMessages(messages);
    });
    elixirChatWidget.on([JOIN_ROOM_ERROR, MESSAGES_SUBSCRIBE_ERROR, MESSAGES_FETCH_HISTORY_INITIAL_ERROR], (e) => {
      const errorMessage = e && e.message ? e.message : 'Unknown error';
      const loadingErrorInfo = `Message: ${errorMessage}\nData: ${JSON.stringify(e)}`;
      this.setState({
        isLoading: false,
        isLoadingError: true,
        loadingErrorInfo,
      });
    });
    elixirChatWidget.on(TEXTAREA_VERTICAL_RESIZE, scrollBlockBottomOffset => {
      const hasUserScroll = this.hasUserScroll();
      this.setState({ scrollBlockBottomOffset });
      if (!hasUserScroll) {
        this.scrollToBottom();
      }
    });
    elixirChatWidget.on(TYPING_STATUS_CHANGE, currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
    });
  }

  onMessageHistoryInitiallyBecomeVisible = () => {
    const { processedMessages } = this.state;
    this.setState({ hasMessageHistoryEverBeenVisible: true });
    this.scrollToBottom();

    const readMessages = processedMessages.filter(message => !message.isUnread);
    const messageToScrollTo = _last(readMessages) || processedMessages[0];
    const messageToScrollToRef = this.messageRefs[messageToScrollTo.id] || {};

    setTimeout(() => {
      scrollToElement(messageToScrollToRef.current, { isSmooth: true, position: 'start' });
    }, 300);
  };

  onMultipleMessagesBeingViewedSimultaneously = (callback) => {
    let messagesViewedSimultaneously = [];
    setTimeout(() => {
      this.onMessageBeingViewed(messageId => {
        messagesViewedSimultaneously.push(messageId);

        if (this.multipleMessagesBeingViewedSimultaneouslyIsThrottling) {
          clearTimeout(this.multipleMessagesBeingViewedSimultaneouslyTimeout);
        }

        this.multipleMessagesBeingViewedSimultaneouslyTimeout = setTimeout(() => {
          this.multipleMessagesBeingViewedSimultaneouslyIsThrottling = false;
          callback(messagesViewedSimultaneously);
          messagesViewedSimultaneously = [];
        }, 500);

        this.multipleMessagesBeingViewedSimultaneouslyIsThrottling = true;
      });
    });
  };

  onMessageBeingViewed = (callback) => {
    const scrollBlockHeight = this.scrollBlock.current.offsetHeight;
    if (scrollBlockHeight) {  // Zero scroll block height means popup is closed - therefore aborting watching
      const maxConsiderableMessageHeight = scrollBlockHeight / 2;
      Object.values(this.messageRefs)
        .filter(ref => ref.isUnread && !ref.intersectionObserver)
        .forEach(ref => {
          ref.intersectionObserver = this.createMessageScrollObserver(
            ref.current,
            maxConsiderableMessageHeight,
            callback
          );
      });
    }
  };

  createMessageScrollObserver = (messageElement, maxConsiderableMessageHeight, callback) => {
    if (!messageElement) {
      return null;
    }
    const delayToMarkMessageRead = 1200; // milliseconds
    const observerOptions = {
      root: this.scrollBlock.current,
      threshold: Math.min(maxConsiderableMessageHeight / messageElement.offsetHeight, 0.8),
    };
    const intersectionObserver = new IntersectionObserver(([ entry ]) => {
      const messageElement: HTMLElement = entry.target;
      const messageId = messageElement.dataset.id;
      const messageRef = this.messageRefs[messageId];

      if (this.messagesAlreadyMarkedRead[messageId] || !messageRef.isUnread) {
        return;
      }
      if (entry.isIntersecting) {
        this.messagesWithinCurrentViewport[messageId] = setTimeout(() => {
          this.messagesAlreadyMarkedRead[messageId] = true;
          callback(messageId);
        }, delayToMarkMessageRead);
      }
      else {
        clearTimeout(this.messagesWithinCurrentViewport[messageId]);
        delete this.messagesWithinCurrentViewport[messageId];
      }
    }, observerOptions);
    intersectionObserver.observe(messageElement);
    return intersectionObserver;
  };

  markLatestViewedMessageRead = (messageIds) => {
    const { elixirChatWidget } = this.props;
    const messagesSortedByTime = messageIds
      .map(messageId => this.messageRefs[messageId])
      .sort((a,b) => {
        const aTime = +new Date(a.timestamp);
        const bTime = +new Date(b.timestamp);
        return aTime < bTime ? -1 : 1;
      });
    const latestMessage = _last(messagesSortedByTime);
    elixirChatWidget.setLastReadMessage(latestMessage.id);
  };

  // Hack to fix weird Safari bug when it disables scrolling of this.scrollBlock
  // when new messages were received when popup was closed
  preventSafariFromLockingScroll = () => {
    const { backgroundColor = '' } = this.scrollBlock.current.style.backgroundColor;
    this.scrollBlock.current.style.backgroundColor = 'inherit';
    setTimeout(() => {
      this.scrollBlock.current.style.backgroundColor = backgroundColor;
    });
  };

  onMessageReceive = message => {
    const { elixirChatWidget } = this.props;

    const hasUserScroll = this.hasUserScroll();
    const shouldPlayNotificationSound = !message.sender.isCurrentClient && !elixirChatWidget.isWidgetMuted;
    const shouldScrollMessagesToBottom = elixirChatWidget.isWidgetPopupOpen
      && elixirChatWidget.isWidgetPopupFocused // TODO: replace /w document.hasFocus() or document.visibilityState
      && !hasUserScroll;

    this.setProcessedMessages([message], { insertAfter: true });

    if (shouldScrollMessagesToBottom) {
      this.scrollToBottom();
    }
    if (shouldPlayNotificationSound) {
      playNotificationSound();
    }
    if (message.mustOpenWidget && !elixirChatWidget.isWidgetPopupOpen) {
      elixirChatWidget.togglePopup();
    }
  };

  setProcessedMessages = (messages, params = {}) => {
    const { insertBefore, insertAfter } = params;
    const { elixirChatWidget } = this.props;
    const previousProcessedMessages = this.state.processedMessages;
    const previousFullScreenPreviews = this.state.fullScreenPreviews;
    const { processedMessages, fullScreenPreviews, mustOpenWidget } = this.processMessages(
      messages,
      insertAfter ? _last(previousProcessedMessages) : null
    );
    let updatedProcessedMessages;
    let updatedFullScreenPreviews;

    if (insertBefore) {
      updatedProcessedMessages = [...processedMessages, ...previousProcessedMessages];
      updatedFullScreenPreviews = [...fullScreenPreviews, ...previousFullScreenPreviews];
    }
    else if (insertAfter) {
      updatedProcessedMessages = [...previousProcessedMessages, ...processedMessages];
      updatedFullScreenPreviews = [...previousFullScreenPreviews, ...fullScreenPreviews];
    }
    else {
      updatedProcessedMessages = processedMessages;
      updatedFullScreenPreviews = fullScreenPreviews;
    }
    if (mustOpenWidget && !elixirChatWidget.isWidgetPopupOpen) {
      elixirChatWidget.togglePopup();
    }
    this.setState({
      processedMessages: updatedProcessedMessages,
      fullScreenPreviews: updatedFullScreenPreviews,
    });
    this.onMultipleMessagesBeingViewedSimultaneously(this.markLatestViewedMessageRead);
  };

  processMessages = (messages, precedingMessage) => {
    const { elixirChatWidget } = this.props;
    let fullScreenPreviews = [];
    let mustOpenWidget = false;

    let processedMessages = messages.map((message, i) => {
      const processedMessage = { ...message };
      const previousMessage = messages[i - 1] || precedingMessage;
      const isFirstMessageInChat = !previousMessage && elixirChatWidget.reachedBeginningOfMessageHistory;
      const isNextDayAfterPreviousMessage = previousMessage && dayjs(previousMessage.timestamp)
        .isBefore(dayjs(message.timestamp).startOf('day'));

      if (isNextDayAfterPreviousMessage || isFirstMessageInChat) {
        processedMessage.prependDateTitle = true;
      }
      if (processedMessage.attachments.length) {
        const { files, previews } = this.processAttachments(message.attachments, message.sender);
        fullScreenPreviews = fullScreenPreviews.concat(previews);
        processedMessage.files = files;
        processedMessage.previews = previews;
      }

      if (message.mustOpenWidget) {
        mustOpenWidget = true;
      }

      const hasText = message.text?.trim();
      const hasReply = message.responseToMessage?.id && !message.responseToMessage?.isDeleted;
      const hasFiles = processedMessage.files?.length;
      processedMessage.messageHasPreviewsOnly = message.sender.isCurrentClient && !hasText && !hasReply && !hasFiles;

      return processedMessage;
    });

    return {
      processedMessages,
      fullScreenPreviews,
      mustOpenWidget,
    };
  };

  processAttachments = (attachments, sender) => {
    const previews = [];
    const files = [];

    attachments.forEach(attachment => {
      const thumbnailUrl = attachment?.thumbnails?.[0]?.url || null;
      const thumbnailRatio = this.maxThumbnailSize / Math.max(attachment.width, attachment.height);

      let thumbnailWidth = attachment.width;
      let thumbnailHeight = attachment.height;

      if (thumbnailRatio < 1) {
        thumbnailWidth = attachment.width * thumbnailRatio;
        thumbnailHeight = attachment.height * thumbnailRatio;
      }

      const isImage = isWebImage(attachment.contentType) && thumbnailWidth && thumbnailHeight;
      const isVideo = isVideoConvertibleIntoMp4(attachment.contentType) && thumbnailWidth && thumbnailHeight;

      if (isImage || isVideo) {
        previews.push({
          ...attachment,
          sender,
          thumbnailUrl,
          thumbnailWidth,
          thumbnailHeight,
          previewType: isImage ? 'image' : 'video',
        });
      }
      else {
        files.push({
          ...attachment,
          thumbnailUrl,
        })
      }
    });
    return { previews, files };
  };

  onPreviewClick = (e, preview) => {
    const { elixirChatWidget } = this.props;
    const { fullScreenPreviews } = this.state;
    elixirChatWidget.triggerEvent(IMAGE_PREVIEW_OPEN, preview, fullScreenPreviews);
    e.preventDefault();
  };

  onTakeScreenshotClick = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.togglePopup();
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

  scrollToBottom = (): void => {
    setTimeout(() => {
      this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
    });
    this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
  };

  onReplyOriginalMessageTextClick = (messageId) => {
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
    const { isLoadingPrecedingMessageHistory } = this.state;
    const scrollBlock = this.scrollBlock.current;
    const initialScrollHeight = scrollBlock.scrollHeight;

    if (!isLoadingPrecedingMessageHistory && !elixirChatWidget.reachedBeginningOfMessageHistory) {
      this.setState({ isLoadingPrecedingMessageHistory: true });
      elixirChatWidget.fetchPrecedingMessageHistory(this.messageChunkSize).finally(() => {
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

  getSubmissionErrorMessage = (message) => {
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
    this.messageRefs[message.id] = {
      current: messageElement,
      intersectionObserver: null,
      id: message.id,
      isUnread: message.isUnread,
      timestamp: message.timestamp,
    };
  };

  generateSupportMailtoLink = () => {
    const { elixirChatWidget } = this.props;
    const { client: { firstName, lastName, id } } = elixirChatWidget;
    const { loadingErrorInfo } = this.state;
    const subject = 'Ошибка загрузки чата поддержки';

    const body = trimEachRow(`Чат поддержки не загружается. Появляется сообщение:
      «Ошибка загрузки. Пожалуйста, перезагрузите страницу или напишите администратору»
      
      Вот технические данные:
      ${loadingErrorInfo}
      User-agent: ${navigator.userAgent}
      Screen: ${screen.availWidth}x${screen.availHeight}
      Device pixel ratio: ${devicePixelRatio}
      
      Мои данные:
      ${firstName} ${lastName} (ID: ${id})
    `);
    return `mailto:${elixirChatWidget.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

  render(): void {
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
        style={{ bottom: scrollBlockBottomOffset }}
        onScroll={this.onMessagesScroll}
        ref={this.scrollBlock}>

        <i className={cn({
          'elixirchat-chat-scroll-progress-bar': true,
          'elixirchat-chat-scroll-progress-bar--animating': isLoadingPrecedingMessageHistory,
        })}/>

        <div className="elixirchat-chat-messages" ref={this.scrollBlockInner}>
          {isLoading && (
            <i className="elixirchat-chat-spinner"/>
          )}

          {isLoadingError && (
            <div className="elixirchat-chat-fatal-error">
              Ошибка загрузки. <br/>
              Пожалуйста, перезагрузите
              страницу <span className="m-nw">или напишите</span> администратору
              на <a href={this.generateSupportMailtoLink()} target="_blank">{elixirChatWidget.supportEmail}</a>
            </div>
          )}

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

              {!message.isSystem && !message.isDeleted && (
                <div className={cn({
                  'elixirchat-chat-messages__item': true,
                  'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
                  'elixirchat-chat-messages__item--by-operator': message.sender.isOperator,
                  'elixirchat-chat-messages__item--by-another-client': !message.sender.isOperator && !message.sender.isCurrentClient,
                  'elixirchat-chat-messages__item--unread': message.isUnread,
                })}
                  ref={element => this.createMessageRef(element, message)}
                  data-id={message.id}>

                  {!message.messageHasPreviewsOnly && (
                    <div className="elixirchat-chat-messages__balloon"
                      onDoubleClick={() => this.onReplyMessageClick(message.id)}>

                      {!message.sender.isCurrentClient && (
                        <div className="elixirchat-chat-messages__sender">
                          <b>{generateCustomerSupportSenderName(message, elixirChatWidget.widgetTitle)}</b>
                          {Boolean(message.mentions.length) && (
                            <Fragment>
                              &nbsp;→ @&nbsp;
                              {message.mentions.map(mention => {
                                return mention.value === 'ALL' ? 'Все' : [mention.client.firstName, mention.client.lastName].join('\u00A0');
                              }).join(', ')}
                            </Fragment>
                          )}
                        </div>
                      )}

                      {Boolean(message.responseToMessage.id) && !message.responseToMessage.isDeleted && (
                        <div className="elixirchat-chat-messages__reply-message"
                          onClick={() => this.onReplyOriginalMessageTextClick(message.responseToMessage.id)}>
                          {generateReplyMessageQuote(message.responseToMessage, elixirChatWidget.widgetTitle)}
                        </div>
                      )}

                      {message.text && (
                        <div className="elixirchat-chat-messages__text" dangerouslySetInnerHTML={{
                          __html: replaceMarkdownWithHTML(
                            replaceLinksInText( sanitizeHTML(message.text) )
                          )
                        }}/>
                      )}

                      {Boolean(message.files) && Boolean(message.files.length) && (
                        <ul className="elixirchat-chat-files">
                          {message.files.map(file => (
                            <li key={file.id} className="elixirchat-chat-files__item">
                              <a className={cn({
                                'elixirchat-chat-files__preview': true,
                                'elixirchat-chat-files__preview-image': file.thumbnailUrl,
                                'elixirchat-chat-files__preview-submitting': message.isSubmitting,
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

                  {Boolean(message.previews?.length) && (
                    <ul className="elixirchat-chat-previews">
                      {message.previews.map(preview => (
                        <li key={preview.id} className="elixirchat-chat-previews__item">
                          <a className="elixirchat-chat-previews__link"
                            href={preview.url}
                            target="_blank"
                            onClick={e => this.onPreviewClick(e, { ...preview, sender: message.sender })}>

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
                              width={_round(preview.thumbnailWidth, 2)}
                              height={_round(preview.thumbnailHeight)}
                              src={preview.thumbnailUrl}
                              alt={preview.name}
                              data-error-message="Файл не найден"
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
                        {this.getSubmissionErrorMessage(message)}
                      </span>
                    )}
                    {!message.submissionErrorCode && (
                      <Fragment>
                        {!message.sender.isCurrentClient && dayjs(message.timestamp).format('H:mm')}
                        {!message.isSystem && (
                          <span className="elixirchat-chat-messages__reply-button"
                            title="Для ответа также можно дважды кликнуть сообщение"
                            onClick={() => this.onReplyMessageClick(message.id)}>
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
                  'elixirchat-chat-messages__item--unread': message.isUnread,
                })}
                  ref={element => this.createMessageRef(element, message)}
                  data-id={message.id}>

                  <div className="elixirchat-chat-messages__balloon">
                    <div className="elixirchat-chat-messages__sender">
                      <b>{generateCustomerSupportSenderName(message, elixirChatWidget.widgetTitle)}</b>
                    </div>

                    {message.systemType === 'ScreenshotRequestedMessage' && (
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

                    {message.systemType === 'NobodyWorkingMessage' && (
                      <Fragment>
                        <div className="elixirchat-chat-messages__text">
                          К сожалению, все операторы поддержки сейчас оффлайн
                          {message.systemWorkHoursStartAt &&
                            ', но будут снова в сети ' +
                            inflectDayJSWeekDays('ru-RU', dayjs(message.systemWorkHoursStartAt).calendar(null, {
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

                    {message.systemType === 'NewClientPlaceholderMessage' && (
                      <Fragment>
                        <div className="elixirchat-chat-messages__text">
                          Здравствуйте! Как мы можем вам помочь?
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


          <div className={cn({
            'elixirchat-chat-typing': true,
            'elixirchat-chat-typing--visible': Boolean(currentlyTypingUsers.length),
          })}>
            <Fragment>
              <i className="elixirchat-chat-typing__icon icon-typing"/>
              {inflect('ru-RU', Math.max(1, currentlyTypingUsers.length), [
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
