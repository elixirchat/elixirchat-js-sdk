<script setup lang="ts">
import { ref, useTemplateRef, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useTextareaAutosize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { setToLocalStorage } from '../../../utilsCommon';
import { MESSAGES_HISTORY_CHANGE, TYPING_STATUS_SUBSCRIBE_SUCCESS } from '../../../sdk/ElixirChatEventTypes';
import { WIDGET_REPLY_MESSAGE, WIDGET_TEXTAREA_RESIZE } from '../../ElixirChatWidgetEventTypes';
import { generateReplyMessageQuote } from '../../../utilsWidget';
import ActionsDropdown from './actionsDropdown.vue';

const TYPED_TEXT_STORAGE_KEY = 'elixirchat-typed-text';

type LocallySavedTypedText = {
  textareaText: string;
  textareaResponseToMessageId: string | null;
};

type Attachment = {
  id: string;
  file: File;
  name: string;
  width: number;
  height: number;
  isScreenshot?: boolean;
};

const { t } = useI18n();

const elixirChatWidget = useElixirChatWidget();

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef');
const textareaContainerRef = useTemplateRef<HTMLDivElement>('textareaContainer');

const textareaText = ref('');
const textareaResponseToMessageId = ref<string | null>(null);
const textareaAttachments = ref<Attachment[]>([]);
const responseToMessage = ref<any>(undefined);
const isSubmittingMessage = ref(false);
const isDraggingAttachments = ref(false);
const hasCanceledDraggingAttachments = ref(false);
const screenshotFallback = ref<object | null>(null);

function focusTextarea() {
  setTimeout(() => {
    textareaRef.value?.focus();
  });
}

function onVerticalResize() {
  requestAnimationFrame(() => {
    const container = textareaContainerRef.value;
    if (container) {
      elixirChatWidget.triggerEvent(WIDGET_TEXTAREA_RESIZE, container.offsetHeight);
    }
  });
}

const { triggerResize } = useTextareaAutosize({
  element: textareaRef,
  input: textareaText,
  onResize: onVerticalResize
});

function onTextareaChange() {
  const text = textareaText.value;
  elixirChatWidget.dispatchTypedText(text);
  updateLocallySavedTypedText({ textareaText: text });
}

function onTextareaKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && e.shiftKey === false) {
    e.preventDefault();

    if (!textareaText.value.trim() && !textareaAttachments.value.length) {
      return;
    }

    onMessageSubmit();
    reset();
  }
}

function handleAttachmentPaste() {
  console.log('paste');
}

function reset() {
  textareaText.value = '';
  textareaResponseToMessageId.value = null;
  textareaAttachments.value = [];

  // nextTick(() => triggerResize());
}

function onSubmitClick() {
  if (!textareaText.value.trim() && !textareaAttachments.value.length) {
    return;
  }
  onMessageSubmit();
  reset();
  focusTextarea();
}

function getLocallySavedTypedText(): LocallySavedTypedText {
  try {
    const parsed = JSON.parse(localStorage.getItem(TYPED_TEXT_STORAGE_KEY) || '');

    return {
      textareaText: typeof parsed?.textareaText === 'string' ? parsed.textareaText : '',
      textareaResponseToMessageId:
        typeof parsed?.textareaResponseToMessageId === 'string'
          ? parsed.textareaResponseToMessageId
          : null
    };
  } catch {
    return {
      textareaText: '',
      textareaResponseToMessageId: null
    };
  }
}

function updateLocallySavedTypedText(diff: Partial<LocallySavedTypedText>): void {
  const updatedState: LocallySavedTypedText = {
    ...getLocallySavedTypedText(),
    ...diff
  };
  setToLocalStorage(TYPED_TEXT_STORAGE_KEY, updatedState);
}

function onTypingStatusSubscribeSuccess() {
  elixirChatWidget.dispatchTypedText(getLocallySavedTypedText().textareaText);
}

