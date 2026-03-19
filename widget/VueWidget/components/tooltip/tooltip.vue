<script setup lang="ts">
import { computed, ref, useTempateRef, onMounted } from 'vue';

const {
  title = '',
  className = '',
  center = false,
  trigger = 'hover'
} = defineProps<{
  title?: string;
  className?: string;
  center?: boolean;
  trigger?: 'hover' | 'click';
}>();

const hasTitle = computed(() => Boolean(title && title.trim().length));
const isVisible = ref(false);
const tooltipClass = computed(() => ({
  'elixirchat-tooltip': true,
  'elixirchat-tooltip--center': center,
  [className || '']: Boolean(className)
}));
const rootRef = useTempateRef<HTMLElement | null>(null);
const targetEl = useTempateRef<HTMLElement | null>(null);

function showTooltip() {
  isVisible.value = true;
}

function hideTooltip() {
  isVisible.value = false;
}

function handleClick() {
  if (trigger !== 'click') {
    return;
  }
  showTooltip();
}

onMounted(() => {
  targetEl.value = rootRef.value?.firstElementChild as HTMLElement;
});
</script>

<template>
  <span
    ref="rootRef"
    @mouseenter="trigger === 'hover' ? showTooltip() : undefined"
    @mouseleave="(trigger === 'hover' || trigger === 'click') ? hideTooltip() : undefined"
    @click="handleClick"
  >
    <slot />
    <Teleport
      v-if="hasTitle && targetEl"
      :to="targetEl"
    >
      <div
        v-show="isVisible"
        :class="tooltipClass"
      >
        {{ title }}
      </div>
    </Teleport>
  </span>
</template>
