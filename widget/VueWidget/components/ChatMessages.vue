<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import { useI18n } from 'vue-i18n';
import { useElixirChatWidget } from '../composables/useElixirChatWidget';

const { t } = useI18n();

const elixirChatWidget = useElixirChatWidget();

const processedMessages = ref([]);
const isLoading = ref(false);
const scrollContainerRef = useTemplateRef<HTMLDivElement>('scrollContainerRef');
</script>

<template>
  <div class="exlixir-chat__wrapper">
    <div
      ref="scrollContainerRef"
      class="elixirchat-chat-scroll"
    >
      <div class="elixirchat-chat-messages">
        <!-- todo: body -->
      </div>
    </div>
  </div>
</template>
