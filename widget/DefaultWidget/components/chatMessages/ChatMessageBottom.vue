<script setup lang="ts">
import type { IMessage } from '@sdk/serializers/serializeMessage';
import dayjs from 'dayjs';
import SubmissionErrorMessage from './SubmissionErrorMessage.vue';
import RatingButton from './RatingButton.vue';

type ChatMessageBottomMessage = Pick<IMessage,
  'id'
  | 'timestamp'
  | 'isSystem'
  | 'submissionErrorCode'
  | 'rating'> & {
    sender: Pick<IMessage['sender'], 'isOperator' | 'isCurrentClient'>;
  };

const props = defineProps<{
  message: ChatMessageBottomMessage;
  replyText: string;
  isMessageLocked: boolean;
}>();

const emit = defineEmits<{
  retry: [message: ChatMessageBottomMessage];
  reply: [messageId: string];
  rate: [messageId: string, rating: 'POSITIVE' | 'NEGATIVE'];
}>();

function onRetry(message: ChatMessageBottomMessage) {
  emit('retry', message);
}

function onReplyClick() {
  emit('reply', props.message.id);
}

function onRate(messageId: string, rating: 'POSITIVE' | 'NEGATIVE') {
  emit('rate', messageId, rating);
}
</script>

<template>
  <div class="elixirchat-chat-messages__bottom">
    <submission-error-message
      v-if="message.submissionErrorCode"
      :message="message"
      @retry="onRetry"
    />
    <template v-else>
      <span
        class="elixirchat-chat-messages__reply-button"
        @click="onReplyClick"
      >
        {{ replyText }}
      </span>
      <template v-if="message.sender.isOperator && !message.isSystem">
        <div class="elixirchat-chat-messages__rating">
          <rating-button
            type="POSITIVE"
            :message-id="message.id"
            :rating="message?.rating?.rating"
            :is-locked="isMessageLocked"
            @rate="onRate"
          />
          <rating-button
            type="NEGATIVE"
            :message-id="message.id"
            :rating="message?.rating?.rating"
            :is-locked="isMessageLocked"
            @rate="onRate"
          />
        </div>
      </template>
      <span v-if="message.sender.isCurrentClient">
        {{ dayjs(message.timestamp).format('H:mm') }}
      </span>
    </template>
  </div>
</template>
