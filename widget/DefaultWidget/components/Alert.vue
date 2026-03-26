<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ERROR_ALERT } from '../../../sdk/ElixirChatEventTypes';
import { normalizeErrorStack } from '../../../utilsCommon';
import { extractErrorMessage } from '../../../sdk/GraphQLClient';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';
import FormattedMarkdown from './FormattedMarkdown.vue';

type AlertPayload = {
  customMessage?: string;
  error?: any;
  retryCallback?: () => void;
};

const { t } = useI18n();
const elixirChatWidget = useElixirChatWidget();
const messageBlockRef = useTemplateRef<HTMLDivElement>('messageBlockRef');

const isOpen = ref(false);
const isExpanded = ref(false);
const emailText = ref('');
const errorDetails = ref('');
const errorStack = ref('');
const alertData = ref<AlertPayload>({});

function resetErrorBlockHeight() {
  try {
    if (messageBlockRef.value) {
      messageBlockRef.value.style.height = 'auto';
    }
  } catch {}
}

function setErrorBlockHeight() {
  if (!isOpen.value) {
    return;
  }
  requestAnimationFrame(() => {
    try {
      if (messageBlockRef.value) {
        messageBlockRef.value.style.height = `${messageBlockRef.value.offsetHeight}px`;
      }
    } catch {}
  });
}

function generateErrorDetails(payload: AlertPayload) {
  const { customMessage, error } = payload || {};
  const maxErrorDetailsLength = 300;
  const networkFailureKeys = [
    'Failed to fetch',
    'NetworkError when attempting to fetch resource'
  ];

  const networkFailureMessage = t('could_not_reach_server');
  for (let i = 0; i < networkFailureKeys.length; i += 1) {
    if ((error?.message || '').toLowerCase().includes(networkFailureKeys[i].toLowerCase())) {
      return networkFailureMessage;
    }
  }

  const details = customMessage || extractErrorMessage(error) || '';
  const trimmed = details.slice(0, maxErrorDetailsLength);
  return details.length > maxErrorDetailsLength ? `${trimmed}…` : details;
}

function generateEmailText(payload: AlertPayload, details: string, stack: string) {
  const { firstName, lastName, id } = elixirChatWidget.client;

  return t('support_chat_error_info', {
    errorDetails: details,
    firstName,
    lastName,
    id,
    error: payload.customMessage || extractErrorMessage(payload.error),
    timestamp: new Date().toString(),
    userAgent: navigator.userAgent,
    screenWidth: screen.availWidth,
    screenHeight: screen.availHeight,
    devicePixelRatio: window.devicePixelRatio,
    errorStack: stack
  });
}

function generateMailToHref() {
  const subject = t('support_chat_error');
  return `mailto:${elixirChatWidget.widgetSupportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText.value)}`;
}

function onRetryClick() {
  if (alertData.value.retryCallback) {
    resetErrorBlockHeight();
    isOpen.value = false;
    alertData.value.retryCallback();
  }
}

function onCloseClick() {
  resetErrorBlockHeight();
  isOpen.value = false;
  isExpanded.value = false;
}

function onCollapseClick() {
  isExpanded.value = false;
}

function onExpandToEmailClick() {
  isExpanded.value = true;
}

function onEmailTextInput(event: Event) {
  emailText.value = (event.target as HTMLTextAreaElement).value;
}

function onAlertShow(payload: AlertPayload) {
  if (isOpen.value) {
    return;
  }

  const stack = normalizeErrorStack(new Error().stack, 18);
  const details = generateErrorDetails(payload);
  const mailText = generateEmailText(payload, details, stack);

  isOpen.value = true;
  errorDetails.value = details;
  errorStack.value = stack;
  emailText.value = mailText;
  alertData.value = payload;

  nextTick(() => {
    elixirChatWidget.waitForPopupToOpen(setErrorBlockHeight);
  });
}

onMounted(() => {
  elixirChatWidget.on(ERROR_ALERT, onAlertShow);
});

onBeforeUnmount(() => {
  elixirChatWidget.off(ERROR_ALERT, onAlertShow);
});
</script>

<template>
  <div
    class="elixirchat-alert"
    :class="{
      'elixirchat-alert--open': isOpen,
      'elixirchat-alert--expanded': isExpanded
    }"
  >
    <span class="elixirchat-alert__background" />
    <div
      ref="messageBlockRef"
      class="elixirchat-alert__block"
    >
      <template v-if="!isExpanded">
        <h3 class="elixirchat-alert__header-title">
          {{ t('error') }}
        </h3>
        <i
          class="elixirchat-alert__header-icon icon-close-thin"
          @click="onCloseClick"
        />
        <formatted-markdown
          class="elixirchat-alert__message"
          :markdown="errorDetails"
        />
        <div class="elixirchat-alert__button-block">
          <button
            class="elixirchat-alert__retry-button"
            @click="onRetryClick"
          >
            {{ t('try_again') }}
          </button>
          <span
            class="elixirchat-alert__expand-link"
            @click="onExpandToEmailClick"
          >
            {{ t('contact_via_email') }}
          </span>
        </div>
      </template>

      <template v-else>
        <h3 class="elixirchat-alert__header-title">
          {{ t('report_a_problem') }}
        </h3>
        <i
          class="elixirchat-alert__header-icon icon-close-thin"
          @click="onCollapseClick"
        />
        <textarea
          class="elixirchat-alert__error-text"
          :value="emailText"
          @input="onEmailTextInput"
        />
        <a
          class="elixirchat-alert__send-email-button"
          :href="generateMailToHref()"
          target="_blank"
        >
          {{ t('send_to_email', { email: elixirChatWidget.widgetSupportEmail }) }}
        </a>
      </template>
    </div>
  </div>
</template>
