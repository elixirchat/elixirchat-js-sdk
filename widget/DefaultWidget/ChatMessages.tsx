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
  trimEachRow, isWebVideo, getUserFullName, _find, _findIndex,
} from '../../utilsCommon';

import {
  inflectDayJSWeekDays,
  humanizeFileSize,
  generateReplyMessageQuote,
  unlockNotificationSoundAutoplay,
  playNotificationSound,
  scrollToElement,
  inflect,
  replaceMarkdownWithHTML,
  replaceLinksInText,
  sanitizeHTML,
  isMobileSizeScreen, humanizeTimezoneName, humanizeUpcomingDate, exposeComponentToGlobalScope,
} from '../../utilsWidget';

import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { ElixirChatWidget } from '../ElixirChatWidget';
import {
  IMAGE_PREVIEW_OPEN,
  REPLY_MESSAGE,
  TEXTAREA_VERTICAL_RESIZE,
  WIDGET_IFRAME_READY,
  WIDGET_POPUP_TOGGLE,
} from '../ElixirChatWidgetEventTypes';
import {
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  // MESSAGES_FETCH_HISTORY_INITIAL_ERROR,
  // MESSAGES_HISTORY_SET,
  // MESSAGES_HISTORY_APPEND_ONE,
  // MESSAGES_HISTORY_PREPEND_MANY,
  // MESSAGES_HISTORY_CHANGE_MANY,
  TYPING_STATUS_CHANGE,
  // INITIALIZATION_ERROR,
  MESSAGES_CHANGE,
  MESSAGES_RECEIVE,
} from '../../sdk/ElixirChatEventTypes';

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
}

export interface IDefaultWidgetMessagesState {
  isLoadingError: boolean;
  loadingErrorInfo: string | null;
  isLoading: boolean;
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
    // isLoading: true,
    isLoadingError: false,
    hasEverLoadedMessageHistory: false,

    loadingErrorInfo: null,

    isLoading: false,
    isLoadingPrecedingMessageHistory: false,

    hasReachedBeginningOfMessageHistory: false,

