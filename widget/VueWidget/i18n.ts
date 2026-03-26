import type { ElixirChatWidget } from '../ElixirChatWidget';
import { createI18n } from 'vue-i18n';
import trl from '../DefaultWidget/trl.json';

type Locale = 'ru' | 'en';

const baseRu = Object.fromEntries(Object.entries(trl).map(([key, value]) => [key, value.ru]));
const baseEn = Object.fromEntries(Object.entries(trl).map(([key, value]) => [key, value.en]));

const messages = {
  ru: baseRu,
  en: baseEn
};

export const createWidgetI18n = (elixirChatWidget: ElixirChatWidget) => {
  const locale: Locale = elixirChatWidget.client?.locale?.toLowerCase() === 'en' ? 'en' : 'ru';

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'ru',
    messages
  });
};
