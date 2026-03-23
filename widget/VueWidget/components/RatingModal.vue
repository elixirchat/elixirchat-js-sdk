<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import animationData from '../../DefaultWidget/assets/lottie-dislike-animation.json';

const emit = defineEmits<{
  close: [];
  submit: [comment: string];
}>();

const { t } = useI18n();

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef');

const comment = ref('');
const isSubmitting = ref(false);
const mode = ref<'default' | 'success'>('default');
const isClosing = ref(false);
const contentAppear = ref(true);
const isSuccess = ref(false);

function textareaFocus() {
  textareaRef.value?.focus();
}

function handleSkip() {
  isClosing.value = true;
}

function handleAnimationEnd() {
  if (!isClosing.value) {
    return;
  }

  emit('close');
}

function handleSubmit() {
  isSubmitting.value = true;
  emit('submit');
}
</script>

<template>
  <div
    class="elixirchat-rating-comment-modal"
    :class="{
      'elixirchat-rating-comment-modal--closing': isClosing
    }"
    @animationend="handleAnimationEnd"
  >
    <div class="elixirchat-rating-comment-modal__overlay" />
    <div
      class="elixirchat-rating-comment-modal__content"
      :class="{
        'elixirchat-rating-comment-modal__content--appear': contentAppear,
        'elixirchat-rating-comment-modal__content--hiding': isClosing,
        'elixirchat-rating-comment-modal__content--success': isSuccess
      }"
    >
      <div class="elixirchat-rating-comment-modal__animation">
        <Vue3Lottie
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
            :disabled="isSubmitting"
            maxlength="1000"
          />
          <div class="elixirchat-rating-comment-modal__actions">
            <button
              class="elixirchat-rating-comment-modal__button"
              @click="handleSubmit"
            >
              {{ t('rate_message_comment_submit') }}
            </button>
            <button
              class="elixirchat-rating-comment-modal__button elixirchat-rating-comment-modal__button--skip"
              @click="handleSkip"
            >
              {{ t('rate_message_comment_skip') }}
            </button>
          </div>
        </div>
      </div>
      <h3 class="elixirchat-rating-comment-modal__title elixirchat-rating-comment-modal__title--success">
        {{ t('rate_message_thank_you') }}
      </h3>
    </div>
  </div>
</template>
