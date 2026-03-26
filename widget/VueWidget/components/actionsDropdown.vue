<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const { screenshotAvailable = true } = defineProps<{
  screenshotAvailable?: boolean;
}>();
const emit = defineEmits<{
  attachFile: [];
  takeScreenshoot: [];
}>();
const container = useTemplateRef<HTMLDivElement>('container');
const open = ref(false);

const { t } = useI18n();

const toggleOpen = () => open.value = !open.value;

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  if (!next || !container.value?.contains(next)) {
    open.value = false;
  }
}

function handleScreenshotClick() {
  toggleOpen();
  emit('takeScreenshoot');
}

function handleAttachFileClick() {
  toggleOpen();
  emit('attachFile');
}
</script>

<template>
  <div
    ref="container"
    class="elixirchat-chat-textarea__actions elixirchat-chat-textarea__actions-dropdown-wrap"
    tabindex="-1"
    @focusout="onFocusOut"
  >
    <span class="elixirchat-chat-textarea__actions-button elixirchat-chat-textarea__actions-dropdown-trigger">

      <button
        type="button"
        class="elixirchat-chat-textarea__actions-dropdown-btn"
        @click="toggleOpen"
      >
        <i class="icon-file" />
      </button>

      <div
        v-if="open"
        class="elixirchat-chat-textarea__actions-dropdown-menu"
      >
        <button
          type="button"
          class="elixirchat-chat-textarea__actions-dropdown-item"
          @click="handleAttachFileClick"
        >
          <i class="icon-download" />
          <span>{{ t('attach_files') }}</span>
        </button>
        <button
          v-if="screenshotAvailable"
          type="button"
          class="elixirchat-chat-textarea__actions-dropdown-item"
          @click="handleScreenshotClick"
        >
          <i class="icon-screenshot" />
          <span> {{ t('take_a_screenshot') }}</span>
        </button>
      </div>
    </span>
  </div>
</template>
