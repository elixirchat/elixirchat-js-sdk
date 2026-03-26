<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { MESSAGES_SEARCH_IDS } from '../../../sdk/ElixirChatEventTypes';
import { WIDGET_SEARCH_TOGGLE } from '../../ElixirChatWidgetEventTypes';

const props = defineProps<{
  messagesIds: string[];
}>();

const emit = defineEmits<{
  'change-text': [value: string];
  'scroll-message': [messageId: string, direction?: 'up' | 'down'];
}>();

const { locale, t } = useI18n();
const elixirChatWidget = useElixirChatWidget();
const inputRef = useTemplateRef<HTMLInputElement>('inputRef');

const searchText = ref('');
const widgetIsSearchOpen = ref(false);
const searchMessagesIds = ref<string[]>([]);
const showMessageNumber = ref(0);
const totalMessageCount = ref(0);
const isSearchActive = ref(false);

const placeholderText = computed(() => t('search'));
const previousButtonLabel = computed(() => (locale.value === 'en' ? 'Previous' : 'Предыдущий'));
const nextButtonLabel = computed(() => t('searh_next'));
const closeButtonLabel = computed(() => t('searh_close'));

function getEntryTextPoint(value: string) {
  const normalizedSearchTerm = value.trim();
  elixirChatWidget.fetchMessageBySearch(normalizedSearchTerm);
  emit('change-text', normalizedSearchTerm);
}

const debouncedTriggerSearch = debounce(getEntryTextPoint, 400);

function loadMessageLogic(messageId?: string, direction?: 'up' | 'down') {
  if (!messageId) {
    return;
  }

  if (props.messagesIds.includes(messageId)) {
    emit('scroll-message', messageId);
    return;
  }

  isSearchActive.value = true;
  elixirChatWidget
    .loadHistoryMessageBySearch(messageId)
    .then(() => {
      emit('scroll-message', messageId, direction);
    })
    .finally(() => {
      setTimeout(() => {
        isSearchActive.value = false;
      }, 650);
    });
}

function showPrevMessage() {
  const index = showMessageNumber.value;
  const messageId = searchMessagesIds.value[index];
  showMessageNumber.value = index + 1;
  loadMessageLogic(messageId, 'up');
}

function showNextMessage() {
  const index = showMessageNumber.value;
  const messageId = searchMessagesIds.value[index - 2];
  showMessageNumber.value = index - 1;
  loadMessageLogic(messageId, 'down');
}

function clearSearchResult() {
  showMessageNumber.value = 0;
  totalMessageCount.value = 0;
  searchText.value = '';
  emit('change-text', '');
}

function handleCloseSearch() {
  elixirChatWidget.closeSearch();
  clearSearchResult();
}

function onInputChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  searchText.value = value;
  debouncedTriggerSearch(value);
}

function onEnterKeyDown() {
  if (searchMessagesIds.value[0]) {
    emit('scroll-message', searchMessagesIds.value[0]);
  }
}

function onArrowUpKeyDown() {
  if (!disabledPrevButton.value) {
    showPrevMessage();
  }
}

function onArrowDownKeyDown() {
  if (!disabledNextButton.value) {
    showNextMessage();
  }
}

function onWidgetSearchToggle(isOpen: boolean) {
  widgetIsSearchOpen.value = isOpen;
  if (!isOpen) {
    return;
  }
  searchText.value = '';
  setTimeout(() => {
    inputRef.value?.focus();
  });
}

function onSearchIds(ids: string[]) {
  searchMessagesIds.value = ids || [];
  totalMessageCount.value = searchMessagesIds.value.length;
  showMessageNumber.value = searchMessagesIds.value.length ? 1 : 0;

  if (searchMessagesIds.value[0]) {
    loadMessageLogic(searchMessagesIds.value[0], 'up');
  }
}

const disabledPrevButton = computed(() => !(totalMessageCount.value && showMessageNumber.value < totalMessageCount.value));
const disabledNextButton = computed(() => !(totalMessageCount.value && showMessageNumber.value > 1));

onMounted(() => {
  elixirChatWidget.on(WIDGET_SEARCH_TOGGLE, onWidgetSearchToggle);
  elixirChatWidget.on(MESSAGES_SEARCH_IDS, onSearchIds);
});

