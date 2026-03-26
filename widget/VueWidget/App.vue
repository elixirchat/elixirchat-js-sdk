<script setup lang="ts">
import type { ElixirChatWidget } from '../ElixirChatWidget';
import { nextTick, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { FontExtractor, generateFontFaceCSS } from '../FontExtractor';
import { WidgetAssets } from '../WidgetAssets';
import { detectBrowser } from '../../utilsCommon';
import {
  UNREAD_COUNTER_MESSAGES_CHANGE,
  UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES
} from '../../sdk/ElixirChatEventTypes';
import {
  WIDGET_DATA_SET,
  WIDGET_IFRAME_READY,
  WIDGET_NAVIGATE_TO,
  WIDGET_POPUP_TOGGLE
} from '../ElixirChatWidgetEventTypes';
import IFrameWrapper from './IFrameWrapper.vue';
import { provideElixirChatWidget } from './composables/useElixirChatWidget';
import WelcomeScreen from './components/WelcomeScreen.vue';
import Chat from './components/Chat.vue';
import FullScreenPreview from './components/FullScreenPreview.vue';
import Alert from './components/Alert.vue';

const props = defineProps<{
  elixirChatWidget: ElixirChatWidget;
}>();

const widgetIsButtonHidden = ref(true);
const widgetIsPopupOpen = ref(false);
const widgetIsPopupOpeningAnimation = ref(false);
const widgetView = ref<string>('');
const widgetViewAnimation = ref<string | null>(null);
const unreadMessagesCount = ref(0);
const outsideIframeStyles = ref('');
const insideIframeStyles = ref('');
const detectedBrowser = ref<string | null>(null);

const outsideStyleElement = ref<HTMLStyleElement | null>(null);

let widgetAssets: WidgetAssets | null = null;
let fontExtractor: FontExtractor | null = null;

const visibleUnreadMessagesCount = computed(() => {
  return unreadMessagesCount.value > 99
    ? '99+'
    : unreadMessagesCount.value;
});

const iframeClassName = computed(() => ({
  'elixirchat-widget-iframe': true,
  'elixirchat-widget-iframe--visible': widgetIsPopupOpen.value,
  'elixirchat-widget-iframe--opening': widgetIsPopupOpeningAnimation.value
}));

const viewClassName = computed(() => ({
  'elixirchat-widget-view': true,
  'elixirchat-widget-view--animating-slide-left': widgetViewAnimation.value === 'slide-left',
  'elixirchat-widget-view--animating-slide-right': widgetViewAnimation.value === 'slide-right',
  [`elixirchat-browser--${detectedBrowser.value}`]: true
}));

provideElixirChatWidget(props.elixirChatWidget);

const appendToStyles = (params: {
  outsideIframeStyles?: string;
  insideIframeStyles?: string;
}) => {
  if (typeof params.outsideIframeStyles === 'string') {
    outsideIframeStyles.value = `${outsideIframeStyles.value}\n\n${params.outsideIframeStyles}`;
  }
  if (typeof params.insideIframeStyles === 'string') {
    insideIframeStyles.value = `${insideIframeStyles.value}\n\n${params.insideIframeStyles}`;
  }
};

const applyOutsideStylesToDocument = () => {
  if (!outsideStyleElement.value) {
    const styleEl = document.createElement('style');
    styleEl.id = 'elixirchat-widget-outside-styles';
    document.head.appendChild(styleEl);
    outsideStyleElement.value = styleEl;
  }
  if (outsideStyleElement.value) {
    outsideStyleElement.value.innerHTML = outsideIframeStyles.value;
  }
};

const applyInsideStylesToIframe = () => {
  const iframeDoc = props.elixirChatWidget.widgetIFrameDocument as Document | undefined;
  if (!iframeDoc || !iframeDoc.head) {
    return;
  }

  let styleEl = iframeDoc.getElementById('elixirchat-widget-inside-styles') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = iframeDoc.createElement('style');
    styleEl.id = 'elixirchat-widget-inside-styles';
    iframeDoc.head.appendChild(styleEl);
  }

  const iframeCSS = props.elixirChatWidget.widgetConfig.iframeCSS || '';
  styleEl.innerHTML = `${insideIframeStyles.value}\n\n${iframeCSS}`;
};

const onIframeReady = () => {
  applyInsideStylesToIframe();
};

const onWidgetDataSet = () => {
  const { elixirChatWidget } = props;
  widgetIsButtonHidden.value = elixirChatWidget.widgetIsButtonHidden;
  widgetIsPopupOpen.value = elixirChatWidget.widgetIsPopupOpen;
  widgetView.value = elixirChatWidget.widgetView;
};

const onUnreadCounterChange = (count: number) => {
  unreadMessagesCount.value = count;
};

const onViewChange = (nextView: string) => {
  const animation = nextView === 'welcome-screen' ? 'slide-right' : 'slide-left';
  widgetViewAnimation.value = animation;
  window.setTimeout(() => {
    widgetView.value = nextView;
    widgetViewAnimation.value = null;
  }, 250);
};