    hasMessageHistoryEverBeenVisible: false,
    processedMessages: [],
    fullScreenPreviews: [],
    screenshotFallback: null,
    scrollBlockBottomOffset: null,
    currentlyTypingUsers: [],
  };

  MAX_THUMBNAIL_SIZE: number = isMobileSizeScreen() ? 208 : 256;
  MESSAGE_CHUNK_SIZE: number = 20;
  MARK_AS_READ_TIMEOUT: number = 2000; // ms

  scrollBlock: { current: HTMLElement } = React.createRef();
  scrollBlockInner: { current: HTMLElement } = React.createRef();
  messageRefs: object = {};
  messagesWithinCurrentViewport: object = {};
  messagesAlreadyMarkedRead: object = {};
  multipleMessagesBeingViewedSimultaneouslyIsThrottling: boolean = false;
  multipleMessagesBeingViewedSimultaneouslyTimeout: object = null;

  messageVisibilityObserver: IntersectionObserver = null;
  // debouncedOnScrollOverUnreadMessage = debounce(this.onScrollOverUnreadMessage.bind(this), 3000);



  componentDidMount() {
    const { elixirChatWidget } = this.props;
    exposeComponentToGlobalScope('ChatMessages', this, elixirChatWidget);

    console.warn('__ mount');

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
        this.scrollToFirstUnreadMessage();
      });
    });
    elixirChatWidget.on(MESSAGES_RECEIVE, this.onMessageReceive);
    elixirChatWidget.on(MESSAGES_CHANGE, this.updateMessages);

    requestAnimationFrame(this.onPostRender);

    elixirChatWidget.on(WIDGET_POPUP_TOGGLE, isOpen => {
      if (detectBrowser() === 'safari') {
        this.preventSafariFromLockingScroll();
      }
      // if (isOpen) {
      //   const { hasMessageHistoryEverBeenVisible } = this.state;
      //   this.onMultipleMessagesBeingViewedSimultaneously(this.markLatestViewedMessageRead);
      //   if (!hasMessageHistoryEverBeenVisible && elixirChatWidget.hasMessageHistoryBeenEverFetched) {
      //     this.onMessageHistoryInitiallyBecomeVisible();
      //   }
      //
      // }

    });



    // elixirChatWidget.on(MESSAGES_HISTORY_SET, messages => {
    //   this.setProcessedMessages(messages);
    //   this.setState({ isLoading: false });
    //
    //   if (elixirChatWidget.widgetIsPopupOpen) {
    //     this.onMessageHistoryInitiallyBecomeVisible();
    //   }
    // });

    // elixirChatWidget.on(MESSAGES_HISTORY_PREPEND_MANY, messages => {
    //   this.setProcessedMessages(messages, { insertBefore: true });
    // });


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
    console.warn('__ UN mount');
    this.messageVisibilityObserver?.disconnect?.();
  }

  onPostRender = () => {
    this.messageVisibilityObserver = new IntersectionObserver(this.onIntersectionObserverTrigger, {
      root: this.scrollBlock.current,
      threshold: 0.9,
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


  // onMessageHistoryInitiallyBecomeVisible = () => {
  //   const { processedMessages } = this.state;
  //   this.setState({ hasMessageHistoryEverBeenVisible: true });
  //   this.scrollToBottom();
  //
  //   const readMessages = processedMessages.filter(message => !message.isUnread);
  //   const messageToScrollTo = _last(readMessages) || processedMessages[0];
  //   const messageToScrollToRef = this.messageRefs[messageToScrollTo.id] || {};
  //
  //   setTimeout(() => {
  //     scrollToElement(messageToScrollToRef.current, { isSmooth: true, position: 'start' });
  //   }, 300);
  // };

  // onMultipleMessagesBeingViewedSimultaneously = (callback) => {
  //   let messagesViewedSimultaneously = [];
  //   setTimeout(() => {
  //     this.onMessageBeingViewed(messageId => {
  //       messagesViewedSimultaneously.push(messageId);
  //
  //       if (this.multipleMessagesBeingViewedSimultaneouslyIsThrottling) {
  //         clearTimeout(this.multipleMessagesBeingViewedSimultaneouslyTimeout);
  //       }
  //
  //       this.multipleMessagesBeingViewedSimultaneouslyTimeout = setTimeout(() => {
  //         this.multipleMessagesBeingViewedSimultaneouslyIsThrottling = false;
  //         callback(messagesViewedSimultaneously);
  //         messagesViewedSimultaneously = [];
  //       }, 500);
  //
  //       this.multipleMessagesBeingViewedSimultaneouslyIsThrottling = true;
  //     });
  //   });
  // };

  // onMessageBeingViewed = (callback) => {
  //   const scrollBlockHeight = this.scrollBlock.current.offsetHeight;
  //   if (scrollBlockHeight) {  // Zero scroll block height means popup is closed - therefore aborting watching
  //     const maxConsiderableMessageHeight = scrollBlockHeight / 2;
  //     Object.values(this.messageRefs)
  //       .filter(ref => ref.isUnread && !ref.intersectionObserver)
  //       .forEach(ref => {
  //         ref.intersectionObserver = this.createMessageScrollObserver(
  //           ref.current,
  //           maxConsiderableMessageHeight,
  //           callback
  //         );
  //     });
  //   }
  // };

  // createMessageScrollObserver = (messageElement, maxConsiderableMessageHeight, callback) => {
  //   if (!messageElement) {
  //     return null;
  //   }
  //   const delayToMarkMessageRead = 1200; // milliseconds
  //   const observerOptions = {
  //     root: this.scrollBlock.current,
  //     threshold: Math.min(maxConsiderableMessageHeight / messageElement.offsetHeight, 0.8),
  //   };
  //   const intersectionObserver = new IntersectionObserver(([ entry ]) => {
  //     const messageElement: HTMLElement = entry.target;
  //     const messageId = messageElement.dataset.id;
  //     const messageRef = this.messageRefs[messageId];
  //
  //     if (this.messagesAlreadyMarkedRead[messageId] || !messageRef.isUnread) {
  //       return;
  //     }
  //     if (entry.isIntersecting) {
  //       this.messagesWithinCurrentViewport[messageId] = setTimeout(() => {
  //         this.messagesAlreadyMarkedRead[messageId] = true;
  //         callback(messageId);
  //       }, delayToMarkMessageRead);
  //     }
  //     else {
  //       clearTimeout(this.messagesWithinCurrentViewport[messageId]);
  //       delete this.messagesWithinCurrentViewport[messageId];
  //     }
  //   }, observerOptions);
  //   intersectionObserver.observe(messageElement);
  //   return intersectionObserver;
  // };

  // markLatestViewedMessageRead = (messageIds) => {
  //   const { elixirChatWidget } = this.props;
  //   const messagesSortedByTime = messageIds
  //     .map(messageId => this.messageRefs[messageId])
  //     .sort((a,b) => {
  //       const aTime = +new Date(a.timestamp);
  //       const bTime = +new Date(b.timestamp);
  //       return aTime < bTime ? -1 : 1;
  //     });
  //   const latestMessage = _last(messagesSortedByTime);
  //   elixirChatWidget.setLastReadMessage(latestMessage.id);
  // };

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
    const shouldPlayNotificationSound = !message.sender.isCurrentClient && !elixirChatWidget.widgetIsMuted;
    const shouldScrollMessagesToBottom = elixirChatWidget.widgetIsPopupOpen && document.hasFocus() && !hasUserScroll;

    // this.setProcessedMessages([message], { insertAfter: true });

    if (shouldScrollMessagesToBottom) {
      this.scrollToBottom();
    }
    if (shouldPlayNotificationSound) {
      playNotificationSound();
    }
    if (message.mustOpenWidget) {
      elixirChatWidget.openPopup();
    }
  };

  updateMessages = (messageHistory) => {
    console.warn('__ try to update messages', messageHistory.length);

    if (messageHistory.length < this.MESSAGE_CHUNK_SIZE) {
      console.warn('__ reached END', messageHistory.length);
      this.setState({ hasReachedBeginningOfMessageHistory: true });
    }

    const { processedMessages, fullScreenPreviews } = this.processMessages(messageHistory);
    this.setState({ processedMessages, fullScreenPreviews });

    requestAnimationFrame(() => {
      console.warn('__ post update messages', Object.values(this.messageRefs)[0]);
      for (let messageId in this.messageRefs) {
        this.messageVisibilityObserver.observe( this.messageRefs[messageId] );
      }
    });
  };

  scrollToFirstUnreadMessage = () => {
    const { elixirChatWidget } = this.props;
    const { messageHistory, lastReadMessageId } = elixirChatWidget;
    const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });

    // If lastReadMessageId isn't within the latest loaded chunk, it means it's preceding
    // currently loaded messages, therefore the scroll must be set all the way up
    const lastReadMessagePrecedesLoadedMessageHistory = lastReadMessageId && !lastReadMessageIndex;

    if (!lastReadMessagePrecedesLoadedMessageHistory) {
      const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });
      const firstUnreadMessage = messageHistory[lastReadMessageIndex + 1];
      // const messageIdToScrollTo = firstUnreadMessage?.id || _last(messageHistory).id;
      // const messageElementToScrollTo = this.messageRefs[messageIdToScrollTo];
      // scrollToElement(messageElementToScrollTo, { isSmooth: true, position: 'end' });

      const messageElementToScrollTo = this.messageRefs[firstUnreadMessage?.id];
      if (messageElementToScrollTo) {
        scrollToElement(messageElementToScrollTo, { position: 'end' });
      }
      else {
        this.scrollToBottom();
      }
    }
  };

  // setProcessedMessages = (messages, params = {}) => {
  //   const { insertBefore, insertAfter } = params; // TODO: refactor
  //   const { elixirChatWidget } = this.props;
  //   const previousProcessedMessages = this.state.processedMessages;
  //   const previousFullScreenPreviews = this.state.fullScreenPreviews;
  //   const { processedMessages, fullScreenPreviews, mustOpenWidget } = this.processMessages(
  //     messages,
  //     // insertAfter ? _last(previousProcessedMessages) : null
  //   );
  //
  //   this.setState({
  //     processedMessages: processedMessages,
  //     // processedMessages: updatedProcessedMessages,
  //     // fullScreenPreviews: updatedFullScreenPreviews,
  //   });
  //   // this.onMultipleMessagesBeingViewedSimultaneously(this.markLatestViewedMessageRead);
  // };

  processMessages = (messages) => {
    const { elixirChatWidget } = this.props;
    const { hasReachedBeginningOfMessageHistory } = this.state;

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
        hasPreviewsOnly,
        showDateLabel,
      };
    });
    return { processedMessages, fullScreenPreviews };
  };

  // extractPreviewsFromMessage = (message) => {
  //   const previews = [];
  //   message.attachments.forEach(attachment => {
  //     const { contentType } = attachment;
  //     const thumbnailUrl = attachment.thumbnails?.[0]?.url || '';
  //     if (thumbnailUrl && (isWebImage(contentType) || isWebVideo(contentType))) {
  //       previews.push({
  //         ...attachment,
  //         sender: message.sender,
  //       });
  //     }
  //   });
  //   return previews;
  // };

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

  scrollToBottom = (): void => {
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
    // this.messageRefs[message.id] = {
    //   current: messageElement,
    //   intersectionObserver: null,
    //   id: message.id,
    //   isUnread: message.isUnread,
    //   timestamp: message.timestamp,
    // };
    if (messageElement) {
      const { id, text, isUnread } = message;
      this.setDatasetValues(messageElement, {
        messageData: { id, text, isUnread }
      });
      this.messageRefs[message.id] = messageElement;
    }
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
    return `mailto:${elixirChatWidget.widgetSupportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

    console.log('%c__ render base', 'color: green');

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
          {/*{isLoading && (*/}
          {/*  <i className="elixirchat-chat-spinner"/>*/}
          {/*)}*/}

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
                  ref={element => this.createMessageRef(element, message)}
                  // ref={element => this.createMessageRef(element)}
                  // data-id={message.id}
                >
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
                  ref={element => this.createMessageRef(element, message)}
                  // ref={element => this.createMessageRef(element)}
                  // data-id={message.id}
                >
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
