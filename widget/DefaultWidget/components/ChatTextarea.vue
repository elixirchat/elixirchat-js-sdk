<script setup lang="ts">
import { ref, useTemplateRef, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useStorage, useTextareaAutosize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import { randomDigitStringId } from '../../../utilsCommon';
import { MESSAGES_HISTORY_CHANGE, TYPING_STATUS_SUBSCRIBE_SUCCESS } from '../../../sdk/ElixirChatEventTypes';
import {
  WIDGET_REPLY_MESSAGE,
  WIDGET_TEXTAREA_RESIZE,
  WIDGET_FULLSCREEN_PREVIEW_CLOSE,
  WIDGET_SCREENSHOT_REQUEST_SUCCESS,
  WIDGET_SCREENSHOT_REQUEST_ERROR,
  WIDGET_MUTE_TOGGLE,
  WIDGET_POPUP_OPEN,
  WIDGET_IFRAME_READY

} from '../../ElixirChatWidgetEventTypes';
import { generateReplyMessageQuote, getImageDimensions } from '../../../utilsWidget';
import ActionsDropdown from './ActionsDropdown.vue';
import { getScreenshotCompatibilityFallback } from '../../../sdk/ScreenshotTaker';

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
const inputFileRef = useTemplateRef<HTMLInputElement>('inputFileRef');

const textareaText = ref('');
const textareaResponseToMessageId = ref<string | null>(null);
const textareaAttachments = ref<Attachment[]>([]);
const responseToMessage = ref<any>(undefined);
const isSubmittingMessage = ref(false);
const isDraggingAttachments = ref(false);
const hasCanceledDraggingAttachments = ref(false);
const screenshotFallback = ref<object | null>(null);
const locallySavedTypedText = useStorage<LocallySavedTypedText>(
  TYPED_TEXT_STORAGE_KEY,
  {
    textareaText: '',
    textareaResponseToMessageId: null
  },
  localStorage,
  { mergeDefaults: true }
);

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

function handleAttachmentPaste(e: ClipboardEvent) {
  const items = Array.from(e.clipboardData?.items || []);
  const fileItem = items.find((i) => i.kind === 'file');
  if (!fileItem) {
    return;
  }
  const file = fileItem.getAsFile();
  if (!file) {
    return;
  }
  e.preventDefault();
  addAttachments([
    {
      name: t('pasted_from_clipboard'),
      file
    }
  ]);
}

function onWidgetPopupDrag(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDraggingAttachments.value = true;
  if (!hasCanceledDraggingAttachments.value) {
    hasCanceledDraggingAttachments.value = true;
    requestAnimationFrame(() => {
      elixirChatWidget.widgetIFrameDocument?.body?.addEventListener('dragleave', onWidgetPopupDragLeave);
    });
  }
}
function onWidgetPopupDragLeave() {
  elixirChatWidget.widgetIFrameDocument?.body?.removeEventListener('dragleave', onWidgetPopupDragLeave);
  isDraggingAttachments.value = false;
  hasCanceledDraggingAttachments.value = false;
}
function cancelWidgetPopupDrag() {
  isDraggingAttachments.value = false;
}
function onBodyDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  const items = Array.from(e.dataTransfer?.items || []);
  const files = items
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((f): f is File => Boolean(f))
    .map((file) => ({
      name: file.name,
      file
    }));
  addAttachments(files);
  cancelWidgetPopupDrag();
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

function getLocallySavedTypedText(raw: unknown = locallySavedTypedText.value): LocallySavedTypedText {
  const parsed = (raw && typeof raw === 'object') ? raw as Partial<LocallySavedTypedText> : {};
  return {
    textareaText: typeof parsed.textareaText === 'string' ? parsed.textareaText : '',
    textareaResponseToMessageId:
      typeof parsed.textareaResponseToMessageId === 'string'
        ? parsed.textareaResponseToMessageId
        : null
  };
}

function updateLocallySavedTypedText(diff: Partial<LocallySavedTypedText>): void {
  locallySavedTypedText.value = {
    ...getLocallySavedTypedText(locallySavedTypedText.value),
    ...diff
  };
}

function onTypingStatusSubscribeSuccess() {
  elixirChatWidget.dispatchTypedText(getLocallySavedTypedText(locallySavedTypedText.value).textareaText);
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

function onIframeReady() {
  const body = elixirChatWidget.widgetIFrameDocument?.body;
  if (!body) {
    return;
  }
  body.addEventListener('dragover', onWidgetPopupDrag);
  body.addEventListener('drop', onBodyDrop);
}

function onScreenshotRequestSuccess(screenshot: { file: File }) {
  addAttachments([
    {
      name: t('screenshot'),
      file: screenshot.file,
      isScreenshot: true
    }
  ]);
  elixirChatWidget.openPopup();
  if (!textareaText.value.trim()) {
    textareaText.value = t('here_is_the_screenshot');
  }
}

function onScreenshotRequestError() {
  elixirChatWidget.openPopup();
}

function onScreenShotClick() {
  elixirChatWidget.closePopup();
  elixirChatWidget.takeScreenshot();
}

function onAttachFileClick() {
  inputFileRef.value?.click();
}

async function addAttachments(newAttachments: Array<{
  name: string;
  file: File;
  isScreenshot?: boolean;
}>) {
  const enriched: Attachment[] = [];
  for (const attachment of newAttachments) {
    const id = randomDigitStringId(6);
    const imageBlobUrl = URL.createObjectURL(attachment.file);
    const dimensions = await getImageDimensions(imageBlobUrl);
    enriched.push({
      id,
      file: attachment.file,
      name: attachment.name,
      width: dimensions.width,
      height: dimensions.height,
      isScreenshot: attachment.isScreenshot
    });
  }
  textareaAttachments.value = [...textareaAttachments.value, ...enriched];
  onVerticalResize();
  focusTextarea();
}

function onInputFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  const attachments = files.map((file) => ({
    name: file.name,
    file
  }));
  addAttachments(attachments);
  target.value = '';
}

function removeAttachment(attachmentId: string) {
  textareaAttachments.value = textareaAttachments.value.filter((a) => a.id !== attachmentId);
  onVerticalResize();
  focusTextarea();
}

onMounted(() => {
  const saved = getLocallySavedTypedText(locallySavedTypedText.value);
  textareaText.value = saved.textareaText;
  textareaResponseToMessageId.value = saved.textareaResponseToMessageId;

  elixirChatWidget.on(TYPING_STATUS_SUBSCRIBE_SUCCESS, onTypingStatusSubscribeSuccess);
  elixirChatWidget.on(WIDGET_REPLY_MESSAGE, onReplyMessage);
  elixirChatWidget.on(MESSAGES_HISTORY_CHANGE, onMessageHistoryChange);
  elixirChatWidget.on(WIDGET_SCREENSHOT_REQUEST_SUCCESS, onScreenshotRequestSuccess);
  elixirChatWidget.on(WIDGET_SCREENSHOT_REQUEST_ERROR, onScreenshotRequestError);
  elixirChatWidget.on(WIDGET_IFRAME_READY, onIframeReady);
  window.addEventListener('dragover', cancelWidgetPopupDrag);
  elixirChatWidget.on(WIDGET_FULLSCREEN_PREVIEW_CLOSE, focusTextarea);
  elixirChatWidget.on(WIDGET_MUTE_TOGGLE, focusTextarea);
  elixirChatWidget.on(WIDGET_POPUP_OPEN, focusTextarea);
  elixirChatWidget.on(WIDGET_POPUP_OPEN, onVerticalResize);

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
  elixirChatWidget.off(WIDGET_SCREENSHOT_REQUEST_SUCCESS, onScreenshotRequestSuccess);
  elixirChatWidget.off(WIDGET_SCREENSHOT_REQUEST_ERROR, onScreenshotRequestError);
  elixirChatWidget.off(WIDGET_IFRAME_READY, onIframeReady);
  elixirChatWidget.off(WIDGET_FULLSCREEN_PREVIEW_CLOSE, focusTextarea);
  elixirChatWidget.off(WIDGET_MUTE_TOGGLE, focusTextarea);
  elixirChatWidget.off(WIDGET_POPUP_OPEN, focusTextarea);
  elixirChatWidget.off(WIDGET_POPUP_OPEN, onVerticalResize);

  const body = elixirChatWidget.widgetIFrameDocument?.body;
  body?.removeEventListener('dragover', onWidgetPopupDrag);
  body?.removeEventListener('drop', onBodyDrop);
  body?.removeEventListener('dragleave', onWidgetPopupDragLeave);
  window.removeEventListener('dragover', cancelWidgetPopupDrag);
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

    <input
      ref="inputFileRef"
      class="elixirchat-chat-textarea__actions-attach-input"
      type="file"
      multiple
      @change="onInputFileChange"
    >

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
    <ul
      v-if="textareaAttachments.length"
      class="elixirchat-chat-attachment-list"
    >
      <li
        v-for="attachment in textareaAttachments"
        :key="attachment.id"
        class="elixirchat-chat-attachment-item"
      >
        <i
          class="elixirchat-chat-attachment-icon"
          :class="[attachment.isScreenshot ? 'icon-screenshot' : 'icon-file']"
        />
        <span class="elixirchat-chat-attachment-filename">{{ attachment.name }}</span>
        <i
          class="elixirchat-chat-attachment-remove icon-close-thick"
          tabindex="0"
          @click="removeAttachment(attachment.id)"
        />
      </li>
    </ul>

    <template v-if="isDraggingAttachments">
      <div class="elixirchat-chat-draggable-backdrop" />
      <div class="elixirchat-chat-draggable-area">
        <i class="elixirchat-chat-draggable-area__icon icon-file" />
        <div>{{ t('drop_files') }}</div>
      </div>
    </template>
  </div>
</template>
