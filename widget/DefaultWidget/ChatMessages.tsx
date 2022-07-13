import React, { Component, Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import {
  cn,
  _round,
  _flatten,
  _findIndex,
  getMediaType,
  detectBrowser,
  getUserFullName,
  randomDigitStringId,
} from '../../utilsCommon';

import {
  humanizeFileSize,
  humanizeUpcomingDate,
  generateReplyMessageQuote,
  exposeComponentToGlobalScope,
  fitDimensionsIntoLimits,
  isMobile,
} from '../../utilsWidget';

import { ElixirChatWidget } from '../ElixirChatWidget';
import { FormattedMarkdown } from './FormattedMarkdown';
import { MessageSearch } from './MessageSearch';
import { getScreenshotCompatibilityFallback } from '../../sdk/ScreenshotTaker';
import { serializeMessage } from '../../sdk/serializers/serializeMessage';
import {
  JOIN_ROOM_SUCCESS,
  MESSAGES_RECEIVE,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  TYPING_STATUS_CHANGE,
  ERROR_ALERT,
} from '../../sdk/ElixirChatEventTypes';

import {
  WIDGET_FULLSCREEN_PREVIEW_OPEN,
  WIDGET_TEXTAREA_RESIZE,
  WIDGET_REPLY_MESSAGE,
  WIDGET_POPUP_OPEN,
} from '../ElixirChatWidgetEventTypes';

type IntlArgId = {
  id: string
}

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
  intl: {
    formatMessage: (arg: IntlArgId) => string,
    locale: string
  };
  searchFormShow: boolean;
}

export interface IDefaultWidgetMessagesState {
  isLoading: boolean;
  isLoadingPrecedingMessageHistory: boolean;
  hasReachedBeginningOfMessageHistory: boolean;
  hasInitiallyScrolledToAppropriatePosition: boolean;
  processedMessages: Array<object>,
  fullScreenPreviews: Array<object>,
  screenshotFallback: object | null,
  scrollBlockBottomOffset: number | null;
  currentlyTypingUsers: Array<object>;

  searchText: string;
  selectMessageId: string;
  searchMessagesIds: Array<string>;
  showScrollButton: boolean;
}

