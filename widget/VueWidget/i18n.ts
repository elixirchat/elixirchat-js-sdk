import { createI18n } from 'vue-i18n';
import type { ElixirChatWidget } from '../ElixirChatWidget';
import trl from '../DefaultWidget/trl.json';

type Locale = 'ru' | 'en';

type Messages = Record<Locale, Record<string, string>>;
type TranslationSchema = Record<string, Record<Locale, string>>;

const SUPPORTED_LOCALES: Locale[] = ['ru', 'en'];

const buildMessages = (): Messages => {
  const typedTrl = trl as TranslationSchema;
  
  const messages: Messages = {
    ru: {},
    en: {},
  };

  Object.entries(typedTrl).forEach(
    ([key, value]) => {
      messages.ru[key] = value.ru;
      messages.en[key] = value.en;
    },
  );

  return messages;
};

const allMessages = buildMessages();

export const createWidgetI18n = (elixirChatWidget: ElixirChatWidget) => {
  const rawLocale = elixirChatWidget.client?.locale?.toLowerCase();

  const locale: Locale = SUPPORTED_LOCALES.includes(rawLocale)
    ? rawLocale
    : 'en';

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'ru',
    messages: allMessages,
  });
};