const onPopupToggle = (isOpen: boolean) => {
  widgetIsPopupOpen.value = isOpen;
  widgetIsPopupOpeningAnimation.value = true;
  requestAnimationFrame(() => {
    widgetIsPopupOpeningAnimation.value = false;
  });
};

const unlockNotificationSoundAutoplay = (e: Event) => {
  if (!widgetAssets) {
    return;
  }

  const notification = new Audio(widgetAssets.assets.mp3.notificationSound);
  notification.volume = 0;
  notification.play().then(() => {
    notification.pause();
    notification.currentTime = 0;
  });

  const target = e.target as HTMLElement | null;
  const currentTarget = e.currentTarget as HTMLElement | null;
  if (target && currentTarget && target.tagName !== 'TEXTAREA') {
    currentTarget.removeEventListener(e.type, unlockNotificationSoundAutoplay as any);
  }
};

const playNotificationSound = () => {
  if (!widgetAssets) {
    return;
  }
  const { elixirChatWidget } = props;
  if (elixirChatWidget.widgetIsMuted) {
    return;
  }
  const notification = new Audio(widgetAssets.assets.mp3.notificationSound);
  try {
    notification.play();
  } catch {
    console.error(
      'Unable to play notification sound before any action was taken by the user in the current browser tab'
    );
  }
};

onMounted(() => {
  const { elixirChatWidget } = props;
  const widgetEvents = elixirChatWidget as any;

  widgetAssets = new WidgetAssets(elixirChatWidget);
  (elixirChatWidget as any).widgetAssets = widgetAssets;

  fontExtractor = new FontExtractor(elixirChatWidget.widgetConfig.fonts, window);
  fontExtractor.extract((fontRules) => {
    appendToStyles({
      insideIframeStyles: generateFontFaceCSS(fontRules)
    });
  });

  const { outsideIframeStyles: outsideCSS, insideIframeStyles: insideCSS } = widgetAssets;
  appendToStyles({
    outsideIframeStyles: outsideCSS,
    insideIframeStyles: insideCSS
  });

  applyOutsideStylesToDocument();
  applyInsideStylesToIframe();

  widgetEvents.on(WIDGET_DATA_SET, onWidgetDataSet);

  widgetEvents.on(UNREAD_COUNTER_MESSAGES_CHANGE, onUnreadCounterChange);
  widgetEvents.on(UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES, playNotificationSound);
  widgetEvents.on(WIDGET_IFRAME_READY, onIframeReady);
  widgetEvents.on(WIDGET_POPUP_TOGGLE, onPopupToggle);
  widgetEvents.on(WIDGET_NAVIGATE_TO, onViewChange);

  detectedBrowser.value = detectBrowser();
  document.body.addEventListener('click', unlockNotificationSoundAutoplay as any);

  watch(outsideIframeStyles, applyOutsideStylesToDocument);
  watch(insideIframeStyles, applyInsideStylesToIframe);
});

onBeforeUnmount(() => {
  const { elixirChatWidget } = props;
  const widgetEvents = elixirChatWidget as any;
  widgetEvents.off(WIDGET_DATA_SET, onWidgetDataSet);
  widgetEvents.off(WIDGET_IFRAME_READY, onIframeReady);
  widgetEvents.off(WIDGET_POPUP_TOGGLE, onPopupToggle);
  widgetEvents.off(WIDGET_NAVIGATE_TO, onViewChange);
  widgetEvents.off(UNREAD_COUNTER_MESSAGES_CHANGE, onUnreadCounterChange);
  widgetEvents.off(UNREAD_COUNTER_NOTIFY_ABOUT_NEW_REPLIES, playNotificationSound);
  document.body.removeEventListener('click', unlockNotificationSoundAutoplay as any);
});
</script>

<template>
  <div class="elixirchat-vue-widget">
    <button
      v-if="!widgetIsButtonHidden"
      class="elixirchat-widget-button"
      :class="{
        'elixirchat-widget-button--widget-open': widgetIsPopupOpen
      }"
      @click="() => props.elixirChatWidget.togglePopup()"
    >
      <i class="elixirchat-widget-icon icon-logo" />
      <i class="elixirchat-widget-icon icon-close-thin" />
      <span
        class="elixirchat-widget-button-counter"
        :class="{
          'elixirchat-widget-button-counter--has-unread': visibleUnreadMessagesCount
        }"
      >
        {{ visibleUnreadMessagesCount || '' }}
      </span>
    </button>

    <full-screen-preview />

    <i-frame-wrapper :class="iframeClassName">
      <div :class="viewClassName">
        <div v-if="widgetView === 'chat'">
          <chat />
        </div>
        <div v-if="widgetView === 'welcome-screen'">
          <welcome-screen />
        </div>
      </div>
      <alert />
    </i-frame-wrapper>
  </div>
</template>
