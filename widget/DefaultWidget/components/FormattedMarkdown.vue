<script setup lang="ts">
import { computed } from 'vue';
import { formatMarkdown } from '../utils/formatMarkdown';

const props = defineProps<{
  className?: string;
  markdown?: string;
}>();

const html = computed(() => formatMarkdown(props.markdown || ''));
</script>

<template>
  <span
    class="elixirchat-formatted-markdown"
    :class="[props.className]"
    v-bind="$attrs"
    v-html="html"
  />
</template>
