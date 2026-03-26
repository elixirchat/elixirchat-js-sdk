<script setup lang="ts">
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { getOperatorName, getUserFullName } from '../../../../utilsCommon';
import { generateReplyMessageQuote } from '../../../../utilsWidgetVue';
import Avatar from '../Avatar.vue';
import FormattedMarkdown from '../FormattedMarkdown.vue';
import ChatMessageFiles from './ChatMessageFiles.vue';
import ChatMessagePreviews from './ChatMessagePreviews.vue';
import ChatMessageBottom from './ChatMessageBottom.vue';

const props = defineProps<{
  message: any;
  elixirChatWidget: any;
  replyText: string;
  isMessageLocked: boolean;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  'preview-click': [event: Event, preview: any, sender: any];
  reply: [messageId: string];
  'reply-original-click': [messageId: string];
  'message-ref': [messageId: string, isUnread: boolean, el: HTMLElement | null];
  rate: [messageId: string, rating: 'POSITIVE' | 'NEGATIVE'];
  retry: [message: any];
}>();

const { t } = useI18n();

function processedAvatar(message: any): string {
  return message.sender.avatar.url || '';
}

function getMentionsStr(message: any) {
  return message.mentions.map((mention) => {
    return mention.value === 'ALL'
      ? t('everyone')
      : getUserFullName(mention.client, ' ');
  }).join(', ');
}

function onPreviewClick(event: Event, preview: any, sender: any) {
  emit('preview-click', event, preview, sender);
}

function onReply(messageId: string) {
  emit('reply', messageId);
}

function onRate(messageId: string, rating: 'POSITIVE' | 'NEGATIVE') {
  emit('rate', messageId, rating);
}

function onRetry(message: any) {
  emit('retry', message);
}

function onRootRef(el: HTMLElement | null) {
  emit('message-ref', String(props.message.id), Boolean(props.message.isUnread), el);
}
</script>

<template>
  <div
    :id="String(message.id)"
    :ref="onRootRef"
    class="elixirchat-chat-messages__item"
    :class="{
      'elixirchat-chat-messages__item--by-me': message.sender?.isCurrentClient,
      'elixirchat-chat-messages__item--by-operator': message.sender?.isOperator,
      'elixirchat-chat-messages__item--by-client': message.sender?.isClient,
      'elixirchat-chat-messages__item--by-another-client': !message.sender.isOperator && !message.sender.isCurrentClient,
      'elixirchat-chat-messages__item--unread': message.isUnread,
      'elixirchat-chat-messages__item--selected': Boolean(isSelected)
    }"
  >
    <div class="elixirchat-chat-messages__inner">
      <div
        v-if="!message.hasPreviewsOnly"
        class="elixirchat-chat-messages__balloon"
        @dblclick="onReply(String(message.id))"
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
          <div
            class="elixirchat-chat-messages__reply-message"
            role="button"
            tabindex="0"
            @click="emit('reply-original-click', String(message.responseToMessage.id))"
          >
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

      <chat-message-bottom
        :message="message"
        :reply-text="replyText"
        :is-message-locked="isMessageLocked"
        @reply="onReply"
        @rate="onRate"
        @retry="onRetry"
      />
    </div>
  </div>
</template>
