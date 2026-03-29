<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '@defaultWidget/composables/useElixirChatWidget';
import { useMarkAsReadObserver } from '@defaultWidget/composables/useMarkAsReadObserver';
import {
  _flatten,
  _findIndex,
  _uniqBy,
  detectBrowser,
  getMediaType,
  randomDigitStringId
} from '@root/utilsCommon';
import {
  ERROR_ALERT,
  JOIN_ROOM_SUCCESS,
  MESSAGES_HISTORY_APPEND,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  MESSAGES_LAST_MESSAGE_ID,
  MESSAGES_PAGINATION,
  MESSAGES_RECEIVE,
  MESSAGES_SEARCH_IDS,
  TYPING_STATUS_CHANGE
} from '@sdk/ElixirChatEventTypes';
import { fitDimensionsIntoLimits, isMobile } from '@root/utilsWidgetVue';
import { serializeMessage } from '@sdk/serializers/serializeMessage';
import { getScreenshotCompatibilityFallback } from '@sdk/ScreenshotTaker';
import {
  WIDGET_FULLSCREEN_PREVIEW_OPEN,
  WIDGET_TEXTAREA_RESIZE,
  WIDGET_REPLY_MESSAGE,
  WIDGET_POPUP_OPEN
} from '@widget/ElixirChatWidgetEventTypes';
import RatingModal from '@defaultWidget/components/RatingModal.vue';
import MessageSearch from '@defaultWidget/components/MessageSearch.vue';
import ChatSystemMessage from './ChatSystemMessage.vue';
import ChatTyping from './ChatTyping.vue';
import ChatMessageItem from './ChatMessageItem.vue';
import ChatMessagesViewport from './ChatMessagesViewport.vue';

const MESSAGE_CHUNK_SIZE = 20;
const MAX_THUMBNAIL_SIZE = isMobile() ? 208 : 256;
const LOAD_PRECEDING_MESSAGES_SCROLL_Y_POSITION = 10;
const SCROLL_LOAD_NEXT_THRESHOLD_PX = 15;

type HistoryUpdateParams = {
  chunk: any[];
  prepend?: boolean;
  append?: boolean;
};

const { locale, t } = useI18n();

const elixirChatWidget = useElixirChatWidget();

const processedMessages = ref<any[]>([]);
const fullScreenPreviews = ref<any[]>([]);
const hasPreviousPage = ref(false);
const hasNextPage = ref(false);
const lastMessageId = ref('');
const isLoading = ref(false);
const currentlyTypingUsers = ref<any[]>([]);
const isLoadingPrecedingMessageHistory = ref(false);
const hasInitiallyScrolledToAppropriatePosition = ref(false);
const searchText = ref('');
const selectMessageId = ref('');
const searchMessagesIds = ref<string[]>([]);
const originalMessages = ref<Record<string, string>>({});
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef');
const messageRefs = ref<Record<string, HTMLElement>>({});

let initialScrollTimeout: ReturnType<typeof setTimeout> | null = null;

const scrollBlockBottomOffset = ref<number | null>(null);

const screenshotFallback = ref<{
  pressKey?: string | null;
  pressKeySecondary?: string;
} | null>(null);

const ratingLocksByMessageId = ref<Record<string, boolean>>({});
const ratingCommentModal = ref({
  isOpen: false,
  ratingId: null as string | null,
  messageId: null as string | null,
  isSubmitted: false
});

const markAsReadObserver = useMarkAsReadObserver({
  rootRef: scrollContainerRef,
  onMarkAsRead(messageId: string) {
    elixirChatWidget.setLastReadMessage(messageId);
  }
});

function isHiddenSystemMessage(message: any): boolean {
  return Boolean(message?.isSystem && message?.systemData?.type === 'HighLoadMessage');
}

const visibleMessages = computed(() =>
  processedMessages.value.filter((message) => !isHiddenSystemMessage(message))
);

