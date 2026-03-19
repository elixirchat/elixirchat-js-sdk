<script setup lang="ts">
import type { IOnlineStatusParams } from '../../../../sdk/OnlineStatusSubscription';
import type { IJoinRoomChannel } from '../../../../sdk/ElixirChat';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../../composables/useElixirChatWidget';
import { WIDGET_DATA_SET, WIDGET_MUTE_TOGGLE } from '../../../ElixirChatWidgetEventTypes';
import {
  getAvatarColorByUserId
} from '../../../../utilsWidget';
import { _last } from '../../../../utilsCommon';
import Tooltip from '../tooltip/tooltip.vue';

const { t } = useI18n();

const elixirChatWidget = useElixirChatWidget();
const widgetIsMuted = ref(false);
const widgetTitle = ref('');
const widgetLogo = ref<string | null>(null);
const onlineStatus = ref<IOnlineStatusParams>({
  isOnline: false,
  workHoursStartAt: null
});
const employeeAvatars = ref<Array<{
  url: string;
  initials: string;
}>>([]);
const employeesCount = ref(0);
const widgetChannels = ref<Array<IJoinRoomChannel>>([]);

const logoBackground = computed(() =>
  widgetLogo.value ? { backgroundImage: `url(${widgetLogo.value})` } : {}
);
const operatorsCounter = computed(() => employeesCount.value - employeeAvatars.value.length);

function syncFromWidget() {
  widgetTitle.value = elixirChatWidget.widgetTitle;
  widgetLogo.value = elixirChatWidget.widgetLogo;
  onlineStatus.value = elixirChatWidget.onlineStatus;
  widgetChannels.value = elixirChatWidget.widgetChannels;
  widgetIsMuted.value = elixirChatWidget.widgetIsMuted;

  const { employees = [], employeesCount: total = 0 } = elixirChatWidget.joinRoomData || {};

  const { employeeAvatars: avatars, employeesCount: normalizedTotal }
    = generateEmployeeList({
      employeesCount: total,
      employees
    });
  employeeAvatars.value = avatars;
  employeesCount.value = normalizedTotal;
};

function generateEmployeeList({ employeesCount, employees }) {
  const displayLimit = Math.min(5, employeesCount);
  const employeeAvatars = employees
    .map(generateEmployeeAvatar)
    .sort((a, b) => {
      return a.url > b.url ? -1 : 1;
    })
    .slice(0, displayLimit);

  return {
    employeeAvatars,
    employeesCount
  };
};

function generateEmployeeAvatar(employee) {
  let url = employee.avatar?.url;
  let color = getAvatarColorByUserId(employee?.id);
  let initials = (employee?.firstName || '').toString().replace(/[^a-zа-я]/gi, '')[0]?.toUpperCase();

  if (!initials) {
    const idLetterDict = 'АВЕКМНОРСТ';
    const idLetterIndex = +_last((employee?.id || '').toString().replace(/\D+/g, ''));
    const normalizedIndex = idLetterIndex > -1 ? idLetterIndex : Math.round(Math.random() * (idLetterDict.length - 1));
    initials = idLetterDict[normalizedIndex];
  }
  return {
    url,
    color,
    initials,
    employee
  };
};

function onMuteToggle(next: boolean) {
  widgetIsMuted.value = next;
}

const mutedButtonIcon = computed(() => widgetIsMuted.value ? 'icon-speaker-mute' : 'icon-speaker');

function muteButtonHandleClick() {
  return widgetIsMuted.value ? elixirChatWidget.unmute() : elixirChatWidget.mute();
}

const muteTooltipTitle = computed(() => widgetIsMuted.value ? t('unmute') : t('mute'));

onMounted(() => {
  syncFromWidget();
  elixirChatWidget.on(WIDGET_MUTE_TOGGLE, onMuteToggle);
  elixirChatWidget.on(WIDGET_DATA_SET, syncFromWidget);
});

onBeforeUnmount(() => {
  elixirChatWidget.off(WIDGET_DATA_SET, syncFromWidget);
  elixirChatWidget.off(WIDGET_MUTE_TOGGLE, onMuteToggle);
});
</script>

<template>
  <div class="elixirchat-welcome-screen__container">
    <tooltip
      class-name="elixirchat-welcome-screen__mute-tooltip"
      :title="muteTooltipTitle"
    >
      <button
        class="elixirchat-welcome-screen__mute"
        @click="muteButtonHandleClick"
      >
        <i :class="mutedButtonIcon" />
      </button>
    </tooltip>

    <button
      class="elixirchat-welcome-screen__close"
      @click="elixirChatWidget.closePopup()"
    >
      <i class="icon-close-thin" />
    </button>

    <div
      class="elixirchat-welcome-screen__logo"
      :class="{
        'elixirchat-welcome-screen__logo--default': !widgetLogo
      }"
      :style="logoBackground"
    >
      <i class="icon-logo" />
    </div>

    <h1 class="elixirchat-welcome-screen__title">
      {{ widgetTitle }}
    </h1>

    <div
      v-if="onlineStatus.isOnline"
      class="elixirchat-welcome-screen__status"
    >
      <i class="elixirchat-welcome-screen__status-online" />
      {{ t('online') }}
    </div>

    <ul
      v-if="employeeAvatars.length"
      class="elixirchat-welcome-screen__operators"
    >
      <li
        v-for="(avatar, i) in employeeAvatars"
        :key="i"
        :style="avatar.url
          ? { backgroundImage: `url(${avatar.url})` }
          : { backgroundColor: avatar.color }"
        class="elixirchat-welcome-screen__operators-item"
        :class="{
          'elixirchat-welcome-screen__operators-item--avatar': !!avatar.url
        }"
      >
        <template v-if="!avatar.url">
          {{ avatar.initials }}
        </template>
      </li>
      <li
        v-if="employeesCount > employeeAvatars.length"
        class="elixirchat-welcome-screen__operators-item elixirchat-welcome-screen__operators-item--counter"
      >
        +{{ operatorsCounter }}
      </li>
    </ul>

    <button
      class="elixirchat-welcome-screen__chat-button"
      @click="elixirChatWidget.navigateTo('chat')"
    >
      {{ t('message_us') }}
    </button>

    <div
      v-if="widgetChannels.length"
      class="elixirchat-welcome-screen__channels"
    >
      <div class="elixirchat-welcome-screen__channels-title">
        {{ t('other_support_channels') }}
      </div>
      <ul class="elixirchat-welcome-screen__channels-list">
        <li
          v-for="(channel, i) in widgetChannels"
          :key="i"
          class="elixirchat-welcome-screen__channels-item"
          :class="{
            [`elixirchat-welcome-screen__channels-item--${channel.type}`]: true
          }"
        >
          <a
            class="elixirchat-welcome-screen__channels-link"
            :class="{
              [`svg-icon-${channel.type}`]: true
            }"
            :href="channel.url || '#'"
            target="_blank"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
