<script setup lang="ts">
import { ref, computed } from 'vue';

const { src = undefined } = defineProps<{
  src?: string;
}>();

const hasError = ref(false);
const showImage = computed(() => !!src && !hasError.value);
</script>

<template>
  <img
    v-if="showImage"
    v-bind="$attrs"
    class="elixirchat-chat-avatar"
    :src="src"
    alt="Avatar"
    @error="hasError = true"
  >
  <div
    v-else
    v-bind="$attrs"
    class="elixirchat-chat-avatar__system elixirchat-chat-avatar"
  />
</template>