function processMessageAttachments(message: any) {
  const previews: any[] = [];
  const files: any[] = [];

  if (message.isDeleted) {
    return {
      previews,
      files
    };
  }

  const attachments = Array.isArray(message.attachments) ? message.attachments : [];

  attachments.forEach((attachment) => {
    const { width, height, contentType } = attachment;
    const previewType = getMediaType(contentType);

    if (previewType === 'image' || previewType === 'video') {
      const [thumbnailWidth, thumbnailHeight] = fitDimensionsIntoLimits(
        width,
        height,
        MAX_THUMBNAIL_SIZE,
        MAX_THUMBNAIL_SIZE
      );

      previews.push({
        ...attachment,
        thumbnailWidth,
        thumbnailHeight,
        previewType
      });
      return;
    }

    files.push(attachment);
  });

  return {
    previews,
    files
  };
}

function onTypingStatusChange(users: any[]) {
  currentlyTypingUsers.value = Array.isArray(users) ? users : [];
}

function onRetrySendMessage(message: any): void {
  elixirChatWidget.retrySendMessage(message).catch(() => {});
}

function generateNewClientPlaceholderMessage(firstEverMessageInHistory: any) {
  const placeholderMessage = serializeMessage({
    id: randomDigitStringId(6),
    isSystem: true,
    timestamp: firstEverMessageInHistory?.timestamp || new Date().toISOString(),
    __typename: 'NewClientPlaceholderMessage'
  }, elixirChatWidget as any);

  return {
    ...placeholderMessage,
    showGroupChatLabel: true
  };
}

function processMessages(messages: any[], shouldInjectNewClientPlaceholder: boolean) {
  const safeMessages = Array.isArray(messages) ? messages : [];

  let normalizedMessages = safeMessages.map((message, index) => {
    const { previews, files } = processMessageAttachments(message);
    let showDateLabel = false;

    const previousMessage = safeMessages[index - 1] || {};
    const isDifferentDateFromPreviousMessage = previousMessage.id
      && dayjs(previousMessage.timestamp).isBefore(dayjs(message.timestamp).startOf('day'));

    if (isDifferentDateFromPreviousMessage && !message.isDeleted) {
      showDateLabel = true;
    }

    const hasText = Boolean(message.text?.trim());
    const hasFiles = files.length > 0;
    const hasReply = Boolean(message.responseToMessage?.id) && !message.responseToMessage?.isDeleted;
    const hasPreviewsOnly = message.sender?.isCurrentClient && !hasText && !hasReply && !hasFiles;

    return {
      ...message,
      files,
      previews,
      showDateLabel,
      hasPreviewsOnly
    };
  });

  const firstEverMessageInHistory = shouldInjectNewClientPlaceholder ? safeMessages[0] : null;
  if (shouldInjectNewClientPlaceholder && (firstEverMessageInHistory?.sender?.isClient || !firstEverMessageInHistory)) {
    normalizedMessages = [
      generateNewClientPlaceholderMessage(firstEverMessageInHistory),
      ...normalizedMessages
    ];
  }

  return normalizedMessages;
}

function extractFullScreenPreviews(messages: any[]) {
  return _flatten(messages.map((message) => processMessageAttachments(message).previews));
}

function markSearchText(messages: any[], updateState = false): any[] {
  const nextMessages = JSON.parse(JSON.stringify(messages || []));
  const nextOriginalMessages = { ...originalMessages.value };
  const normalizedSearchText = searchText.value.trim();

  if (!normalizedSearchText) {
    originalMessages.value = {};
    return nextMessages;
  }

  const escapedSearchText = normalizedSearchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regExp = new RegExp(escapedSearchText, 'gim');

  nextMessages.forEach((message) => {
    const messageId = String(message.id);

    if (Object.prototype.hasOwnProperty.call(nextOriginalMessages, messageId) && message.isMarked) {
      message.text = nextOriginalMessages[messageId];
      delete message.isMarked;
      delete nextOriginalMessages[messageId];
    }

    if (!searchMessagesIds.value.includes(messageId)) {
      return;
    }

    if (!message.isMarked && message.text) {
      nextOriginalMessages[messageId] = message.text;
      message.isMarked = true;
      message.text = message.text.replace(regExp, (match) => `★${match}★`);
    }
  });

  originalMessages.value = nextOriginalMessages;

  if (updateState) {
    processedMessages.value = nextMessages;
  }

  return nextMessages;
}

