<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../../composables/useElixirChatWidget';
import {
  _flatten,
  _findIndex,
  _uniqBy,
  getMediaType,
  randomDigitStringId,
  getUserFullName,
  getOperatorName
} from '../../../../utilsCommon';
import {
  ERROR_ALERT,
  JOIN_ROOM_SUCCESS,
  MESSAGES_HISTORY_APPEND,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  MESSAGES_LAST_MESSAGE_ID,
  MESSAGES_PAGINATION,
  MESSAGES_RECEIVE
} from '../../../../sdk/ElixirChatEventTypes';
import { fitDimensionsIntoLimits, isMobile, generateReplyMessageQuote, humanizeUpcomingDate } from '../../../../utilsWidgetVue';
import { serializeMessage } from '../../../../sdk/serializers/serializeMessage';
import Avatar from '../avatar.vue';
import FormattedMarkdown from '../FormattedMarkdown.vue';
import ChatMessagePreviews from './ChatMessagePreviews.vue';
import { getScreenshotCompatibilityFallback } from '../../../../sdk/ScreenshotTaker';
import submissionErrorMessage from './submissionErrorMessage.vue';
import ChatMessageFiles from './ChatMessageFiles.vue';
import ChatSystemMessage from './ChatSystemMessage.vue';
import {
  WIDGET_FULLSCREEN_PREVIEW_OPEN,
  WIDGET_TEXTAREA_RESIZE,
  WIDGET_REPLY_MESSAGE,
  WIDGET_POPUP_OPEN
} from '../../../ElixirChatWidgetEventTypes';
import RatingButton from './RatingButton.vue';
import RatingModal from '../RatingModal.vue';

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
const isLoadingPrecedingMessageHistory = ref(false);
const hasInitiallyScrolledToAppropriatePosition = ref(false);
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef');

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

  callback?.();
}

function hasUserScroll(): boolean {
  const scrollBlock = scrollContainerRef.value;
  if (!scrollBlock) {
    return false;
  }
  return scrollBlock.scrollTop <= scrollBlock.scrollHeight - scrollBlock.offsetHeight - 30;
}

