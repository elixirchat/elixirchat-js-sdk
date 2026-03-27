<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Vue3Lottie } from 'vue3-lottie';
import animationData from '@defaultWidget/assets/lottie-dislike-animation.json';

const { isSubmitted = false, isReady = true } = defineProps<{
  isSubmitted?: boolean;
  isReady?: boolean;
}>();

const emit = defineEmits<{
  submit: [comment: string];
  skip: [];
}>();

const { t } = useI18n();

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef');

const comment = ref('');
const isSubmitting = ref(false);
const contentAppear = ref(true);
const isSuccess = ref(false);
const isClosing = ref(false);

function textareaFocus() {
  textareaRef.value?.focus();
}

function startSuccessFlow() {
  isSuccess.value = true;
  isSubmitting.value = false;

  setTimeout(() => {
    handleLottieComplete();
  }, 1200);
}

function handleSubmit() {
  const normalizedComment = comment.value.trim();

  if (!isReady || !normalizedComment || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  emit('submit', normalizedComment);
}

function handleSkip() {
  isClosing.value = true;
}

function handleLottieComplete() {
  if (isSuccess.value) {
    isClosing.value = true;
  }
}

function onAnimationEnd(e: AnimationEvent) {
  if (e.animationName === 'modalDisappear' && isClosing.value) {
    emit('skip');
  }
}

watch(
  () => isSubmitted,
  (next, prev) => {
    if (!prev && next) {
      startSuccessFlow();
    }
  }
);

onMounted(() => {
  textareaFocus();
});
</script>

<template>
  <div
    class="elixirchat-rating-comment-modal"
    :class="{
      'elixirchat-rating-comment-modal--closing': isClosing
    }"
  >
    <div class="elixirchat-rating-comment-modal__overlay" />

    <div
      class="elixirchat-rating-comment-modal__content"
      :class="{
        'elixirchat-rating-comment-modal__content--appear': contentAppear,
        'elixirchat-rating-comment-modal__content--hiding': isClosing,
        'elixirchat-rating-comment-modal__content--success': isSuccess
      }"
      @animationend="onAnimationEnd"
    >
      <div class="elixirchat-rating-comment-modal__animation">
        <vue3-lottie
          :animation-data="animationData"
          :auto-play="isSuccess"
          :loop="false"
          :height="112"
          :width="112"
        />
      </div>

      <div class="elixirchat-rating-comment-modal__default-form">
        <h3 class="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--default">
          {{ t('rate_message_comment_title') }}
        </h3>

        <div class="elixirchat-rating-comment-modal__body">
          <textarea
            ref="textareaRef"
            v-model="comment"
            class="elixirchat-rating-comment-modal__textarea"
            rows="3"
            maxlength="1000"
            :disabled="isSubmitting || isSuccess"
          />

          <div class="elixirchat-rating-comment-modal__actions">
            <button
              class="elixirchat-rating-comment-modal__button"
              :disabled="isSuccess || !isReady || !comment.trim() || isSubmitting"
              @click="handleSubmit"
            >
              {{ t('rate_message_comment_submit') }}
            </button>

            <button
              class="elixirchat-rating-comment-modal__button elixirchat-rating-comment-modal__button--skip"
              :disabled="isSubmitting || isSuccess"
              @click="handleSkip"
            >
              {{ t('rate_message_comment_skip') }}
            </button>
          </div>
        </div>
      </div>

      <h3 class="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--success">
        <span v-html="t('rate_message_thank_you')" />
      </h3>
    </div>
  </div>
</template>