function onMessageSubmit() {
  if (textareaText.value.trim() || textareaAttachments.value.length) {
    isSubmittingMessage.value = true;

    elixirChatWidget.sendMessage({
      text: textareaText.value,
      attachments: textareaAttachments.value,
      responseToMessageId: textareaResponseToMessageId.value,
      appendConditionally: true
    })
      .finally(() => {
        isSubmittingMessage.value = false;
      });
    elixirChatWidget.dispatchTypedText(false);
    updateLocallySavedTypedText({
      textareaText: '',
      textareaResponseToMessageId: null
    });
  }
}

function updateResponseToMessage() {
  const id = textareaResponseToMessageId.value;
  if (!id) {
    responseToMessage.value = undefined;
    return;
  }
  responseToMessage.value = elixirChatWidget.messageHistory?.find((message) => message.id === id);
}

watch(textareaResponseToMessageId, updateResponseToMessage, { immediate: true });

function onRemoveReplyTo() {
  textareaResponseToMessageId.value = null;
  updateLocallySavedTypedText({ textareaResponseToMessageId: null });
  onVerticalResize();
  focusTextarea();
}

function onReplyMessage(messageId: string) {
  textareaResponseToMessageId.value = messageId;
  updateLocallySavedTypedText({ textareaResponseToMessageId: messageId });
  onVerticalResize();
  focusTextarea();
}

function onMessageHistoryChange() {
  updateResponseToMessage();
}

function onScreenShotClick() {
  elixirChatWidget.takeScreenshot();
}

function onAttachFileClick() {
  alert('file');
}

onMounted(() => {
  const saved = getLocallySavedTypedText();
  textareaText.value = saved.textareaText;
  textareaResponseToMessageId.value = saved.textareaResponseToMessageId;

  elixirChatWidget.on(TYPING_STATUS_SUBSCRIBE_SUCCESS, onTypingStatusSubscribeSuccess);
  elixirChatWidget.on(WIDGET_REPLY_MESSAGE, onReplyMessage);
  elixirChatWidget.on(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);

  nextTick(() => triggerResize());

  setTimeout(() => {
    focusTextarea();
    onVerticalResize();
  });
});

onBeforeUnmount(() => {
  elixirChatWidget.off(TYPING_STATUS_SUBSCRIBE_SUCCESS, onTypingStatusSubscribeSuccess);
  elixirChatWidget.off(WIDGET_REPLY_MESSAGE, onReplyMessage);
  elixirChatWidget.off(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
});
</script>

<template>
  <div
    ref="textareaContainer"
    class="elixirchat-chat-textarea"
  >
    <div
      v-if="responseToMessage"
      class="elixirchat-chat-textarea__reply-to"
    >
      <span class="elixirchat-chat-textarea__reply-to-text">
        <i class="elixirchat-chat-textarea__reply-to-icon icon-reply-right" />
        <span>{{ generateReplyMessageQuote(responseToMessage, elixirChatWidget) }}</span>
      </span>
      <span
        class="elixirchat-chat-textarea__reply-to-remove icon-close-thick"
        role="button"
        tabindex="0"
        @click="onRemoveReplyTo"
      />
    </div>
    <textarea
      ref="textareaRef"
      v-model="textareaText"
      class="elixirchat-chat-textarea__textarea"
      :placeholder="t('send_a_message')"
      @input="onTextareaChange"
      @keydown="onTextareaKeyDown"
      @paste="handleAttachmentPaste"
    />
    <div class="elixirchat-chat-textarea__actions-row">
      <actions-dropdown
        @take-screenshoot="onScreenShotClick"
        @attach-file="onAttachFileClick"
      />
      <button
        type="button"
        class="elixirchat-chat-textarea__send-btn"
        :disabled="!textareaText.trim() && !textareaAttachments.length"
        @click="onSubmitClick"
      >
        <i class="icon-send" />
      </button>
    </div>
  </div>
</template>
