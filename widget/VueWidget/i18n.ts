import type { ElixirChatWidget } from '../ElixirChatWidget';
import { createI18n } from 'vue-i18n';
import trl from '../DefaultWidget/trl.json';

type Locale = 'ru' | 'en';

function pluralRule(choice: number, choicesLength: number): number {
  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

const baseRu = Object.fromEntries(Object.entries(trl).map(([key, value]) => [key, value.ru]));
const baseEn = Object.fromEntries(Object.entries(trl).map(([key, value]) => [key, value.en]));

const messages = {
  ru: {
    ...baseRu,
    typing: 'никто не пишет | {n} человек пишет | {n} человека пишут | {n} человек пишут'
  },
  en: {
    ...baseEn,
    typing: 'nobody is typing | {n} is typing | {n} are typing'
  }
};

export const createWidgetI18n = (elixirChatWidget: ElixirChatWidget) => {
  const locale: Locale = elixirChatWidget.client?.locale?.toLowerCase() === 'en' ? 'en' : 'ru';

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'ru',
    messages,
    pluralRules: {
      ru: pluralRule
    }
  });
};
