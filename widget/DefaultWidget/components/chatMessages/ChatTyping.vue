<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import animationData from '@defaultWidget/assets/tyyping-indicator.json';
import { Vue3Lottie } from 'vue3-lottie';

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
    <div class="elixirchat-chat-typing__animation-wrapper">
      <vue3-lottie
        :animation-data="animationData"
        :loop="true"
        :height="12"
        :width="12"
        class="elixirchat-chat-typing__icon"
      />
      <span>{{ message }}</span>
    </div>
  </div>
</template>
