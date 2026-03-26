<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  currentlyTypingUsersCount?: number;
}>();

const { t } = useI18n();

const message = computed(() => props.currentlyTypingUsersCount ? t('typing', props.currentlyTypingUsersCount) : '');
</script>

<template>
  <div
    class="elixirchat-chat-typing"
    :class="{
      'elixirchat-chat-typing--visible': Boolean(currentlyTypingUsersCount)
    }"
  >
    <i class="elixirchat-chat-typing__icon icon-typing" />
    {{ message }}
  </div>
</template>
