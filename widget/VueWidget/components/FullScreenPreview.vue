<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { fitDimensionsIntoLimits } from '../../../utilsWidgetVue';
import {
  WIDGET_FULLSCREEN_PREVIEW_CLOSE,
  WIDGET_FULLSCREEN_PREVIEW_OPEN,
  WIDGET_IFRAME_READY
} from '../../ElixirChatWidgetEventTypes';

type Preview = {
  id?: string;
  url?: string;
  name?: string;
  width?: number;
  height?: number;
  previewType?: 'image' | 'video' | string;
};

const elixirChatWidget = useElixirChatWidget();

const HORIZONTAL_PADDING = 100;
const VERTICAL_PADDING = 80;

const preview = ref<Preview>({});
const gallery = ref<Preview[]>([]);
const previewWidth = ref(0);
const previewHeight = ref(0);
const previewTopMargin = ref(0);
const isVisible = ref(false);
const isSlideAnimation = ref(false);

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');
const innerRef = useTemplateRef<HTMLElement>('innerRef');
const navRef = useTemplateRef<HTMLElement>('navRef');

let slideAnimationTimeout: ReturnType<typeof setTimeout> | null = null;

function calculatePreviewTopMargin(nextPreviewHeight: number) {
  const availableVerticalSpace = window.innerHeight - VERTICAL_PADDING;
  if (availableVerticalSpace < nextPreviewHeight) {
    return 0;
  }
  return (availableVerticalSpace - nextPreviewHeight) / 2;
}

function setImageDimensions(nextPreview: Preview) {
  const width = Number(nextPreview.width || 0);
  const height = Number(nextPreview.height || 0);
  const maxPreviewWidth = window.innerWidth - HORIZONTAL_PADDING;
  const [nextPreviewWidth, nextPreviewHeight] = fitDimensionsIntoLimits(width, height, maxPreviewWidth, null);
  previewWidth.value = nextPreviewWidth;
  previewHeight.value = nextPreviewHeight;
  previewTopMargin.value = calculatePreviewTopMargin(nextPreviewHeight);
}

function setVideoDimensions(nextPreview: Preview) {
  const width = Number(nextPreview.width || 0);
  const height = Number(nextPreview.height || 0);
  const maxPreviewWidth = window.innerWidth - HORIZONTAL_PADDING;
  const maxPreviewHeight = window.innerHeight - VERTICAL_PADDING;
  const [nextPreviewWidth, nextPreviewHeight] = fitDimensionsIntoLimits(width, height, maxPreviewWidth, maxPreviewHeight);
  previewWidth.value = nextPreviewWidth;
  previewHeight.value = nextPreviewHeight;
  previewTopMargin.value = calculatePreviewTopMargin(nextPreviewHeight);
  setTimeout(() => {
    videoRef.value?.focus();
  });
}

function updatePreviewDimensions(nextPreview: Preview) {
  if (nextPreview.previewType === 'image') {
    setImageDimensions(nextPreview);
  } else if (nextPreview.previewType === 'video') {
    setVideoDimensions(nextPreview);
  }
}

function animateSlide() {
  isSlideAnimation.value = true;
  if (slideAnimationTimeout != null) {
    clearTimeout(slideAnimationTimeout);
  }
  slideAnimationTimeout = setTimeout(() => {
    isSlideAnimation.value = false;
    slideAnimationTimeout = null;
  }, 200);
}

function navigateToFollowingPreview(delta: number) {
  if (!isVisible.value) {
    return;
  }
  const currentPreviewId = preview.value.id;
  const currentPreviewIndex = gallery.value.map((item) => item.id).indexOf(currentPreviewId);
  let nextPreviewIndex = currentPreviewIndex + delta;

  if (nextPreviewIndex < 0) {
    nextPreviewIndex = gallery.value.length - 1;
  } else if (nextPreviewIndex >= gallery.value.length) {
    nextPreviewIndex = 0;
  }

  const nextPreview = gallery.value[nextPreviewIndex];
  if (!nextPreview) {
    return;
  }

  preview.value = nextPreview;
  updatePreviewDimensions(nextPreview);
  animateSlide();
}

