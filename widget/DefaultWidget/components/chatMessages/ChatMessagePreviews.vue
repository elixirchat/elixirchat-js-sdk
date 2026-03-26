<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  _round
} from '@root/utilsCommon';

defineProps<{
  previews: any;
  isSubmitting?: boolean;
  sender?: any;
}>();

const emit = defineEmits<{
  previewClick: [event: Event, preview: any, sender: any];
}>();

const { t } = useI18n();

function formatVideoDuration(durationInSeconds) {
  if (durationInSeconds == null || !Number.isFinite(durationInSeconds)) {
    return '0:00';
  }

  const totalHours = Math.floor(durationInSeconds / 60 / 60);
  const totalMinutes = Math.floor(durationInSeconds / 60);
  const leftoverMinutes = totalMinutes - (totalHours * 60);
  const leftoverSeconds = Math.round(durationInSeconds - (totalMinutes * 60));
  const durationArr = [
    leftoverMinutes.toString().padStart(2, '0'),
    leftoverSeconds.toString().padStart(2, '0')
  ];
  if (totalHours) {
    durationArr.unshift(
      totalHours.toString().padStart(2, '0')
    );
  }
  return durationArr.join(':');
}
</script>

<template>
  <ul
    v-if="previews?.length"
    class="elixirchat-chat-previews"
  >
    <li
      v-for="preview in previews"
      :key="preview.id"
      class="elixirchat-chat-previews__item"
    >
      <a
        :href="preview.url"
        class="elixirchat-chat-previews__link"
        target="_blank"
        @click.prevent="emit('previewClick', $event, preview, sender)"
      >
        <i
          v-if="isSubmitting"
          class="elixirchat-chat-previews__spinner icon-spinner-xs"
        />
        <template v-if="preview.previewType === 'video'">
          <span class="elixirchat-chat-previews__video-play">&#x25B6;</span>
          <span class="elixirchat-chat-previews__video-label">
            {{ formatVideoDuration(preview.duration) }}
          </span>
        </template>

        <img
          class="elixirchat-chat-previews__img"
          :class="{
            'elixirchat-chat-previews__img--submitting': isSubmitting
          }"
          :width="_round(preview.thumbnailWidth)"
          :height="_round(preview.thumbnailHeight)"
          :src="preview.thumbnails?.[0]?.url"
          :alt="preview.name"
          @error="($event.target as HTMLImageElement)?.parentElement?.classList.add('elixirchat-chat-previews__item-not-found')"
        >
        <span class="elixirchat-chat-previews__item-not-found-placeholder">
          {{ t('file_not_found') }}
          <br>
          {{ preview.name }}
        </span>
      </a>
    </li>
  </ul>
</template>
