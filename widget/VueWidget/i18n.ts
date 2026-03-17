import { createI18n } from 'vue-i18n';
import type { ElixirChatWidget } from '../ElixirChatWidget';
import trl from '../DefaultWidget/trl.json';

type Locale = 'ru' | 'en';

type Messages = Record<Locale, Record<string, string>>;

const SUPPORTED_LOCALES: Locale[] = ['ru', 'en'];

const buildMessages = (): Messages => {
  const messages: Messages = {
    ru: {},
    en: {},
  };

  Object.entries(trl as Record<string, { ru: string; en: string }>).forEach(
    ([key, value]) => {
      messages.ru[key] = value.ru;
      messages.en[key] = value.en;
    },
  );

  return messages;
};

const allMessages = buildMessages();

export const createWidgetI18n = (elixirChatWidget: ElixirChatWidget) => {
  const rawLocale = elixirChatWidget.client?.locale as string | undefined;
  const normalizedLocale = (rawLocale || 'ru').toLowerCase() as Locale;

  const locale: Locale = SUPPORTED_LOCALES.includes(normalizedLocale)
    ? normalizedLocale
    : 'en';

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: allMessages,
  });
};

