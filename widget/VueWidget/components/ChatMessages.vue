<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { _flatten, _uniqBy, getMediaType, randomDigitStringId } from '../../../utilsCommon';
import {
  ERROR_ALERT,
  JOIN_ROOM_SUCCESS,
  MESSAGES_HISTORY_APPEND,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  MESSAGES_RECEIVE
} from '../../../sdk/ElixirChatEventTypes';
import { fitDimensionsIntoLimits, isMobile } from '../../../utilsWidget';
import { serializeMessage } from '../../../sdk/serializers/serializeMessage';

const MESSAGE_CHUNK_SIZE = 20;
const MAX_THUMBNAIL_SIZE = isMobile() ? 208 : 256;

type HistoryUpdateParams = {
  chunk: any[];
  prepend?: boolean;
  append?: boolean;
};

const { locale } = useI18n();

const elixirChatWidget = useElixirChatWidget();

const processedMessages = ref<any[]>([]);
const fullScreenPreviews = ref<any[]>([]);
const hasPreviousPage = ref(false);
const isLoading = ref(false);
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef');

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

function processMessages(messages: any[], hasPreviousPageInHistory: boolean) {
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

  const firstEverMessageInHistory = hasPreviousPageInHistory ? safeMessages[0] : null;
  if (hasPreviousPageInHistory && (firstEverMessageInHistory?.sender?.isClient || !firstEverMessageInHistory)) {
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
  let nextProcessedMessages = processMessages(normalizedChunk, !hasPreviousPage.value);
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

function onMessageReceive(message: any) {
  updateMessageHistory({
    chunk: [message],
    append: true
  });
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

function loadInitialMessages() {
  isLoading.value = true;

  const { messageSubscription } = elixirChatWidget;
  const hasCachedHistory = messageSubscription.hasFetchedInitialHistory && elixirChatWidget.messageHistory.length;

  if (hasCachedHistory) {
    onMessageHistoryChange(elixirChatWidget.messageHistory);
    isLoading.value = false;
    return;
  }

  elixirChatWidget.fetchMessageHistory(MESSAGE_CHUNK_SIZE)
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

onMounted(() => {
  dayjs.extend(dayjsCalendar);
  dayjs.locale(locale.value);

  elixirChatWidget.on(JOIN_ROOM_SUCCESS, loadInitialMessages);
  elixirChatWidget.on(MESSAGES_RECEIVE, onMessageReceive);
  elixirChatWidget.on(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
  elixirChatWidget.on(MESSAGES_HISTORY_PREPEND, onMessageHistoryPrepend);
  elixirChatWidget.on(MESSAGES_HISTORY_APPEND, onMessageHistoryAppend);
});

onBeforeUnmount(() => {
  elixirChatWidget.off(JOIN_ROOM_SUCCESS, loadInitialMessages);
  elixirChatWidget.off(MESSAGES_RECEIVE, onMessageReceive);
  elixirChatWidget.off(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
  elixirChatWidget.off(MESSAGES_HISTORY_PREPEND, onMessageHistoryPrepend);
  elixirChatWidget.off(MESSAGES_HISTORY_APPEND, onMessageHistoryAppend);
});
</script>

<template>
  <div class="exlixir-chat__wrapper">
    <div
      ref="scrollContainerRef"
      class="elixirchat-chat-scroll"
    >
      <div class="elixirchat-chat-messages">
        <div
          v-if="isLoading"
          class="elixirchat-chat-messages__loading"
        >
          Loading...
        </div>

        <div
          v-for="message in processedMessages"
          :id="message.id"
          :key="message.id"
          class="elixirchat-chat-message"
        >
          <div class="elixirchat-chat-message__text">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
