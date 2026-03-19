import { createI18n } from 'vue-i18n';
import type { ElixirChatWidget } from '../ElixirChatWidget';
import trl from '../DefaultWidget/trl.json';

type Locale = 'ru' | 'en';

const messages = {
  ru: Object.fromEntries(Object.entries(trl).map(([key, value]) => [key, value.ru])),
  en: Object.fromEntries(Object.entries(trl).map(([key, value]) => [key, value.en])),
};

export const createWidgetI18n = (elixirChatWidget: ElixirChatWidget) => {
  const locale: Locale = elixirChatWidget.client?.locale?.toLowerCase() === 'en' ? 'en' : 'ru';

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'ru',
    messages,
  });
};