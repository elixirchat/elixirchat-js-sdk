import { inject } from 'vue';
import type { ElixirChatWidget } from '../../ElixirChatWidget';

export const ElixirChatWidgetKey = Symbol('elixirChatWidget');

export const useElixirChatWidget = (): ElixirChatWidget => {
  const widget = inject<ElixirChatWidget | null>(ElixirChatWidgetKey, null);

  if (!widget) {
    throw new Error('ElixirChatWidget has not been provided');
  }

  return widget;
};