function onSearchIds(ids: string[]) {
  searchMessagesIds.value = (ids || []).map((id) => String(id));
  markSearchText(processedMessages.value, true);
}

function updateMessageHistory(params: HistoryUpdateParams, callback?: () => void) {
  const { chunk, prepend, append } = params;
  const normalizedChunk = Array.isArray(chunk) ? chunk : [];
  const shouldInjectNewClientPlaceholder = !append && !prepend && !hasPreviousPage.value;
  let nextProcessedMessages = processMessages(normalizedChunk, shouldInjectNewClientPlaceholder);
  let nextFullScreenPreviews = extractFullScreenPreviews(normalizedChunk);

  if (append) {
    nextProcessedMessages = _uniqBy(
      [...processedMessages.value, ...nextProcessedMessages],
      'id'
    ) as any[];
  } else if (prepend) {
    nextProcessedMessages = _uniqBy(
      [...nextProcessedMessages, ...processedMessages.value],
      'id'
    ) as any[];
  }

  if (searchMessagesIds.value.length) {
    nextProcessedMessages = markSearchText(nextProcessedMessages);
  }

  if (append) {
    nextFullScreenPreviews = _uniqBy(
      [...fullScreenPreviews.value, ...nextFullScreenPreviews],
      'id'
    ) as any[];
  } else if (prepend) {
    nextFullScreenPreviews = _uniqBy(
      [...nextFullScreenPreviews, ...fullScreenPreviews.value],
      'id'
    ) as any[];
  }

  processedMessages.value = nextProcessedMessages;
  fullScreenPreviews.value = nextFullScreenPreviews;
  markAsReadObserver.syncMessages(
    visibleMessages.value.map((message) => ({
      id: String(message.id),
      isUnread: Boolean(message.isUnread)
    }))
  );

  callback?.();
}

function hasUserScroll(): boolean {
  const scrollBlock = scrollContainerRef.value;
  if (!scrollBlock) {
    return false;
  }
  return scrollBlock.scrollTop <= scrollBlock.scrollHeight - scrollBlock.offsetHeight - 30;
}

function scrollToBottom(smooth = true) {
  nextTick(() => {
    requestAnimationFrame(() => {
      const el = scrollContainerRef.value;
      if (el) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    });
  });
}

function scrollToFirstUnreadMessage() {
  const { messageHistory, lastReadMessageId } = elixirChatWidget;
  const lastReadMessageIndex = _findIndex(messageHistory, { id: lastReadMessageId });

  const lastReadMessagePrecedesLoadedMessageHistory = lastReadMessageId && !lastReadMessageIndex;

  if (!lastReadMessagePrecedesLoadedMessageHistory) {
    requestAnimationFrame(() => {
      const firstUnreadMessage = messageHistory[(lastReadMessageIndex ?? -1) + 1];
      const id = firstUnreadMessage?.id;
      const messageElementToScrollTo = id ? messageRefs.value[String(id)] : null;
      if (messageElementToScrollTo) {
        setTimeout(() => {
          messageElementToScrollTo.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        });
      } else {
        scrollToBottom();
      }
    });
  }
}

function setMessageRef(messageId: string, isUnread: boolean, el: HTMLElement | null) {
  const id = String(messageId);
  const previousElement = messageRefs.value[id];

  if (el) {
    if (previousElement !== el) {
      messageRefs.value = {
        ...messageRefs.value,
        [id]: el
      };
    }
  } else if (previousElement) {
    const next = { ...messageRefs.value };
    delete next[id];
    messageRefs.value = next;
  }

  markAsReadObserver.setMessageRef(id, Boolean(isUnread), el);
}

