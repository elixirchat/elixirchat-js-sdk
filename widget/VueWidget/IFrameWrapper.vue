<script setup lang="ts">
import { createApp, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import type { ElixirChatWidget } from '../ElixirChatWidget';

const props = defineProps<{
  elixirChatWidget: ElixirChatWidget;
  className?: string;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
let iframeContentContainer: HTMLElement | null = null;
let innerApp: ReturnType<typeof createApp> | null = null;

const slots = useSlots();

const onIframeReady = (iframeElement: HTMLIFrameElement): Promise<Document> => {
  return new Promise((resolve) => {
    let iframe = iframeElement;
    let iframeDocument = iframe.contentWindow?.document;

    if (iframeDocument && iframeDocument.readyState === 'complete') {
      resolve(iframeDocument);
    } else {
      iframe.addEventListener('load', (e: Event) => {
        const target = e.target as HTMLIFrameElement;
        iframe = target;
        iframeDocument = iframe.contentWindow?.document || document;
        resolve(iframeDocument);
      });
    }
  });
};

onMounted(async () => {
  if (!iframeRef.value) return;

  const iframeDocument = await onIframeReady(iframeRef.value);

  iframeContentContainer = iframeDocument.createElement('main');
  iframeContentContainer.className = 'elixirchat-widget-main';
  iframeDocument.body.appendChild(iframeContentContainer);

  props.elixirChatWidget.setIFrameDocument(iframeDocument);

  innerApp = createApp({
    setup() {
      return () => (slots.default ? slots.default() : null);
    },
  });

  innerApp.mount(iframeContentContainer);
});

onBeforeUnmount(() => {
  if (innerApp) {
    innerApp.unmount();
    innerApp = null;
  }
  iframeContentContainer = null;
});
defineExpose({});
</script>

<template>
  <iframe
    id="elixirchat-widget-iframe"
    :class="className"
    ref="iframeRef"
  />
</template>

