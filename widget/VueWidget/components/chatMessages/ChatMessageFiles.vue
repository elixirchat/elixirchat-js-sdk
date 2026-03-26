<script setup lang="ts">
import type { IFile } from '../../../../sdk/serializers/serializeFile';
import { useI18n } from 'vue-i18n';
import { humanizeFileSize } from '../../../../utilsWidgetVue';

defineProps<{
  files: IFile[];
  isSubmitting?: boolean;
}>();

const { locale, t } = useI18n();

function formatFileSize(bytes: number): string {
  return humanizeFileSize(bytes, {
    locale: locale.value,
    t
  });
}
</script>

<template>
  <ul
    v-if="files?.length"
    class="elixirchat-chat-files"
  >
    <li
      v-for="file in files"
      :key="file.id"
      class="elixirchat-chat-files__item"
    >
      <a
        class="elixirchat-chat-files__preview"
        :class="{
          'elixirchat-chat-files__preview-image': file.thumbnails?.[0]?.url,
          'elixirchat-chat-files__preview-submitting': isSubmitting
        }"
        :href="file.url"
        :style="file.thumbnails?.[0]?.url ? { backgroundImage: `url(${file.thumbnails[0].url})` } : undefined"
        target="_blank"
      >
        <i
          v-if="!file.thumbnails?.[0]?.url && !isSubmitting"
          class="icon-file"
        />
        <i
          v-if="isSubmitting"
          class="elixirchat-chat-files__preview-spinner icon-spinner-xs"
        />
      </a>
      <div class="elixirchat-chat-files__text">
        <a
          :href="file.url"
          class="elixirchat-chat-files__text-link"
          target="_blank"
        >
          {{ file.name }}
        </a>
        <br>
        <span class="elixirchat-chat-files__text-secondary">
          {{ isSubmitting ? t('upload') : formatFileSize(file.bytesSize) }}
        </span>
      </div>
    </li>
  </ul>
</template>
