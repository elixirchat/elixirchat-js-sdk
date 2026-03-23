<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { _uniqBy } from '../../../utilsCommon';
import {
  ERROR_ALERT,
  JOIN_ROOM_SUCCESS,
  MESSAGES_HISTORY_APPEND,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  MESSAGES_RECEIVE
} from '../../../sdk/ElixirChatEventTypes';

const MESSAGE_CHUNK_SIZE = 20;

type HistoryUpdateParams = {
  chunk: any[];
  prepend?: boolean;
  append?: boolean;
};

const { locale } = useI18n();

const elixirChatWidget = useElixirChatWidget();

const processedMessages = ref<any[]>([]);
const isLoading = ref(false);
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef');

function updateMessageHistory(params: HistoryUpdateParams, callback?: () => void) {
  const { chunk, prepend, append } = params;
  const normalizedChunk = Array.isArray(chunk) ? chunk : [];

  if (append) {
    processedMessages.value = _uniqBy(
      [...processedMessages.value, ...normalizedChunk],
      'id'
    ) as any[];
  } else if (prepend) {
    processedMessages.value = _uniqBy(
      [...normalizedChunk, ...processedMessages.value],
      'id'
    ) as any[];
  } else {
    processedMessages.value = _uniqBy(normalizedChunk, 'id') as any[];
  }

  callback?.();
}

function onMessageReceive(message: any) {
  updateMessageHistory({ chunk: [message], append: true });
}

function onMessageHistoryChange(chunk: any[]) {
  updateMessageHistory({ chunk });
}

function onMessageHistoryPrepend(chunk: any[]) {
  updateMessageHistory({ chunk, prepend: true });
}

function onMessageHistoryAppend(chunk: any[]) {
  updateMessageHistory({ chunk, append: true });
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