class ChatMessagesComponent extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    isLoading: false,
    isLoadingPrecedingMessageHistory: false,
    hasReachedBeginningOfMessageHistory: false,
    hasInitiallyScrolledToAppropriatePosition: false,
    processedMessages: [],
    fullScreenPreviews: [],
    screenshotFallback: null,
    scrollBlockBottomOffset: null,
    currentlyTypingUsers: [],
    // Search
    searchText: '',
    searchMessagesIds: [], // id сообщений, которые совпадают с текстом поиска
    selectMessageId: null, // id сообщения, которое необходимо выделить
    showScrollButton: false
  };

  MAX_THUMBNAIL_SIZE: number = isMobile() ? 208 : 256;
  MESSAGE_CHUNK_SIZE: number = 20;
  MARK_AS_READ_TIMEOUT: number = 2000; // ms
  LOAD_PRECEDING_MESSAGES_SCROLL_Y_POSITION: number = 10;

  scrollBlock: { current: HTMLElement } = React.createRef();
  scrollBlockInner: { current: HTMLElement } = React.createRef();
  messageVisibilityObserver: IntersectionObserver = null;
  messageRefs: object = {};
  initialScrollTimeout = null;

  componentDidMount() {
    const { elixirChatWidget, intl } = this.props;
    exposeComponentToGlobalScope(this, elixirChatWidget);

    dayjs.locale(intl.locale);
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
    elixirChatWidget.on(MESSAGES_HISTORY_CHANGE, this.onMessageHistoryChange);
    elixirChatWidget.on(MESSAGES_HISTORY_PREPEND, this.onMessageHistoryPrepend);

    elixirChatWidget.on(WIDGET_TEXTAREA_RESIZE, scrollBlockBottomOffset => {
      const hasUserScroll = this.hasUserScroll();
      this.setState({ scrollBlockBottomOffset });
      if (!hasUserScroll) {
        this.scrollToBottom();
      }
    });

    elixirChatWidget.on(TYPING_STATUS_CHANGE, currentlyTypingUsers => {
      this.setState({ currentlyTypingUsers });
    });

    requestAnimationFrame(this.initializeMessagesIntersectionObserver);
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.off(MESSAGES_RECEIVE, this.onMessageReceive);
    elixirChatWidget.off(MESSAGES_HISTORY_CHANGE, this.onMessageHistoryChange);
    elixirChatWidget.off(MESSAGES_HISTORY_PREPEND, this.onMessageHistoryPrepend);

    if (this.messageVisibilityObserver) {
      this.messageVisibilityObserver.disconnect();
    }
    clearTimeout(this.initialScrollTimeout);
  }

  onMessageReceive = (message) => {
    const { elixirChatWidget } = this.props;
    const shouldScrollMessagesToBottom = document.hasFocus()
      && elixirChatWidget.widgetIsPopupOpen
      && (message.sender.isCurrentClient || !this.hasUserScroll());

    if (shouldScrollMessagesToBottom) {
      this.scrollToBottom();
    }
    this.updateMessageHistory({ chunk: [message], append: true }, this.reAttachIntersectionObserverToMessages);
  };

  onMessageHistoryChange = (chunk) => {
    this.updateMessageHistory({ chunk }, this.reAttachIntersectionObserverToMessages);
  };

  onMessageHistoryPrepend = (chunk) => {
    this.updateMessageHistory({ chunk, prepend: true }, this.reAttachIntersectionObserverToMessages);
  };

  updateMessageHistory = (params, callback) => {
    const { chunk, prepend, append } = params;
    const hasReachedBeginningOfMessageHistory = !append && chunk.length < this.MESSAGE_CHUNK_SIZE;
    let processedMessages = this.processMessages(chunk, hasReachedBeginningOfMessageHistory);
    let fullScreenPreviews = this.extractFullScreenPreviews(chunk);

    if (append) {
      processedMessages = [ ...this.state.processedMessages, ...processedMessages ];
      fullScreenPreviews = [ ...this.state.fullScreenPreviews, ...fullScreenPreviews ];
    }
    else if (prepend) {
      processedMessages = [ ...processedMessages, ...this.state.processedMessages ];
      fullScreenPreviews = [ ...fullScreenPreviews, ...this.state.processedMessages ];
    }
    this.setState({
      processedMessages,
      fullScreenPreviews,
      hasReachedBeginningOfMessageHistory,
    }, callback);
  };

  loadInitialMessages = () => {
    const { elixirChatWidget } = this.props;
    this.setState({ isLoading: true });

    if (elixirChatWidget.messageHistory.length) {
      this.onMessageHistoryChange(elixirChatWidget.messageHistory);
      this.setState({ isLoading: false });
      elixirChatWidget.waitForPopupToOpen(this.scrollInitiallyToAppropriatePosition);
    }
    else {
      elixirChatWidget.fetchMessageHistory(this.MESSAGE_CHUNK_SIZE)
        .then(() => {
          elixirChatWidget.waitForPopupToOpen(this.scrollInitiallyToAppropriatePosition);
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
    }
  };

  loadPrecedingMessages = () => {
    const { elixirChatWidget } = this.props;
    const {
      isLoading,
      isLoadingPrecedingMessageHistory,
      hasReachedBeginningOfMessageHistory,
      hasInitiallyScrolledToAppropriatePosition,
    } = this.state;

    const scrollBlock = this.scrollBlock.current;
    const initialScrollHeight = scrollBlock.scrollHeight;
    const shouldLoadPreviousMessages = !isLoading
      && !isLoadingPrecedingMessageHistory
      && !hasReachedBeginningOfMessageHistory
      && hasInitiallyScrolledToAppropriatePosition;

    if (shouldLoadPreviousMessages) {
      this.setState({ isLoadingPrecedingMessageHistory: true });

      elixirChatWidget.fetchPrecedingMessageHistory(this.MESSAGE_CHUNK_SIZE)
        .catch(e => {
          elixirChatWidget.triggerEvent(ERROR_ALERT, {
            customMessage: e.errorMessage,
            retryCallback: this.loadPrecedingMessages,
            error: e.rawError,
          });
          throw e;
        })
        .finally(() => {
          scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
          this.setState({ isLoadingPrecedingMessageHistory: false });
        });
    }
  };

  processMessages = (messages, hasReachedBeginningOfMessageHistory) => {
    let processedMessages = messages.map((message, i) => {
      let { previews, files } = this.processMessageAttachments(message);
      let showDateLabel = false;

      const previousMessage = messages[i - 1] || {};
      const isDifferentDateFromPreviousMessage = previousMessage.id
        && dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));

      if (isDifferentDateFromPreviousMessage && !message.isDeleted) {
        showDateLabel = true;
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

    let firstEverMessageInHistory = hasReachedBeginningOfMessageHistory ? messages[0] : null;
    if (hasReachedBeginningOfMessageHistory && (firstEverMessageInHistory?.sender?.isClient || !firstEverMessageInHistory)) {
      processedMessages = [
        this.generateNewClientPlaceholderMessage(firstEverMessageInHistory),
        ...processedMessages,
      ];
    }
    return processedMessages;
  };

  processMessageAttachments = (message) => {
    const previews = [];
    const files = [];

    if (message.isDeleted) {
      return { previews, files };
    }
    message.attachments.forEach(attachment => {
      const { width, height, contentType } = attachment;
      const previewType = getMediaType(contentType);

      if (previewType === 'image' || previewType === 'video') {
        const [ thumbnailWidth, thumbnailHeight ] = fitDimensionsIntoLimits(width, height, this.MAX_THUMBNAIL_SIZE, this.MAX_THUMBNAIL_SIZE);
        previews.push({
          ...attachment,
          thumbnailWidth,
          thumbnailHeight,
          previewType,
        });
      }
      else {
        files.push(attachment);
      }
    });
    return { previews, files };
  };

  extractFullScreenPreviews = (messages) => {
    return _flatten(
      messages.map(message => this.processMessageAttachments(message).previews)
    );
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

  scrollInitiallyToAppropriatePosition = () => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.off(WIDGET_POPUP_OPEN, this.scrollInitiallyToAppropriatePosition);

    if (elixirChatWidget.widgetChatScrollY) {
      requestAnimationFrame(() => {
        this.scrollBlock.current.scrollTop = elixirChatWidget.widgetChatScrollY;
      });
    }
    else {
      this.scrollToFirstUnreadMessage();
    }

    clearTimeout(this.initialScrollTimeout);
    this.initialScrollTimeout = setTimeout(() => {
      this.setState({ hasInitiallyScrolledToAppropriatePosition: true });
    }, 3000);
  };

  scrollToFirstUnreadMessage = () => {
    const { elixirChatWidget } = this.props;
    const { messageHistory, lastReadMessageId } = elixirChatWidget;
    const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });

    // If the last read message precedes loaded message history, just keep scroll at the top of the list
    const lastReadMessagePrecedesLoadedMessageHistory = lastReadMessageId && !lastReadMessageIndex;

    if (!lastReadMessagePrecedesLoadedMessageHistory) {
      requestAnimationFrame(() => {
        const firstUnreadMessage = messageHistory[lastReadMessageIndex + 1];
        const messageElementToScrollTo = this.messageRefs[firstUnreadMessage?.id];
        if (messageElementToScrollTo) {
          setTimeout(() => {
            messageElementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'end' });
          });
        }
        else {
          this.scrollToBottom();
        }
      });
    }
  };

  scrollToBottom = () => {
    setTimeout(() => {
      this.scrollBlock.current.scrollTop = this.scrollBlock.current.scrollHeight;
    });
  };

  hasUserScroll = () => {
    const scrollBlock = this.scrollBlock.current;
    return scrollBlock.scrollTop <= scrollBlock.scrollHeight - scrollBlock.offsetHeight - 30;
  };

  initializeMessagesIntersectionObserver = () => {
    const observerParams = {
      root: this.scrollBlock.current,
      threshold: 0.9, // triggers when 90% of message is within the viewport
    };

    this.messageVisibilityObserver = new IntersectionObserver(entries => {
      entries.map(entry => {
        const messageElement = entry.target;

        if (entry.isIntersecting) {
          this.setDatasetValues(messageElement, { isMessageWithinViewport: true });
          const messageData = this.getDatasetValue(messageElement, 'messageData');
          if (messageData.isUnread) {
            this.onScrollOverUnreadMessage(messageData.id);
          }
        }
        else {
          this.setDatasetValues(messageElement, { isMessageWithinViewport: false });
        }
      });
    }, observerParams);
  };

  reAttachIntersectionObserverToMessages = () => {
    requestAnimationFrame(() => {
      for (let messageId in this.messageRefs) {
        this.messageVisibilityObserver.observe( this.messageRefs[messageId] );
      }
    });
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
    const messageElement = this.messageRefs[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  onReplyButtonClick = (messageId) => {
    const { elixirChatWidget } = this.props;
    elixirChatWidget.triggerEvent(WIDGET_REPLY_MESSAGE, messageId);
  };

  onPreviewClick = (e, preview, sender) => {
    const { elixirChatWidget } = this.props;
    const { fullScreenPreviews } = this.state;
    elixirChatWidget.triggerEvent(WIDGET_FULLSCREEN_PREVIEW_OPEN, {
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
    if (!keySequence) {
      return undefined;
    }
    return keySequence.split(/\+/).map((key, index) => {
      return Boolean(index) ? `+<kbd>${key}</kbd>` : `<kbd>${key}</kbd>`;
    }).join('');
  };

  getScreenshotShortcutMessage = () => {
    const { screenshotFallback } = this.state;
    const pressKey = screenshotFallback?.pressKey;
    if (!pressKey) {
      return this.props.intl.formatMessage({ id: 'please_send_screenshot' });
    }
    const pressKeySecondary = screenshotFallback.pressKeySecondary;
    return this.props.intl.formatMessage({ id: 'please_send_screenshot_with_shortcut' }, {
      hasSecondaryKey: Boolean(pressKeySecondary),
      primaryKey: this.renderKeyShortcut(pressKey),
      secondaryKey: this.renderKeyShortcut(pressKeySecondary)
    });
  };

  renderSubmissionErrorMessage = (message) => {
    const { elixirChatWidget } = this.props;
    const defaultMessage = (
      <Fragment>
        <FormattedMessage id="sending_has_failed" />
        <span className="elixirchat-chat-messages__submission-error-link"
          onClick={() => elixirChatWidget.retrySendMessage(message)}>
          <FormattedMessage id="again" />
        </span>
      </Fragment>
    );
    const badConnectionMessage = (
      <Fragment>
        <FormattedMessage id="sending_has_failed_bad_connection" />
        <span className="elixirchat-chat-messages__submission-error-link"
          onClick={() => elixirChatWidget.retrySendMessage(message)}>
          <FormattedMessage id="again" />
        </span>
      </Fragment>
    );
    const unsupportedFileTypeMessage = (
      <FormattedMessage id="attachment_type_is_not_supported" values={{
        br: () => <br />
      }} />
    );
    const tooLargeFileMessage = (
      <FormattedMessage id="file_size_limit" />
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

  getMentionsStr = (message) => {
    return message.mentions.map(mention => {
      return mention.value === 'ALL'
        ? this.props.intl.formatMessage({ id: 'everyone' })
        : getUserFullName(mention.client, '\u00A0');
    }).join(', ');
  };

  /**
   * Search
   */

  /**
   * Прокрутка до нужного сообщения
   * @param messageId
   * @param direction – с какой стороны «прокручивается» текст
   */
  scrollToMessage = (messageId, direction) => {
    // const scrollBlock = this.scrollBlock.current;
    // const target = document.getElementById(messageId);
    // const chatMessages = this.chatMessagesWrapper.current;
    //
    // this.setState({selectMessageId: messageId});
    // if (!target) {
    //   scrollBlock.scrollTo({top: chatMessages.clientHeight - 20, behavior: 'smooth'});
    //   return;
    // }
    // const gap = scrollBlock.clientHeight / 2 - target.clientHeight / 2;
    //
    // if (direction === 'up') {
    //   scrollBlock.scrollTo({top: chatMessages.clientHeight - 20, behavior: 'auto'});
    // } else if (direction === 'down') {
    //   scrollBlock.scrollTo({top: 0, behavior: 'auto'});
    // }
    //
    // scrollBlock.scrollTo({top: target.offsetTop - gap, behavior: 'smooth'});
  }

  closeSearch = () => {
    this.setState({selectMessageId: null, searchFormShow: false});
    // focusChatTextArea();
  }

  render() {
    const { elixirChatWidget, className } = this.props;
    const {
      processedMessages,
      screenshotFallback,
      isLoading,
      isLoadingPrecedingMessageHistory,
      scrollBlockBottomOffset,
      currentlyTypingUsers
    } = this.state;

    const { searchFormShow } = this.props;

    return (

      <div className="exlixir-chat__wrapper">
        <MessageSearch
          show={searchFormShow}
          onChangeText={arg => {this.setState({searchText: arg})}}
          onChangeSearchMessagesIds={arg => {this.setState({searchMessagesIds: arg})}}
          onScroll={this.scrollToMessage}
          onClose={this.closeSearch}
        />

        <div className={cn('elixirchat-chat-scroll', className)}
          onScroll={e => e.target.scrollTop <= this.LOAD_PRECEDING_MESSAGES_SCROLL_Y_POSITION && this.loadPrecedingMessages()}
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
                    <FormattedMessage id="this_is_a_support_group" values={{title: elixirChatWidget.room.title}} />
                  </div>
                )}

                {message.showDateLabel && (
                  <div className="elixirchat-chat-messages__date-title">
                    {dayjs(message.timestamp).calendar(null, {
                      sameDay: `[${this.props.intl.formatMessage({ id: 'today' })}, ] D MMMM`,
                      lastDay: `[${this.props.intl.formatMessage({ id: 'yesterday' })}, ] D MMMM`,
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
                              <b>{getUserFullName(message.sender) || elixirChatWidget.widgetTitle}</b>
                              {Boolean(message.mentions.length) && (
                                <Fragment>
                                  &nbsp;→ @&nbsp;
                                  {this.getMentionsStr(message)}
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
                                      {message.isSubmitting
                                        ? <FormattedMessage id="upload" />
                                        : humanizeFileSize(file.bytesSize, this.props.intl)}
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
                                  <FormattedMessage id="file_not_found" />
                                  <br/>{preview.name}
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
                              <FormattedMessage id="reply" />
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
                          <b>{getUserFullName(message.sender) || elixirChatWidget.widgetTitle}</b>
                        </div>

                        {message.systemData.type === 'ScreenshotRequestedMessage' && (
                          <Fragment>
                            <div className="elixirchat-chat-messages__text"
                              dangerouslySetInnerHTML={{ __html: this.getScreenshotShortcutMessage() }} />
                            {!Boolean(screenshotFallback) && (
                              <button className="elixirchat-chat-messages__take-screenshot"
                                onClick={this.onTakeScreenshotClick}>
                                <FormattedMessage id="take_a_screenshot" />
                              </button>
                            )}
                          </Fragment>
                        )}

                        {message.systemData.type === 'NobodyWorkingMessage' && (
                          <div className="elixirchat-chat-messages__text">
                            <FormattedMessage id="specialists_are_offline" values={{
                              hasDatetime: Boolean(message.systemData?.workHoursStartAt)
                              datetime: humanizeUpcomingDate(message.systemData?.workHoursStartAt, this.props.intl)
                            }} />
                          </div>
                        )}

                        {message.systemData.type === 'HighLoadMessage' && (
                          <div className="elixirchat-chat-messages__text">
                            <FormattedMessage id="waiting_takes_longer" />
                          </div>
                        )}

                        {message.systemData.type === 'NewClientPlaceholderMessage' && (
                          <div className="elixirchat-chat-messages__text">
                            <FormattedMessage id="hello" values={{
                              isConfidentAboutFirstName: elixirChatWidget.client.isConfidentAboutFirstName,
                              name: elixirChatWidget.client.firstName
                            }} />
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
          </div>


          <div className={cn({
            'elixirchat-chat-typing': true,
            'elixirchat-chat-typing--visible': Boolean(currentlyTypingUsers.length),
          })}>
            <Fragment>
              <i className="elixirchat-chat-typing__icon icon-typing"/>
              <FormattedMessage id="typing" values={{count: currentlyTypingUsers.length}} />
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}

export const ChatMessages = injectIntl(ChatMessagesComponent);
