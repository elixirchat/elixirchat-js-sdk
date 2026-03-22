<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ONLINE_STATUS_CHANGE } from '../../../sdk/ElixirChatEventTypes';
import {
  WIDGET_DATA_SET,
  WIDGET_MUTE_TOGGLE,
  WIDGET_SEARCH_TOGGLE
} from '../../ElixirChatWidgetEventTypes';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import ChatMessages from './ChatMessages.vue';
import Tooltip from './tooltip/tooltip.vue';

const elixirChatWidget = useElixirChatWidget();
const { t } = useI18n();

const widgetTitle = ref('');
const widgetIsMuted = ref(false);
const widgetIsSearchOpen = ref(false);
const onlineStatus = ref<{
  isOnline: boolean;
  workHoursStartAt: string | null;
}>({
  isOnline: false,
  workHoursStartAt: null
});

const muteTooltipMessage = ref('');

function updateMuteTooltip() {
  muteTooltipMessage.value = widgetIsMuted.value ? t('unmute') : t('mute');
}

function onWidgetDataSet() {
  widgetTitle.value = elixirChatWidget.widgetTitle;
  widgetIsMuted.value = elixirChatWidget.widgetIsMuted;
  widgetIsSearchOpen.value = elixirChatWidget.widgetIsSearchOpen;
  onlineStatus.value = (elixirChatWidget as any).onlineStatus ?? {
    isOnline: false,
    workHoursStartAt: null
  };
  updateMuteTooltip();
}

function onMuteToggle(isMuted: boolean) {
  widgetIsMuted.value = isMuted;
  updateMuteTooltip();
}

function onOnlineStatusChange(status: any) {
  onlineStatus.value = status;
}

function onSearchToggle(isOpen: boolean) {
  widgetIsSearchOpen.value = isOpen;
}

function onBackButtonClick() {
  elixirChatWidget.navigateTo('welcome-screen');
}

function onMuteClick() {
  elixirChatWidget.widgetIsMuted ? elixirChatWidget.unmute() : elixirChatWidget.mute();
}

function onCloseClick() {
  elixirChatWidget.closePopup();
}

const getMuteTooltipMessage = computed(() => {
  return widgetIsMuted.value ? t('unmute') : t('mute');
});

onMounted(() => {
  onWidgetDataSet();
  elixirChatWidget.on(WIDGET_DATA_SET, onWidgetDataSet);
  elixirChatWidget.on(ONLINE_STATUS_CHANGE, onOnlineStatusChange);
  elixirChatWidget.on(WIDGET_MUTE_TOGGLE, onMuteToggle);
  elixirChatWidget.on(WIDGET_SEARCH_TOGGLE, onSearchToggle);
});

onBeforeUnmount(() => {
  elixirChatWidget.off(WIDGET_DATA_SET, onWidgetDataSet);
  elixirChatWidget.off(ONLINE_STATUS_CHANGE, onOnlineStatusChange);
  elixirChatWidget.off(WIDGET_MUTE_TOGGLE, onMuteToggle);
  elixirChatWidget.off(WIDGET_SEARCH_TOGGLE, onSearchToggle);
});
</script>

<template>
  <div class="elixirchat-chat-container">
    <div class="elixirchat-chat-header">
      <div class="elixirchat-chat-header__column">
        <button
          type="button"
          class="elixirchat-chat-header__button"
          @click="onBackButtonClick"
        >
          <i class="icon-arrow-left" />
        </button>

        <i
          v-if="onlineStatus.isOnline "
          className="elixirchat-chat-header__indicator"
        />
        <span class="elixirchat-chat-header__title">{{ widgetTitle }}</span>
      </div>

      <div class="elixirchat-chat-header__column">
        <!-- TODO: добавить поиск -->

        <tooltip
          class-name="elixirchat-chat-header__mute-tooltip"
          :title="getMuteTooltipMessage"
        >
          <button
            type="button"
            class="elixirchat-chat-header__button"
            :class="[{ 'elixirchat-chat-header__mute--muted': widgetIsMuted }]"
            :title="muteTooltipMessage"
            @click="onMuteClick"
          >
            <i :class="widgetIsMuted ? 'icon-speaker-mute' : 'icon-speaker'" />
          </button>
        </tooltip>
        <button
          class="elixirchat-chat-header__button"
          @click="onCloseClick"
        >
          <i class="icon-close-thin" />
        </button>
      </div>
    </div>
    <chat-messages />
  </div>
</template>
