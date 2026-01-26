import React, { Component, Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
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
  getOperatorName,
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
  MESSAGES_SEARCH_IDS,
  MESSAGES_PAGINATION,
  MESSAGES_LAST_MESSAGE_ID, MESSAGES_HISTORY_APPEND,
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

interface IRatingCommentModalProps {
  intl: any;
  onSubmit: (comment: string) => void;
  onSkip: () => void;
}

class RatingCommentModal extends Component<IRatingCommentModalProps, { comment: string }> {
  constructor(props) {
    super(props);
    this.state = { comment: '' };
  }

  handleSubmit = () => {
    if (this.state.comment.trim()) {
      this.props.onSubmit(this.state.comment);
    } else {
      this.props.onSkip();
    }
  };

  render() {
    const { intl, onSkip } = this.props;
    return (
      <div className="elixirchat-rating-comment-modal">
        <div className="elixirchat-rating-comment-modal__overlay" onClick={onSkip} />
        <div className="elixirchat-rating-comment-modal__content">
          <h3 className="elixirchat-rating-comment-modal__title">
            <FormattedMessage id="rate_message_comment_title" />
          </h3>
          <textarea
            className="elixirchat-rating-comment-modal__textarea"
            placeholder={intl.formatMessage({ id: 'rate_message_comment_placeholder' })}
            value={this.state.comment}
            onChange={(e) => this.setState({ comment: e.target.value })}
            rows={4}
          />
          <div className="elixirchat-rating-comment-modal__actions">
            <button
              className="elixirchat-rating-comment-modal__button elixirchat-rating-comment-modal__button--skip"
              onClick={onSkip}>
              <FormattedMessage id="rate_message_comment_skip" />
            </button>
            <button
              className="elixirchat-rating-comment-modal__button elixirchat-rating-comment-modal__button--submit"
              onClick={this.handleSubmit}
              disabled={!this.state.comment.trim()}>
              <FormattedMessage id="rate_message_comment_submit" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export interface IDefaultWidgetMessagesProps {
  elixirChatWidget: ElixirChatWidget;
  intl: {
    formatMessage: (arg: IntlArgId) => string,
    locale: string
  };
  className?: string;
}

export interface IDefaultWidgetMessagesState {
  isLoading: boolean;
  isLoadingPrecedingMessageHistory: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  hasInitiallyScrolledToAppropriatePosition: boolean;
  processedMessages: Array<object>,
  fullScreenPreviews: Array<object>,
  screenshotFallback: object | null,
  scrollBlockBottomOffset: number | null;
  currentlyTypingUsers: Array<object>;
  searchText: string;
  selectMessageId: string;
  searchMessagesIds: Array<string>;
  searchMessagesCursors: object;
  showScrollButton: boolean;
  originalMessages: object;
  lastMessageId: string;
}

class ChatMessagesComponent extends Component<IDefaultWidgetMessagesProps, IDefaultWidgetMessagesState> {

  state = {
    isLoading: false,
    isLoadingPrecedingMessageHistory: false,
    // есть ли старые сообщения
    hasPreviousPage: false,
    // есть ли новые сообщения
    hasNextPage: false,
    hasInitiallyScrolledToAppropriatePosition: false,
    processedMessages: [],
    fullScreenPreviews: [],
    screenshotFallback: null,
    scrollBlockBottomOffset: null,
    currentlyTypingUsers: [],
    // Search
    searchText: '',
    searchMessagesIds: [], // id сообщений, которые совпадают с текстом поиска
    searchMessagesCursors: {}, // пары — id: cursor для получения списка сообщений при переходе в результатах поиска
    selectMessageId: null, // id сообщения, которое необходимо выделить
    showScrollButton: false,
    // Лог оригинальных сообщений, которые мы выделяем при поиске
    originalMessages: {},
    lastMessageId: '',
    // Rating
    ratingCommentModal: {
      isOpen: false,
      ratingId: null,
      messageId: null,
    },
  };

  MAX_THUMBNAIL_SIZE: number = isMobile() ? 208 : 256;
  MESSAGE_CHUNK_SIZE: number = 20;
  MARK_AS_READ_TIMEOUT: number = 2000; // ms
  LOAD_PRECEDING_MESSAGES_SCROLL_Y_POSITION: number = 10;

  scrollBlock: { current: HTMLElement } = React.createRef();
  scrollBlockInner: { current: HTMLElement } = React.createRef();
  iframe = document.getElementById('elixirchat-widget-iframe');
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
    elixirChatWidget.on(MESSAGES_HISTORY_APPEND, this.onMessageHistoryAppend);
    elixirChatWidget.on(MESSAGES_SEARCH_IDS, ids => {
      this.setState({ searchMessagesIds: ids });
      this.markedSearchText(this.state.processedMessages, true);
    });

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
    elixirChatWidget.on(MESSAGES_LAST_MESSAGE_ID, id => {
      this.setState({lastMessageId: id});
    });

    elixirChatWidget.on(MESSAGES_PAGINATION, pageInfo => {
      this.setState({
        hasPreviousPage: pageInfo.hasPreviousPage,
        hasNextPage: pageInfo.hasNextPage
      })
    });

    requestAnimationFrame(this.initializeMessagesIntersectionObserver);
  }

  componentWillUnmount(){
    const { elixirChatWidget } = this.props;
    elixirChatWidget.off(MESSAGES_RECEIVE, this.onMessageReceive);
    elixirChatWidget.off(MESSAGES_HISTORY_CHANGE, this.onMessageHistoryChange);
    elixirChatWidget.off(MESSAGES_HISTORY_PREPEND, this.onMessageHistoryPrepend);
    elixirChatWidget.off(MESSAGES_HISTORY_APPEND, this.onMessageHistoryAppend);

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

  onMessageHistoryAppend = (chunk) => {
    this.updateMessageHistory({ chunk, append: true }, this.reAttachIntersectionObserverToMessages);
  };

  updateMessageHistory = (params, callback) => {
    const { chunk, prepend, append } = params;
    const { hasPreviousPage } = this.state;
    let processedMessages = this.processMessages(chunk, !hasPreviousPage);
    let fullScreenPreviews = this.extractFullScreenPreviews(chunk);

    if (append) {
      processedMessages = uniqBy([...this.state.processedMessages, ...processedMessages], 'id');
      fullScreenPreviews = uniqBy([ ...this.state.fullScreenPreviews, ...fullScreenPreviews ], 'id');
    }
    else if (prepend) {
      processedMessages = uniqBy([ ...processedMessages, ...this.state.processedMessages ], 'id');
      fullScreenPreviews = uniqBy([ ...fullScreenPreviews, ...this.state.processedMessages ], 'id');
    }

    if (this.state.searchMessagesIds.length) {
      processedMessages = this.markedSearchText(processedMessages, false);
    }

    this.setState({
      processedMessages,
      fullScreenPreviews,
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
      hasPreviousPage,
      hasInitiallyScrolledToAppropriatePosition,
    } = this.state;

    const scrollBlock = this.scrollBlock.current;
    const initialScrollHeight = scrollBlock.scrollHeight;
    const shouldLoadPreviousMessages = !isLoading
      && !isLoadingPrecedingMessageHistory
      && hasPreviousPage
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

  processMessages = (messages, hasPreviousPage) => {
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

    let firstEverMessageInHistory = hasPreviousPage ? messages[0] : null;
    if (hasPreviousPage && (firstEverMessageInHistory?.sender?.isClient || !firstEverMessageInHistory)) {
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

  onRateMessage = async (messageId: string, rating: 'POSITIVE' | 'NEGATIVE') => {
    const { elixirChatWidget } = this.props;
    try {
      const result = await elixirChatWidget.rateMessage(messageId, rating);
      
      // Обновляем сообщение через changeMessageBy
      elixirChatWidget.messageSubscription.changeMessageBy(
        { id: messageId },
        {
          rating: {
            id: result.id,
            rating: result.rating,
            comment: null,
          },
        }
      );

      // Показываем модальное окно для комментария
      this.setState({
        ratingCommentModal: {
          isOpen: true,
          ratingId: result.id,
          messageId: messageId,
        },
      });
    } catch (error) {
      elixirChatWidget.logError('Failed to rate message', error);
    }
  };

  onRatingCommentSubmit = async (comment: string) => {
    const { elixirChatWidget } = this.props;
    const { ratingCommentModal } = this.state;
    
    try {
      const result = await elixirChatWidget.addRatingComment(ratingCommentModal.ratingId, comment);
      
      // Обновляем сообщение через changeMessageBy
      const currentMessage = elixirChatWidget.messageHistory.find(m => m.id === ratingCommentModal.messageId);
      if (currentMessage && currentMessage.rating) {
        elixirChatWidget.messageSubscription.changeMessageBy(
          { id: ratingCommentModal.messageId },
          {
            rating: {
              ...currentMessage.rating,
              comment: result.comment,
            },
          }
        );
      }

      this.setState({
        ratingCommentModal: {
          isOpen: false,
          ratingId: null,
          messageId: null,
        },
      });
    } catch (error) {
      elixirChatWidget.logError('Failed to add rating comment', error);
    }
  };

  onRatingCommentSkip = () => {
    this.setState({
      ratingCommentModal: {
        isOpen: false,
        ratingId: null,
        messageId: null,
      },
    });
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

  scrollPosition = (scrollTop) => {
    if (scrollTop <= this.LOAD_PRECEDING_MESSAGES_SCROLL_Y_POSITION) {
      this.loadPrecedingMessages();
    } else {
      const scrollBlock = this.scrollBlock.current;
      const scrollBottom = scrollBlock.scrollHeight - scrollBlock.scrollTop - scrollBlock.clientHeight;
      if (scrollBottom < 15) {
        this.loadNextMessages();
      }
    }
  }

  onScrollHandler = (event) => {
    const { scrollTop } = event.target;
    this.debouncedTriggerScroll(scrollTop);
  }

  debouncedTriggerScroll = debounce(this.scrollPosition.bind(this), 400);

  /**
   * Search
   */

  markedSearchText(processedMessages, updateState = false) {
    const messages = JSON.parse(JSON.stringify(processedMessages));
    let { originalMessages, searchText } = this.state;
    const regExp = new RegExp(searchText, "igm");

    messages.forEach(el => {
      // сохраняем старое значение сообщение, чтобы вернуть его при новом поиске.
      if (Object.hasOwnProperty.call(originalMessages, el.id) && el.isMarked) {
        el.text = originalMessages[el.id];
        delete el.isMarked;
        delete originalMessages[el.id];
      }

      if (!this.state.searchMessagesIds.includes(el.id)) {
        return;
      }

      if (!el.isMarked && searchText) {
        originalMessages[el.id] = el.text;
        el.isMarked = true;
        el.text = el.text.replace(regExp, (match) => `★${match}★`);
      }
    })

    this.setState({ originalMessages });

    if (updateState) {
      this.setState({processedMessages: messages})
    }

    return messages;
  }

  /**
   * Прокрутка до нужного сообщения
   * @param messageId
   * @param direction – с какой стороны «прокручивается» текст
   */
  scrollToMessage = (messageId, direction) => {
    const innerDoc = this.iframe?.contentDocument || this.iframe?.contentWindow.document;
    const chatHeight = 380;

    const scrollBlock = this.scrollBlock.current;
    const target = innerDoc.getElementById(messageId);

    this.setState({selectMessageId: messageId});
    if (!target) {
      scrollBlock.scrollTo({top: chatHeight, behavior: 'smooth'});
      return;
    }
    const gap = scrollBlock.clientHeight / 2 - target.clientHeight / 2;

    if (direction === 'up') {
      scrollBlock.scrollTo({top: target.offsetTop - target.clientHeight / 2, behavior: 'auto'});
    } else if (direction === 'down') {
      scrollBlock.scrollTo({top: gap, behavior: 'auto'});
    }

    scrollBlock.scrollTo({top: target.offsetTop - gap, behavior: 'smooth'});
  }

  changeSearchText = (text) => {
    this.setState({searchText: text});
    const { originalMessages, processedMessages } = this.state;

    if (!text) {
      processedMessages.forEach(el => {
        if (!this.state.searchMessagesIds.includes(el.id)) {
          return;
        }

        if (Object.hasOwnProperty.call(originalMessages, el.id)) {
          el.text = originalMessages[el.id];
          delete el.isMarked;
          delete originalMessages[el.id];
        }
      })

      this.setState({
        originalMessages,
        searchMessagesCursors: {},
        selectMessageId: '',
      });
    }
  }

  /**
   * Загрузка новых сообщений
   */
  loadNextMessages = () => {
    const { isLoading, hasNextPage, lastMessageId } = this.state;

    if (!isLoading && hasNextPage) {
      const { elixirChatWidget } = this.props;
      elixirChatWidget.loadHistoryMessageNewer(lastMessageId);
    }
  };

  render() {
    const { elixirChatWidget, className, intl } = this.props;
    const {
      processedMessages,
      screenshotFallback,
      isLoading,
      isLoadingPrecedingMessageHistory,
      scrollBlockBottomOffset,
      currentlyTypingUsers,
      searchMessagesCursors,
      searchText,
      selectMessageId
    } = this.state;
    let messagesIds = [];

    if (searchText) {
      messagesIds = processedMessages.map(el => el.id);
    }

    return (

      <div className="exlixir-chat__wrapper">
        <MessageSearch
          onChangeText={this.changeSearchText}
          onScroll={this.scrollToMessage}
          elixirChatWidget={elixirChatWidget}
          searchMessagesCursors={searchMessagesCursors}
          messagesIds={messagesIds}
        />

        <div className={cn('elixirchat-chat-scroll', className)}
          onScroll={this.onScrollHandler}
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
                    'elixirchat-chat-messages__item--selected': message.id === selectMessageId,
                  })}
                    ref={element => this.createMessageRef(element, message)}
                    id={message.id}>

                    <div className="elixirchat-chat-messages__inner">
                      {!message.hasPreviewsOnly && (
                        <div className="elixirchat-chat-messages__balloon"
                          onDoubleClick={() => this.onReplyButtonClick(message.id)}>

                          {!message.sender.isCurrentClient && (
                            <div className="elixirchat-chat-messages__sender">
                              <b>{getUserFullName(message.sender) || getOperatorName(message.sender, elixirChatWidget.widgetCustomEmployerName, elixirChatWidget.widgetTitle)}</b>
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
                            {!message.sender.isCurrentClient && !message.isSystem && !message.rating && (
                              <div className="elixirchat-chat-messages__rating">
                                <button
                                  className="elixirchat-chat-messages__rating-button elixirchat-chat-messages__rating-button--positive"
                                  onClick={() => this.onRateMessage(message.id, 'POSITIVE')}
                                  title={intl.formatMessage({ id: 'rate_positive' })}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <rect width="20" height="20" rx="4"/>
                                    <path d="M10.1895 2.50391L10.5029 2.54297C11.317 2.64409 11.9045 3.11068 12.2119 3.75C12.5114 4.37308 12.5339 5.12984 12.3135 5.8418L11.8574 7.31543H14.2559C15.903 7.3157 17.133 8.83576 16.7695 10.4424L16.1846 13.0254C15.8983 14.2895 14.8698 15.322 13.5186 15.4385C11.652 15.5992 9.78 15.4644 7.97852 14.8125C7.90432 14.7856 7.83428 14.7523 7.7666 14.7168C7.60783 15.1722 7.17649 15.4999 6.66699 15.5H4.66699C4.02269 15.5 3.50005 14.9773 3.5 14.333V8.66699C3.5 8.02266 4.02266 7.5 4.66699 7.5H6.66699C6.79797 7.50004 6.92352 7.52264 7.04102 7.5625C7.25657 6.99607 7.61105 6.51758 7.96582 6.03223C8.53827 5.24906 9.1946 4.35275 9.64941 2.85449L9.68262 2.77148C9.77686 2.58773 9.97835 2.47783 10.1895 2.50391ZM4.66699 8.5C4.57494 8.5 4.5 8.57494 4.5 8.66699V14.333C4.50005 14.425 4.57498 14.5 4.66699 14.5H6.66699C6.75886 14.4998 6.83295 14.4249 6.83301 14.333V8.66699C6.83301 8.57505 6.75889 8.50018 6.66699 8.5H4.66699ZM10.4727 3.55176C9.97515 4.98115 9.30879 5.88965 8.77344 6.62207C8.18296 7.42991 7.83301 7.93537 7.83301 8.68945V13.1299C7.83305 13.4783 8.03261 13.7685 8.31836 13.8721C9.9495 14.4623 11.6692 14.5942 13.4326 14.4424C14.298 14.3678 15.0067 13.6977 15.209 12.8047L15.7939 10.2217C16.0141 9.24827 15.2696 8.3157 14.2559 8.31543H11.1787C11.0201 8.31531 10.8705 8.23999 10.7764 8.1123C10.6823 7.9846 10.6544 7.81952 10.7012 7.66797L11.3584 5.5459C11.5175 5.0319 11.4826 4.54055 11.3105 4.18262C11.1574 3.86433 10.8864 3.62946 10.4727 3.55176Z" fill="#B4B4B4"/>
                                    </svg>
                                </button>
                                <button
                                  className="elixirchat-chat-messages__rating-button elixirchat-chat-messages__rating-button--negative"
                                  onClick={() => this.onRateMessage(message.id, 'NEGATIVE')}
                                  title={intl.formatMessage({ id: 'rate_negative' })}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <rect width="20" height="20" rx="4"/>
                                    <path d="M10.1895 17.4961L10.5029 17.457C11.317 17.3559 11.9045 16.8893 12.2119 16.25C12.5114 15.6269 12.5339 14.8702 12.3135 14.1582L11.8574 12.6846H14.2559C15.903 12.6843 17.133 11.1642 16.7695 9.55762L16.1846 6.97461C15.8983 5.71047 14.8698 4.678 13.5186 4.56152C11.652 4.40081 9.78 4.53564 7.97852 5.1875C7.90432 5.21436 7.83428 5.24766 7.7666 5.2832C7.60783 4.82775 7.17649 4.50014 6.66699 4.5H4.66699C4.02269 4.5 3.50005 5.02271 3.5 5.66699V11.333C3.5 11.9773 4.02266 12.5 4.66699 12.5H6.66699C6.79797 12.5 6.92352 12.4774 7.04102 12.4375C7.25657 13.0039 7.61105 13.4824 7.96582 13.9678C8.53827 14.7509 9.1946 15.6472 9.64941 17.1455L9.68262 17.2285C9.77686 17.4123 9.97835 17.5222 10.1895 17.4961ZM4.66699 11.5C4.57494 11.5 4.5 11.4251 4.5 11.333V5.66699C4.50005 5.57499 4.57498 5.5 4.66699 5.5H6.66699C6.75886 5.50018 6.83295 5.5751 6.83301 5.66699V11.333C6.83301 11.4249 6.75889 11.4998 6.66699 11.5H4.66699ZM10.4727 16.4482C9.97515 15.0188 9.30879 14.1103 8.77344 13.3779C8.18296 12.5701 7.83301 12.0646 7.83301 11.3105V6.87012C7.83305 6.52171 8.03261 6.23155 8.31836 6.12793C9.9495 5.53765 11.6692 5.40579 13.4326 5.55762C14.298 5.63218 15.0067 6.30226 15.209 7.19531L15.7939 9.77832C16.0141 10.7517 15.2696 11.6843 14.2559 11.6846H11.1787C11.0201 11.6847 10.8705 11.76 10.7764 11.8877C10.6823 12.0154 10.6544 12.1805 10.7012 12.332L11.3584 14.4541C11.5175 14.9681 11.4826 15.4594 11.3105 15.8174C11.1574 16.1357 10.8864 16.3705 10.4727 16.4482Z" fill="#B4B4B4"/>
                                    </svg>
                                </button>
                              </div>
                            )}
                            {message.rating && (
                              <div className="elixirchat-chat-messages__rating elixirchat-chat-messages__rating--rated">
                                <span className="elixirchat-chat-messages__rating-icon">
                                  {message.rating.rating === 'POSITIVE' ? '👍' : '👎'}
                                </span>
                                {message.rating.comment && (
                                  <span className="elixirchat-chat-messages__rating-comment">
                                    {message.rating.comment}
                                  </span>
                                )}
                              </div>
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
                          <b>{getUserFullName(message.sender) || getOperatorName(message.sender, elixirChatWidget.widgetCustomEmployerName, elixirChatWidget.widgetTitle)}</b>
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

        {this.state.ratingCommentModal.isOpen && (
          <RatingCommentModal
            intl={this.props.intl}
            onSubmit={this.onRatingCommentSubmit}
            onSkip={this.onRatingCommentSkip}
          />
        )}
      </div>
    );
  }
}

export const ChatMessages = injectIntl(ChatMessagesComponent);
