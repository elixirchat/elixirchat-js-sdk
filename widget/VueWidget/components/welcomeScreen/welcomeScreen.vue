<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useElixirChatWidget } from '../../composables/useElixirChatWidget';
import { useI18n } from 'vue-i18n';
import { WIDGET_DATA_SET } from '../../../ElixirChatWidgetEventTypes';

const { t } = useI18n();

const elixirChatWidget = useElixirChatWidget();

const widgetTitle = ref('');
const widgetLogo = ref<string | null>(null);

const logoBackground = computed(() => widgetLogo.value ? `url(${widgetLogo.value})` : '');

function syncFromWidget() { 
    widgetTitle.value = elixirChatWidget.widgetTitle;
    widgetLogo.value = elixirChatWidget.widgetLogo;
};

onMounted(() => {
    elixirChatWidget.on(WIDGET_DATA_SET, syncFromWidget);
});


onBeforeUnmount(() => {
    elixirChatWidget.off(WIDGET_DATA_SET, syncFromWidget);
});

</script>

<template>
    <!-- <div style={{ backgroundImage: `url(${widgetLogo})` }} className={cn({
          'elixirchat-welcome-screen__logo': true,
          'elixirchat-welcome-screen__logo--default': !widgetLogo,
    })}>
        <i className="icon-logo"/>
    </div> -->
    {{  logoBackground }}
    <h1 class="elixirchat-welcome-screen__title">{{ widgetTitle }}</h1>
</template>