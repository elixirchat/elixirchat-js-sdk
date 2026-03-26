<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '@defaultWidget/composables/useElixirChatWidget';
import { getUserFullName, getOperatorName } from '@root/utilsCommon';
import { humanizeUpcomingDate } from '@root/utilsWidgetVue';
import Avatar from '../Avatar.vue';

const props = defineProps<{
  message: any;
  screenshotFallback?: {
    pressKey?: string | null;
    pressKeySecondary?: string;
  } | null;
}>();
const emit = defineEmits<{
  'message-ref': [messageId: string, isUnread: boolean, el: HTMLElement | null];
}>();

const { locale, t } = useI18n();
const elixirChatWidget = useElixirChatWidget();

function processedAvatar(message: any): string {
  return message.sender?.avatar?.url || '';
}

function senderName(): string {
  const { message } = props;
  return (
    getUserFullName(message.sender)
    || getOperatorName(
      message.sender,
      elixirChatWidget.widgetCustomEmployerName,
      elixirChatWidget.widgetTitle
    )
  );
}

function renderKeyShortcut(keySequence: string | null | undefined): string | undefined {
  if (!keySequence) {
    return undefined;
  }
  return keySequence
    .split(/\+/)
    .map((key, index) => (index ? `+<kbd>${key}</kbd>` : `<kbd>${key}</kbd>`))
    .join('');
}

function getScreenshotShortcutMessage(): string {
  const fallback = props.screenshotFallback ?? null;
  const pressKey = fallback?.pressKey;
  if (!pressKey) {
    return t('please_send_screenshot');
  }
  const pressKeySecondary = (fallback as any)?.pressKeySecondary;
  const hasSecondaryKey = Boolean(pressKeySecondary);
  if (hasSecondaryKey) {
    return t('please_send_screenshot_with_shortcut_both_keys', {
      primaryKey: renderKeyShortcut(pressKey),
      secondaryKey: renderKeyShortcut(pressKeySecondary)
    });
  }
  return t('please_send_screenshot_with_shortcut_primary_only', {
    primaryKey: renderKeyShortcut(pressKey)
  });
}

function getSpecialistsOfflineMessage(): string {
  const { message } = props;
  const hasDatetime = Boolean(message.systemData?.workHoursStartAt);
  if (!hasDatetime) {
    return t('specialists_are_offline_short');
  }
  const workHoursStartAt = message.systemData.workHoursStartAt;
  const datetime = humanizeUpcomingDate(workHoursStartAt, {
    locale: locale.value,
    t
  });
  return t('specialists_are_offline_with_datetime', { datetime });
}

const getHelloMessage = computed(() => {
  const client = elixirChatWidget.client;
  const isConfident = Boolean(client?.isConfidentAboutFirstName);
  const name = client?.firstName;
  if (!isConfident || !name) {
    return t('hello_short');
  }
  return t('hello_with_name', { name });
});

function onTakeScreenshotClick() {
  elixirChatWidget.closePopup();
  elixirChatWidget.takeScreenshot();
}

function onRootRef(el: HTMLElement | null) {
  emit('message-ref', String(props.message.id), Boolean(props.message.isUnread), el);
}
</script>

<template>
  <div
    :id="String(message.id)"
    :ref="onRootRef"
    class="elixirchat-chat-messages__item elixirchat-chat-messages__item--by-operator elixirchat-chat-messages__item--system"
    :class="{ 'elixirchat-chat-messages__item--unread': message.isUnread }"
  >
    <div class="elixirchat-chat-messages__inner">
      <div class="elixirchat-chat-messages__balloon">
        <div class="elixirchat-chat-messages__sender">
          <div>
            <avatar :src="processedAvatar(message)" />
          </div>
          <b>{{ senderName() }}</b>
        </div>

        <div v-if="message.systemData?.type === 'ScreenshotRequestedMessage'">
          <div
            class="elixirchat-chat-messages__text"
            v-html="getScreenshotShortcutMessage()"
          />
          <button
            v-if="!props.screenshotFallback?.pressKey"
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
          {{ getSpecialistsOfflineMessage() }}
        </div>

        <div
          v-if="message.systemData?.type === 'NewClientPlaceholderMessage'"
          class="elixirchat-chat-messages__text"
        >
          {{ getHelloMessage }}
        </div>
      </div>

      <div class="elixirchat-chat-messages__bottom">
        {{ dayjs(message.timestamp).format('H:mm') }}
      </div>
    </div>
  </div>
</template>
