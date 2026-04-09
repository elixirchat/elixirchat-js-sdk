import type { ElixirChatWidget } from '@widget/ElixirChatWidget';
import { createApp } from 'vue';
import App from '@defaultWidget/App.vue';
import { createWidgetI18n } from '@defaultWidget/i18n/i18n';

export const renderWidgetVue = (container: HTMLElement, elixirChatWidget: ElixirChatWidget) => {
  const app = createApp(App, { elixirChatWidget });
  const i18n = createWidgetI18n(elixirChatWidget);

  app.use(i18n);

  return app.mount(container);
};
