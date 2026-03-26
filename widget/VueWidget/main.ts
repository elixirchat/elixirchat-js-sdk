import type { ElixirChatWidget } from '../ElixirChatWidget';
import { createApp } from 'vue';
import Vue3Lottie from 'vue3-lottie';
import App from './App.vue';
import { createWidgetI18n } from './i18n';

export const renderWidgetVue = (container: HTMLElement, elixirChatWidget: ElixirChatWidget) => {
  const app = createApp(App, { elixirChatWidget });
  const i18n = createWidgetI18n(elixirChatWidget);

  app.use(i18n);
  app.use(Vue3Lottie, { name: 'Vue3Lottie' });

  return app.mount(container);
};
