<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  message: any;
}>();

const emit = defineEmits<{
  retry: [message: any];
}>();

const { t } = useI18n();

const code = computed(() => props.message?.submissionErrorCode);

const errorMap = computed<Record<number, {
  text: string;
  hasRetry: boolean;
}>>(() => ({
  415: {
    text: t('attachment_type_is_not_supported'),
    hasRetry: false
  },
  413: {
    text: t('file_size_limit'),
    hasRetry: false
  },
  503: {
    text: t('sending_has_failed_bad_connection'),
    hasRetry: true
  }
}));

const content = computed(() => {
  return (
    errorMap.value[code.value] || {
      text: t('sending_has_failed'),
      hasRetry: true
    }
  );
});

const onRetry = () => {
  emit('retry', props.message);
};
</script>

<template>
  <span class="elixirchat-chat-messages__submission-error">
    <span v-html="content.text" />
    <span
      v-if="content.hasRetry"
      class="elixirchat-chat-messages__submission-error-link"
      @click="onRetry"
    >
      {{ t('again') }}
    </span>
  </span>
</template>
