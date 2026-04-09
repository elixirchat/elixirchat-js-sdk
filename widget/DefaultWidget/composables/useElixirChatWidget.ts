import { inject, provide } from 'vue';
import type { ElixirChatWidget } from '@widget/ElixirChatWidget';

const ElixirChatWidgetKey = Symbol('elixirChatWidget');

export const provideElixirChatWidget = (widget: ElixirChatWidget) => {
  provide(ElixirChatWidgetKey, widget);
};

export const useElixirChatWidget = (): ElixirChatWidget => {
  const widget = inject<ElixirChatWidget | null>(ElixirChatWidgetKey, null);

  if (!widget) {
    throw new Error('ElixirChatWidget has not been provided');
  }

  return widget;
};

