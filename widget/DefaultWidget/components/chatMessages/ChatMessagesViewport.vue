<script setup lang="ts">
defineProps<{
  isLoading: boolean;
  isLoadingPrecedingMessageHistory: boolean;
}>();
</script>

<template>
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
    <slot />
  </div>
</template>