function scrollToBottom() {
  nextTick(() => {
    requestAnimationFrame(() => {
      const el = scrollContainerRef.value;
      if (el) {
        el.scrollTop = el.scrollHeight;
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
      const scrollEl = scrollContainerRef.value;
      const doc = scrollEl?.ownerDocument;
      const messageElementToScrollTo = id && doc ? doc.getElementById(String(id)) : null;
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
    scrollToBottom();
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

function processedAvatar(message: any): string {
  return message.sender.avatar.url || '';
}

function getMentionsStr(message: any) {
  return message.mentions.map((mention) => {
    return mention.value === 'ALL'
      ? t('everyone')
      : getUserFullName(mention.client, ' ');
  }).join(', ');
};

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
  elixirChatWidget.on(WIDGET_TEXTAREA_RESIZE, onWidgetTextareaResize);

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
  elixirChatWidget.off(WIDGET_TEXTAREA_RESIZE, onWidgetTextareaResize);
});
</script>

<template>
  <div class="exlixir-chat__wrapper">
    <!-- MessageSearch -->
    <div
      ref="scrollContainerRef"
      class="elixirchat-chat-scroll"
      :style="scrollBlockBottomOffset !== null ? { bottom: `${scrollBlockBottomOffset}px` } : undefined"
      @scroll="onScrollHandler"
    >
      <i
        class="elixirchat-chat-scroll-progress-bar"
        :class="{
          'elixirchat-chat-scroll-progress-bar--animating': isLoadingPrecedingMessageHistory
        }"
      />
      <div
        class="elixirchat-chat-messages"
        :class="{
          'elixirchat-chat-messages--loading': isLoading
        }"
      >
        <!-- Вывод сообщений -->
        <template
          v-for="message in processedMessages"
          :key="message.id"
        >
          <!-- Групповой лейбл -->
          <template v-if="message.showGroupChatLabel && !elixirChatWidget.room?.isPrivate">
            <div class="elixirchat-chat-messages__group-chat-label">
              {{ t('this_is_a_support_group', { title: elixirChatWidget.room?.title }) }}
            </div>
          </template>

          <!-- дата -->
          <div
            v-if="message.showDateLabel"
            class="elixirchat-chat-messages__date-title"
          >
            {{ dayjs(message.timestamp).calendar(null, calendarFormat) }}
          </div>

          <!-- Обычные сообщения -->
          <div
            v-if="!message.isSystem && !message.isDeleted"
            :id="String(message.id)"
            class="elixirchat-chat-messages__item"
            :class="
              {
                'elixirchat-chat-messages__item--by-me': message.sender?.isCurrentClient,
                'elixirchat-chat-messages__item--by-operator': message.sender?.isOperator,
                'elixirchat-chat-messages__item--by-client': message.sender?.isClient,
                'elixirchat-chat-messages__item--by-another-client': !message.sender.isOperator && !message.sender.isCurrentClient,
                'elixirchat-chat-messages__item--unread': message.isUnread
              }"
          >
            <div class="elixirchat-chat-messages__inner">
              <div
                v-if="!message.hasPreviewsOnly"
                class="elixirchat-chat-messages__balloon"
              >
                <div v-if="!message.sender.isCurrentClient">
                  <div class="elixirchat-chat-messages__sender">
                    <avatar :src="processedAvatar(message)" />
                    <span class="elixirchat-chat-messages__sender-info">
                      <b>
                        {{ getUserFullName(message.sender)
                          || getOperatorName(message.sender, elixirChatWidget.widgetCustomEmployerName, elixirChatWidget.widgetTitle) }}
                      </b>
                      <template v-if="Boolean(message.mentions.length)">
                        <span class="mention-prefix"> → @</span>
                        {{ getMentionsStr(message) }}
                      </template>
                      <span class="elixirchat-chat-messages__time">
                        {{ dayjs(message.timestamp).format('H:mm') }}
                      </span>
                    </span>
                  </div>
                </div>

                <div v-if="message.responseToMessage.id && !message.responseToMessage.isDeleted">
                  <div class="elixirchat-chat-messages__reply-message">
                    {{ generateReplyMessageQuote(message.responseToMessage, elixirChatWidget) }}
                  </div>
                </div>

                <formatted-markdown
                  v-if="message.text"
                  class="elixirchat-chat-messages__text"
                  :markdown="message.text"
                />

                <chat-message-files
                  v-if="message.files.length"
                  :files="message.files"
                  :is-submitting="message.isSubmitting"
                />
              </div>

              <chat-message-previews
                v-if="message.previews.length"
                :previews="message.previews"
                :is-submitting="message.isSubmitting"
                :sender="message.sender"
                @preview-click="onPreviewClick"
              />

              <div class="elixirchat-chat-messages__bottom">
                <submissionErrorMessage
                  v-if="message.submissionErrorCode"
                  :message="message"
                  @retry="elixirChatWidget.retrySendMessage(message)"
                />
                <template v-else>
                  <span
                    class="elixirchat-chat-messages__reply-button"
                    @click="onReplyButtonClick(message.id)"
                  >
                    {{ t('reply') }}
                  </span>
                  <template v-if="message.sender.isOperator && !message.isSystem">
                    <div class="elixirchat-chat-messages__rating">
                      <rating-button
                        type="POSITIVE"
                        :message-id="message.id"
                        :rating="message?.rating?.rating"
                        :is-locked="isMessageLocked(message.id)"
                        @rate="onRate"
                      />
                      <rating-button
                        type="NEGATIVE"
                        :message-id="message.id"
                        :rating="message?.rating?.rating"
                        :is-locked="isMessageLocked(message.id)"
                        @rate="onRate"
                      />
                    </div>
                  </template>
                  <span v-if="message.sender.isCurrentClient">
                    {{ dayjs(message.timestamp).format('H:mm') }}
                  </span>
                </template>
              </div>
            </div>
          </div>

          <!-- Системные сообщения -->
          <chat-system-message
            v-if="message.isSystem"
            :id="String(message.id)"
            :message="message"
            :screenshot-fallback="screenshotFallback"
          />
        </template>
      </div>
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
