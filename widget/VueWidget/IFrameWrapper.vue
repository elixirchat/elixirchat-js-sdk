<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type { ElixirChatWidget } from '../ElixirChatWidget';

const props = defineProps<{
  elixirChatWidget: ElixirChatWidget;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const iframeContentContainer = ref<HTMLElement | null>(null);
const attrs = useAttrs();

const onIframeReady = (iframeElement: HTMLIFrameElement): Promise<Document> => {
  return new Promise((resolve) => {
    let iframeDocument = iframeElement.contentWindow?.document;

    if (iframeDocument && iframeDocument.readyState === 'complete') {
      resolve(iframeDocument);
    } else {
      iframeElement.addEventListener('load', (e: Event) => {
        const target = e.target as HTMLIFrameElement;
        iframeDocument = target.contentWindow?.document || document;
        resolve(iframeDocument);
      }, { once: true });
    }
  });
};

onMounted(async () => {
  if (!iframeRef.value) return;

  const iframeDocument = await onIframeReady(iframeRef.value);

  const container = iframeDocument.createElement('main');
  container.className = 'elixirchat-widget-main';
  iframeDocument.body.appendChild(container);
  iframeContentContainer.value = container;

  props.elixirChatWidget.setIFrameDocument(iframeDocument);
});

onBeforeUnmount(() => {
  if (iframeContentContainer.value?.parentNode) {
    iframeContentContainer.value.parentNode.removeChild(iframeContentContainer.value);
  }
  iframeContentContainer.value = null;
});
</script>

<template>
  <iframe
    id="elixirchat-widget-iframe"
    :class="attrs.class"
    ref="iframeRef"
  />
  <Teleport
    v-if="iframeContentContainer"
    :to="iframeContentContainer"
  >
    <slot />
  </Teleport>
</template>

