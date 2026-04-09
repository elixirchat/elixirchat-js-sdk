<script setup lang="ts">
import { ref, watch, useAttrs, onBeforeUnmount, useTemplateRef } from 'vue';
import { useElixirChatWidget } from '@defaultWidget/composables/useElixirChatWidget';

const elixirChatWidget = useElixirChatWidget();
const iframeRef = useTemplateRef<HTMLIFrameElement>('iframeRef');
const iframeContentContainer = ref<HTMLElement | null>(null);
const attrs = useAttrs();

const setupIframeContainer = (iframe: HTMLIFrameElement) => {
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    return;
  }

  const container = doc.createElement('main');
  container.className = 'elixirchat-widget-main';
  doc.body.appendChild(container);
  iframeContentContainer.value = container;

  elixirChatWidget.setIFrameDocument(doc);
};

watch(
  () => iframeRef.value,
  (iframe) => {
    if (!iframe) {
      return;
    }

    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframeContainer(iframe);
    } else {
      iframe.addEventListener('load', () => setupIframeContainer(iframe), { once: true });
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  iframeContentContainer.value = null;
});
</script>

<template>
  <iframe
    id="elixirchat-widget-iframe"
    ref="iframeRef"
    :class="attrs.class"
  />
  <Teleport
    v-if="iframeContentContainer"
    :to="iframeContentContainer"
  >
    <slot />
  </Teleport>
</template>