function scrollInitiallyToAppropriatePosition() {
  elixirChatWidget.off(WIDGET_POPUP_OPEN, scrollInitiallyToAppropriatePosition);

  if (elixirChatWidget.widgetChatScrollY) {
    requestAnimationFrame(() => {
      const el = scrollContainerRef.value;
      if (el) {
        el.scrollTop = elixirChatWidget.widgetChatScrollY as number;
      }
    });
  } else {
    scrollToFirstUnreadMessage();
  }

  if (initialScrollTimeout != null) {
    clearTimeout(initialScrollTimeout);
  }
  initialScrollTimeout = setTimeout(() => {
    hasInitiallyScrolledToAppropriatePosition.value = true;
    initialScrollTimeout = null;
  }, 3000);
}

function preventSafariFromLockingScroll() {
  const scrollBlock = scrollContainerRef.value;
  if (!scrollBlock) {
    return;
  }
  const originalBackgroundColor = scrollBlock.style.backgroundColor;
  scrollBlock.style.backgroundColor = 'inherit';
  setTimeout(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.style.backgroundColor = originalBackgroundColor;
    }
  });
}

function onWidgetPopupOpen() {
  if (detectBrowser() === 'safari') {
    preventSafariFromLockingScroll();
  }
}

function onWidgetTextareaResize(offset: number) {
  const userScrolledAwayFromBottom = hasUserScroll();
  scrollBlockBottomOffset.value = offset;
  if (!userScrolledAwayFromBottom) {
    scrollToBottom();
  }
}

function onMessageReceive(message: any) {
  const shouldScrollMessagesToBottom = document.hasFocus()
    && elixirChatWidget.widgetIsPopupOpen
    && (message.sender?.isCurrentClient || !hasUserScroll());

  updateMessageHistory({
    chunk: [message],
    append: true
  });

  if (shouldScrollMessagesToBottom) {
    scrollToBottom(false);
  }
}

function onMessageHistoryChange(chunk: any[]) {
  updateMessageHistory({ chunk });
}

function onMessageHistoryPrepend(chunk: any[]) {
  updateMessageHistory({
    chunk,
    prepend: true
  });
}

function onMessageHistoryAppend(chunk: any[]) {
  updateMessageHistory({
    chunk,
    append: true
  });
}

function changeSearchText(text = '') {
  searchText.value = text;

  if (!text) {
    const nextProcessedMessages = [...processedMessages.value];
    const nextOriginalMessages = { ...originalMessages.value };

    nextProcessedMessages.forEach((message) => {
      const messageId = String(message.id);

      if (!searchMessagesIds.value.includes(messageId)) {
        return;
      }

      if (Object.prototype.hasOwnProperty.call(nextOriginalMessages, messageId)) {
        message.text = nextOriginalMessages[messageId];
        delete message.isMarked;
        delete nextOriginalMessages[messageId];
      }
    });

    originalMessages.value = {};
    selectMessageId.value = '';
    processedMessages.value = nextProcessedMessages;
    return;
  }

  markSearchText(processedMessages.value, true);
}

function scrollToMessage(messageId: string, direction?: 'up' | 'down') {
  const scrollBlock = scrollContainerRef.value;
  if (!scrollBlock) {
    return;
  }

  selectMessageId.value = String(messageId);

  const target = messageRefs.value[String(messageId)] || scrollBlock.ownerDocument.getElementById(String(messageId));
  const chatHeight = 380;

  if (!target) {
    scrollBlock.scrollTo({
      top: chatHeight,
      behavior: 'smooth'
    });
    return;
  }

  const gap = scrollBlock.clientHeight / 2 - target.clientHeight / 2;

  if (direction === 'up') {
    scrollBlock.scrollTo({
      top: target.offsetTop - target.clientHeight / 2,
      behavior: 'auto'
    });
  } else if (direction === 'down') {
    scrollBlock.scrollTo({
      top: gap,
      behavior: 'auto'
    });
  }

  scrollBlock.scrollTo({
    top: target.offsetTop - gap,
    behavior: 'smooth'
  });
}