onBeforeUnmount(() => {
  debouncedTriggerSearch.cancel();
  elixirChatWidget.off(WIDGET_SEARCH_TOGGLE, onWidgetSearchToggle);
  elixirChatWidget.off(MESSAGES_SEARCH_IDS, onSearchIds);
});
</script>

<template>
  <div
    class="elixirchat-chat__search-wrapper"
    :class="{ 'elixirchat-chat__search-wrapper_close': !widgetIsSearchOpen }"
  >
    <div class="elixirchat-chat__search-form">
      <div
        class="elixirchat-chat__search-input-wrapper"
        :class="{ 'elixirchat-chat__search-input-wrapper_loading': isSearchActive }"
      >
        <input
          ref="inputRef"
          type="text"
          class="elixirchat-chat__search-input"
          :value="searchText"
          :placeholder="placeholderText"
          @keydown.enter="onEnterKeyDown"
          @keydown.esc="handleCloseSearch"
          @keydown.up.prevent="onArrowUpKeyDown"
          @keydown.down.prevent="onArrowDownKeyDown"
          @input="onInputChange"
        >
      </div>

      <div class="elixirchat-chat__search__buttons-group">
        <button
          class="elixirchat-chat__search-button elixirchat-chat__search-button_prev"
          :disabled="disabledPrevButton"
          @click="showPrevMessage"
        >
          <svg
            width="15"
            height="8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.156 6.89a.523.523 0 0 0-.125.173.583.583 0 0 0 .032.484c.046.078.109.14.187.187.083.047.174.07.273.07.167 0 .295-.049.383-.148l5.938-6.234h-.688l5.93 6.234a.518.518 0 0 0 .383.149.521.521 0 0 0 .46-.258.481.481 0 0 0 .079-.274.5.5 0 0 0-.164-.375L7.922.664a.67.67 0 0 0-.195-.148A.5.5 0 0 0 7.5.46a.556.556 0 0 0-.422.195L1.156 6.891Z"
              fill="currentColor"
            />
          </svg>
          <span>{{ previousButtonLabel }}</span>
        </button>

        <button
          class="elixirchat-chat__search-button elixirchat-chat__search-button_next"
          :disabled="disabledNextButton"
          @click="showNextMessage"
        >
          <span>{{ nextButtonLabel }}</span>
          <svg
            width="15"
            height="9"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 8.29a.57.57 0 0 0 .227-.048.67.67 0 0 0 .195-.148l5.922-6.242a.516.516 0 0 0 .086-.649.52.52 0 0 0-.188-.195.521.521 0 0 0-.273-.07.538.538 0 0 0-.383.156l-5.93 6.234h.688L1.906 1.094a.504.504 0 0 0-.383-.157.548.548 0 0 0-.273.07.548.548 0 0 0-.258.469c0 .079.013.149.04.212a.66.66 0 0 0 .124.171l5.922 6.235c.13.13.271.195.422.195Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <button
      class="elixirchat-chat__search-button_close"
      @click="handleCloseSearch"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 20a10 10 0 0 0 9.2-13.9A10.2 10.2 0 0 0 10 0a9.6 9.6 0 0 0-7 3C2 3.9 1.2 5 .7 6a9.7 9.7 0 0 0 2.2 11 10.2 10.2 0 0 0 7 2.9Zm0-1.3a8.5 8.5 0 0 1-6.2-2.5A8.8 8.8 0 0 1 1.3 10a8.6 8.6 0 0 1 2.5-6.2A8.6 8.6 0 0 1 10 1.3a8.5 8.5 0 0 1 6.2 2.5 8.7 8.7 0 0 1-6.2 15Zm-3.5-4.6c.2 0 .4 0 .5-.2l3-3 3 3a.6.6 0 0 0 1 0l.1-.4c0-.2 0-.3-.2-.5l-3-3 3-3 .2-.5c0-.2 0-.3-.2-.4a.6.6 0 0 0-.4-.2c-.2 0-.3 0-.5.2l-3 3-3-3a.6.6 0 0 0-.5-.2c-.2 0-.3 0-.4.2l-.2.4c0 .2 0 .3.2.5l3 3-3 3-.2.5c0 .2 0 .3.2.4.1.2.2.2.4.2Z"
          fill="currentColor"
        />
      </svg>
      <span>{{ closeButtonLabel }}</span>
    </button>
  </div>
</template>
