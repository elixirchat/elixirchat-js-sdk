<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Tooltip from '../tooltip/tooltip.vue';

const { type, messageId, rating = null, isLocked = false } = defineProps<{
  type: 'POSITIVE' | 'NEGATIVE';
  messageId: string;
  rating?: 'POSITIVE' | 'NEGATIVE' | null;
  isLocked?: boolean;
}>();

const emit = defineEmits<{
  rate: [messageId: string, rating: 'POSITIVE' | 'NEGATIVE'];
}>();

const { t } = useI18n();

const optimisticRating = ref<'POSITIVE' | 'NEGATIVE' | null>(null);
const shouldAnimate = ref(false);

const isPositive = computed(() => type === 'POSITIVE');
const isRated = computed(() => Boolean(rating));
const effectiveRating = computed(() => rating ?? optimisticRating.value);
const isActive = computed(() => effectiveRating.value === type);

watch(
  () => [isActive.value, optimisticRating.value, isRated.value],
  ([active, optimistic, rated]) => {
    if (active && optimistic === type && !rated && isPositive.value) {
      shouldAnimate.value = true;
    }
    if (optimistic && rated) {
      optimisticRating.value = null;
    }
  }
);

watch(
  () => isLocked,
  (locked, prevLocked) => {
    if (optimisticRating.value && prevLocked && !locked) {
      optimisticRating.value = null;
    }
  }
);

watch(shouldAnimate, (value) => {
  if (!value) {
    return;
  }

  const timer = setTimeout(() => {
    shouldAnimate.value = false;
  }, 500);

  return () => clearTimeout(timer);
});

const className = computed(() => ({
  'elixirchat-chat-messages__rating-button': true,
  [`elixirchat-chat-messages__rating-button--${isPositive.value ? 'positive' : 'negative'}`]: true,
  'elixirchat-chat-messages__rating-button--rated': isRated.value || isLocked
}));

const iconClassName = computed(() => {
  const icon = isPositive.value
    ? (isActive.value ? 'icon-like-active' : 'icon-like')
    : (isActive.value ? 'icon-dislike-active' : 'icon-dislike');

  return {
    [icon]: true,
    'elixirchat-chat-messages__rating-button--animate': shouldAnimate.value && isActive.value && isPositive.value
  };
});

const tooltipTitle = computed(() => (isRated.value || isLocked) ? t('rate_message_already_rated') : '');

function handleClick(e: Event) {
  if (isRated.value || isLocked) {
    e.preventDefault();
    return;
  }

  e.stopPropagation();

  optimisticRating.value = type;
  emit('rate', messageId, type);
}
</script>

<template>
  <tooltip
    :title="tooltipTitle"
    center
    trigger="click"
  >
    <button
      :class="className"
      @click="handleClick"
    >
      <i :class="iconClassName" />
    </button>
  </tooltip>
</template>