function onReplyOriginalMessageClick(messageId: string | number) {
  const target = messageRefs.value[String(messageId)];
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

const loadedMessageIdsForSearch = computed(() => {
  if (!searchText.value) {
    return [];
  }
  return processedMessages.value.map((message) => String(message.id));
});

function onMessagesPagination(pageInfo: {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}) {
  hasPreviousPage.value = pageInfo.hasPreviousPage;
  hasNextPage.value = pageInfo.hasNextPage;
}

function onLastMessageId(id: string | undefined) {
  lastMessageId.value = id ? String(id) : '';
}

function loadPrecedingMessages() {
  const scrollBlock = scrollContainerRef.value;
  if (!scrollBlock) {
    return;
  }

  const initialScrollHeight = scrollBlock.scrollHeight;
  const shouldLoadPreviousMessages = !isLoading.value
    && !isLoadingPrecedingMessageHistory.value
    && hasPreviousPage.value
    && hasInitiallyScrolledToAppropriatePosition.value;

  if (!shouldLoadPreviousMessages) {
    return;
  }

  isLoadingPrecedingMessageHistory.value = true;

  elixirChatWidget
    .fetchPrecedingMessageHistory(MESSAGE_CHUNK_SIZE)
    .catch((e: any) => {
      elixirChatWidget.triggerEvent(ERROR_ALERT, {
        customMessage: e.errorMessage,
        retryCallback: loadPrecedingMessages,
        error: e.rawError
      });
      throw e;
    })
    .finally(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          const block = scrollContainerRef.value;
          if (block) {
            block.scrollTop = block.scrollHeight - initialScrollHeight;
          }
          setTimeout(() => {
            isLoadingPrecedingMessageHistory.value = false;
          }, 500);
        });
      });
    });
}

function loadNextMessages() {
  if (!isLoading.value && hasNextPage.value && lastMessageId.value) {
    elixirChatWidget.loadHistoryMessageNewer(lastMessageId.value);
  }
}

function scrollPosition(scrollTop: number) {
  if (scrollTop <= LOAD_PRECEDING_MESSAGES_SCROLL_Y_POSITION) {
    loadPrecedingMessages();
  } else {
    const scrollBlock = scrollContainerRef.value;
    if (!scrollBlock) {
      return;
    }
    const scrollBottom = scrollBlock.scrollHeight - scrollBlock.scrollTop - scrollBlock.clientHeight;
    if (scrollBottom < SCROLL_LOAD_NEXT_THRESHOLD_PX) {
      loadNextMessages();
    }
  }
}

const debouncedScrollPosition = debounce(scrollPosition, 400);

function onScrollHandler(event: Event) {
  const target = event.target as HTMLDivElement;
  debouncedScrollPosition(target.scrollTop);
}