function closePreview() {
  elixirChatWidget.triggerEvent(WIDGET_FULLSCREEN_PREVIEW_CLOSE);
  isVisible.value = false;
}

function onKeyNavigation(event: KeyboardEvent) {
  const { key } = event;
  const isVideo = preview.value.previewType === 'video';

  if (key === 'Escape') {
    closePreview();
    return;
  }

  if (isVideo) {
    return;
  }

  if (key === 'ArrowLeft') {
    navigateToFollowingPreview(-1);
  }

  if (key === 'ArrowRight') {
    navigateToFollowingPreview(1);
  }
}

function onOpen(payload: {
  preview: Preview;
  gallery: Preview[];
  sender?: any;
}) {
  preview.value = payload.preview || {};
  gallery.value = Array.isArray(payload.gallery) ? payload.gallery : [];
  isVisible.value = true;
  updatePreviewDimensions(preview.value);
  animateSlide();
}

function onIframeReady() {
  elixirChatWidget.widgetIFrameDocument?.body?.addEventListener('keyup', onKeyNavigation);
}

const isImagePreview = computed(() => Boolean(preview.value.url && preview.value.previewType === 'image'));
const isVideoPreview = computed(() => Boolean(preview.value.url && preview.value.previewType === 'video'));

onClickOutside(innerRef, () => {
  if (isVisible.value) {
    closePreview();
  }
}, {
  ignore: [navRef]
});

onMounted(() => {
  elixirChatWidget.on(WIDGET_FULLSCREEN_PREVIEW_OPEN, onOpen);
  elixirChatWidget.on(WIDGET_IFRAME_READY, onIframeReady);
  document.body.addEventListener('keyup', onKeyNavigation);
});

onBeforeUnmount(() => {
  if (slideAnimationTimeout != null) {
    clearTimeout(slideAnimationTimeout);
    slideAnimationTimeout = null;
  }
  elixirChatWidget.off(WIDGET_FULLSCREEN_PREVIEW_OPEN, onOpen);
  elixirChatWidget.off(WIDGET_IFRAME_READY, onIframeReady);
  elixirChatWidget.widgetIFrameDocument?.body?.removeEventListener('keyup', onKeyNavigation);
  document.body.removeEventListener('keyup', onKeyNavigation);
});
</script>

<template>
  <div
    class="elixirchat-widget-full-screen-preview"
    :class="{ 'elixirchat-widget-full-screen-preview--visible': isVisible }"
  >
    <div ref="navRef">
      <span
        class="elixirchat-widget-full-screen-preview__nav elixirchat-widget-full-screen-preview__nav--prev"
        @click="navigateToFollowingPreview(-1)"
      >
        <i class="elixirchat-widget-full-screen-preview__nav-icon icon-chevron-down" />
      </span>
      <span
        class="elixirchat-widget-full-screen-preview__nav elixirchat-widget-full-screen-preview__nav--next"
        @click="navigateToFollowingPreview(1)"
      >
        <i class="elixirchat-widget-full-screen-preview__nav-icon icon-chevron-down" />
      </span>
    </div>

    <div
      ref="innerRef"
      class="elixirchat-widget-full-screen-preview__inner"
      :style="{ marginTop: `${previewTopMargin}px` }"
    >
      <img
        v-if="isImagePreview"
        class="elixirchat-widget-full-screen-preview__img"
        :class="{ 'elixirchat-widget-full-screen-preview__img--animated': isSlideAnimation }"
        :width="previewWidth"
        :height="previewHeight"
        :src="preview.url"
        :alt="preview.name"
        @click="closePreview"
      >
      <video
        v-if="isVideoPreview"
        ref="videoRef"
        class="elixirchat-widget-full-screen-preview__video"
        :class="{ 'elixirchat-widget-full-screen-preview__video--animated': isSlideAnimation }"
        controls
        autoplay
        :width="previewWidth"
        :height="previewHeight"
        :src="preview.url"
      />
    </div>
  </div>
</template>
