<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, computed } from 'vue';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { _flatten, _uniqBy, getMediaType, randomDigitStringId, getUserFullName, getOperatorName } from '../../../utilsCommon';
import {
  ERROR_ALERT,
  JOIN_ROOM_SUCCESS,
  MESSAGES_HISTORY_APPEND,
  MESSAGES_HISTORY_CHANGE,
  MESSAGES_HISTORY_PREPEND,
  MESSAGES_RECEIVE
} from '../../../sdk/ElixirChatEventTypes';
import { fitDimensionsIntoLimits, isMobile, generateReplyMessageQuote, humanizeUpcomingDate } from '../../../utilsWidgetVue';
import { serializeMessage } from '../../../sdk/serializers/serializeMessage';
import Avatar from './avatar.vue';
import FormattedMarkdown from './FormattedMarkdown.vue';
import { getScreenshotCompatibilityFallback } from '../../../sdk/ScreenshotTaker';

const MESSAGE_CHUNK_SIZE = 20;
const MAX_THUMBNAIL_SIZE = isMobile() ? 208 : 256;

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
const isLoading = ref(false);
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef');
const screenshotFallback = ref<{
  pressKey?: string | null;
  pressKeySecondary?: string;
} | null>(null);

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

function renderKeyShortcut(keySequence: string | null | undefined): string | undefined {
  if (!keySequence) {
    return undefined;
  }
  return keySequence.split(/\+/).map((key, index) => {
    return index ? `+<kbd>${key}</kbd>` : `<kbd>${key}</kbd>`;
  }).join('');
}

function getScreenshotShortcutMessage(): string {
  const fallback = screenshotFallback.value;
  const pressKey = fallback?.pressKey;
  if (!pressKey) {
    return t('please_send_screenshot');
  }
  const pressKeySecondary = (fallback as any)?.pressKeySecondary;
  return t('please_send_screenshot_with_shortcut', {
    hasSecondaryKey: Boolean(pressKeySecondary),
    primaryKey: renderKeyShortcut(pressKey),
    secondaryKey: renderKeyShortcut(pressKeySecondary)
  });
}

function onTakeScreenshotClick() {
  elixirChatWidget.closePopup();
  elixirChatWidget.takeScreenshot();
}

function humanizedWorkHoursStartAt(message: any): string {
  const workHoursStartAt = message.systemData?.workHoursStartAt;
  if (!workHoursStartAt) {
    return '';
  }
  return humanizeUpcomingDate(workHoursStartAt, {
    locale: locale.value,
    t
  });
}

function getSpecialistsOfflineMessage(message: any): string {
  const hasDatetime = Boolean(message.systemData?.workHoursStartAt);
  if (!hasDatetime) {
    return t('specialists_are_offline_short');
  }
  return t('specialists_are_offline_with_datetime', {
    datetime: humanizedWorkHoursStartAt(message)
  });
}

function getHelloMessage(): string {
  const client = elixirChatWidget.client;
  const isConfident = Boolean(client?.isConfidentAboutFirstName);
  const name = client?.firstName;
  if (!isConfident || !name) {
    return t('hello_short');
  }
  return t('hello_with_name', { name });
}

onMounted(() => {
  dayjs.extend(dayjsCalendar);
  dayjs.locale(locale.value);

  elixirChatWidget.on(JOIN_ROOM_SUCCESS, loadInitialMessages);
  elixirChatWidget.on(MESSAGES_RECEIVE, onMessageReceive);
  elixirChatWidget.on(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
  elixirChatWidget.on(MESSAGES_HISTORY_PREPEND, onMessageHistoryPrepend);
  elixirChatWidget.on(MESSAGES_HISTORY_APPEND, onMessageHistoryAppend);

  screenshotFallback.value = getScreenshotCompatibilityFallback();
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
    <!-- MessageSearch -->
    <div
      ref="scrollContainerRef"
      class="elixirchat-chat-scroll"
    >
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
              </div>
            </div>
          </div>

          <!-- Системные сообщения -->
          <div
            v-if="message.isSystem"
            class="elixirchat-chat-messages__item elixirchat-chat-messages__item--by-operator elixirchat-chat-messages__item--system"
            :class="{
              'elixirchat-chat-messages__item--unread': message.isUnread
            }"
          >
            <div class="elixirchat-chat-messages__inner">
              <div class="elixirchat-chat-messages__balloon">
                <div class="elixirchat-chat-messages__sender">
                  <div>
                    <avatar :src="processedAvatar(message)" />
                  </div>
                  <b>{{ getUserFullName(message.sender) || getOperatorName(message.sender, elixirChatWidget.widgetCustomEmployerName, elixirChatWidget.widgetTitle) }}</b>
                </div>

                <div
                  v-if="message.systemData.type === 'ScreenshotRequestedMessage'"
                >
                  <div
                    class="elixirchat-chat-messages__text"
                    v-html="getScreenshotShortcutMessage()"
                  />
                  <button
                    v-if="!screenshotFallback"
                    class="elixirchat-chat-messages__take-screenshot"
                    @click="onTakeScreenshotClick"
                  >
                    {{ t('take_a_screenshot') }}
                  </button>
                </div>

                <div
                  v-if="message.systemData?.type === 'NobodyWorkingMessage'"
                  class="elixirchat-chat-messages__text"
                >
                  {{ getSpecialistsOfflineMessage(message) }}
                </div>

                <div v-if="message.systemData.type === 'HighLoadMessage'">
                  <div class="elixirchat-chat-messages__text">
                    {{ t('waiting_takes_longer') }}
                  </div>
                </div>

                <div
                  v-if="message.systemData?.type === 'NewClientPlaceholderMessage'"
                  class="elixirchat-chat-messages__text"
                >
                  {{ getHelloMessage() }}
                </div>
              </div>

              <div className="elixirchat-chat-messages__bottom">
                {{ dayjs(message.timestamp).format('H:mm') }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
