<script setup lang="ts">
import { ref, computed } from 'vue';

const { src = undefined, className = 'elixirchat-chat-avatar' } = defineProps<{
  src?: string;
  className?: string;
}>();

const hasError = ref(false);
const showImage = computed(() => !!src && !hasError.value);
</script>

<template>
  <img
    v-if="showImage"
    :class="className"
    :src="src"
    alt="Avatar"
    @error="hasError = true"
  >
  <div
    v-else
    class="elixirchat-chat-avatar__system"
    :class="[className]"
  />
</template>