function loadInitialMessages() {
  if (initialScrollTimeout != null) {
    clearTimeout(initialScrollTimeout);
    initialScrollTimeout = null;
  }
  hasInitiallyScrolledToAppropriatePosition.value = false;

  isLoading.value = true;

  const { messageSubscription } = elixirChatWidget;
  const hasCachedHistory = messageSubscription.hasFetchedInitialHistory && elixirChatWidget.messageHistory.length;

  if (hasCachedHistory) {
    onMessageHistoryChange(elixirChatWidget.messageHistory);
    isLoading.value = false;
    elixirChatWidget.waitForPopupToOpen(scrollInitiallyToAppropriatePosition);
    return;
  }

  elixirChatWidget
    .fetchMessageHistory(MESSAGE_CHUNK_SIZE)
    .then(() => {
      elixirChatWidget.waitForPopupToOpen(scrollInitiallyToAppropriatePosition);
    })
    .catch((error) => {
      elixirChatWidget.triggerEvent(ERROR_ALERT, {
        customMessage: error.errorMessage,
        retryCallback: loadInitialMessages,
        error: error.rawError
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const calendarFormat = computed(() => ({
  sameDay: `[${t('today')}, ] D MMMM`,
  lastDay: `[${t('yesterday')}, ] D MMMM`,
  lastWeek: 'D MMMM',
  sameElse: 'D MMMM'
}));

function onReplyButtonClick(messageId) {
  elixirChatWidget.triggerEvent(WIDGET_REPLY_MESSAGE, messageId);
}

function onPreviewClick(event, preview, sender) {
  event.preventDefault();
  elixirChatWidget.triggerEvent(WIDGET_FULLSCREEN_PREVIEW_OPEN, {
    preview,
    sender,
    gallery: fullScreenPreviews.value
  });
}

function isMessageRated(message: any): boolean {
  return Boolean(message?.rating && (message.rating.id || message.rating.rating));
}

function isMessageLocked(messageId: string): boolean {
  return Boolean(ratingLocksByMessageId.value[messageId]);
}

function closeRatingCommentModal() {
  ratingCommentModal.value = {
    isOpen: false,
    ratingId: null,
    messageId: null,
    isSubmitted: false
  };
}

async function onRate(messageId: string, rating: 'POSITIVE' | 'NEGATIVE') {
  const message = processedMessages.value.find((m) => m.id === messageId);
  if (!message || isMessageRated(message) || isMessageLocked(messageId)) {
    return;
  }

  ratingLocksByMessageId.value = {
    ...ratingLocksByMessageId.value,
    [messageId]: true
  };

  if (rating === 'NEGATIVE') {
    ratingCommentModal.value = {
      isOpen: true,
      messageId,
      ratingId: null,
      isSubmitted: false
    };
  }

  try {
    const result = await elixirChatWidget.rateMessage(messageId, rating);
    if (rating === 'NEGATIVE' && ratingCommentModal.value.isOpen && ratingCommentModal.value.messageId === messageId) {
      ratingCommentModal.value = {
        ...ratingCommentModal.value,
        ratingId: result.id
      };
    }
  } catch (error) {
    elixirChatWidget.logError('Failed to rate message', error);
    ratingLocksByMessageId.value = {
      ...ratingLocksByMessageId.value,
      [messageId]: false
    };
  }
}

async function onRatingCommentSubmit(comment: string) {
  const { ratingId } = ratingCommentModal.value;
  if (!ratingId) {
    return;
  }
  try {
    await elixirChatWidget.addRatingComment(ratingId, comment);
    ratingCommentModal.value = {
      ...ratingCommentModal.value,
      isSubmitted: true
    };
  } catch {
    closeRatingCommentModal();
  }
}

onMounted(() => {
  dayjs.extend(dayjsCalendar);
  dayjs.locale(locale.value);

  elixirChatWidget.on(JOIN_ROOM_SUCCESS, loadInitialMessages);
  elixirChatWidget.on(MESSAGES_RECEIVE, onMessageReceive);
  elixirChatWidget.on(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
  elixirChatWidget.on(MESSAGES_HISTORY_PREPEND, onMessageHistoryPrepend);
  elixirChatWidget.on(MESSAGES_HISTORY_APPEND, onMessageHistoryAppend);
  elixirChatWidget.on(MESSAGES_PAGINATION, onMessagesPagination);
  elixirChatWidget.on(MESSAGES_LAST_MESSAGE_ID, onLastMessageId);
  elixirChatWidget.on(MESSAGES_SEARCH_IDS, onSearchIds);
  elixirChatWidget.on(WIDGET_TEXTAREA_RESIZE, onWidgetTextareaResize);
  elixirChatWidget.on(TYPING_STATUS_CHANGE, onTypingStatusChange);
  elixirChatWidget.on(WIDGET_POPUP_OPEN, onWidgetPopupOpen);

  screenshotFallback.value = getScreenshotCompatibilityFallback();
});

onBeforeUnmount(() => {
  debouncedScrollPosition.cancel();
  if (initialScrollTimeout != null) {
    clearTimeout(initialScrollTimeout);
    initialScrollTimeout = null;
  }
  elixirChatWidget.off(WIDGET_POPUP_OPEN, scrollInitiallyToAppropriatePosition);

  elixirChatWidget.off(JOIN_ROOM_SUCCESS, loadInitialMessages);
  elixirChatWidget.off(MESSAGES_RECEIVE, onMessageReceive);
  elixirChatWidget.off(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
  elixirChatWidget.off(MESSAGES_HISTORY_PREPEND, onMessageHistoryPrepend);
  elixirChatWidget.off(MESSAGES_HISTORY_APPEND, onMessageHistoryAppend);
  elixirChatWidget.off(MESSAGES_PAGINATION, onMessagesPagination);
  elixirChatWidget.off(MESSAGES_LAST_MESSAGE_ID, onLastMessageId);
  elixirChatWidget.off(MESSAGES_SEARCH_IDS, onSearchIds);
  elixirChatWidget.off(WIDGET_TEXTAREA_RESIZE, onWidgetTextareaResize);
  elixirChatWidget.off(TYPING_STATUS_CHANGE, onTypingStatusChange);
  elixirChatWidget.off(WIDGET_POPUP_OPEN, onWidgetPopupOpen);
});
</script>

<template>
  <div class="exlixir-chat__wrapper">
    <message-search
      :messages-ids="loadedMessageIdsForSearch"
      @change-text="changeSearchText"
      @scroll-message="scrollToMessage"
    />
    <div
      ref="scrollContainerRef"
      class="elixirchat-chat-scroll"
      :style="scrollBlockBottomOffset !== null ? { bottom: `${scrollBlockBottomOffset}px` } : undefined"
      @scroll="onScrollHandler"
    >
      <chat-messages-viewport
        :is-loading="isLoading"
        :is-loading-preceding-message-history="isLoadingPrecedingMessageHistory"
      >
        <template
          v-for="message in visibleMessages"
          :key="message.id"
        >
          <template v-if="message.showGroupChatLabel && !elixirChatWidget.room?.isPrivate">
            <div class="elixirchat-chat-messages__group-chat-label">
              {{ t('this_is_a_support_group', { title: elixirChatWidget.room?.title }) }}
            </div>
          </template>

          <div
            v-if="message.showDateLabel"
            class="elixirchat-chat-messages__date-title"
          >
            {{ dayjs(message.timestamp).calendar(null, calendarFormat) }}
          </div>

          <chat-message-item
            v-if="!message.isSystem && !message.isDeleted"
            :message="message"
            :elixir-chat-widget="elixirChatWidget"
            :reply-text="t('reply')"
            :is-message-locked="isMessageLocked(message.id)"
            :is-selected="String(message.id) === selectMessageId"
            @preview-click="onPreviewClick"
            @message-ref="setMessageRef"
            @reply="onReplyButtonClick"
            @reply-original-click="onReplyOriginalMessageClick"
            @rate="onRate"
            @retry="onRetrySendMessage"
          />

          <chat-system-message
            v-if="message.isSystem"
            :id="String(message.id)"
            :message="message"
            :screenshot-fallback="screenshotFallback"
            @message-ref="setMessageRef"
          />
        </template>
      </chat-messages-viewport>

      <chat-typing
        v-if="currentlyTypingUsers.length"
        :currently-typing-users-count="currentlyTypingUsers.length"
      />
    </div>

    <rating-modal
      v-if="ratingCommentModal.isOpen"
      :is-submitted="ratingCommentModal.isSubmitted"
      :is-ready="Boolean(ratingCommentModal.ratingId)"
      @submit="onRatingCommentSubmit"
      @skip="closeRatingCommentModal"
    />
  </div>
</template>
