import type { ElixirChatWidget } from './widget/ElixirChatWidget';
import type { IMessage } from './sdk/serializers/serializeMessage';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import { _last, _round, getUserFullName } from './utilsCommon';

dayjs.extend(dayjsCalendar);

export type WidgetI18n = {
  locale: string;
  t: (key: string, params?: Record<string, unknown>) => string;
};

export function humanizeFileSize(sizeInBytes: number, i18n: WidgetI18n): string {
  const unitsDict = {
    kb: i18n.t('size_kb'),
    mb: i18n.t('size_mb'),
    gb: i18n.t('size_gb')
  };
  const sizeInKb = sizeInBytes / 1024;
  const sizeInMb = sizeInKb / 1024;
  const sizeInGb = sizeInMb / 1024;

  let primarySize = sizeInKb;
  let primaryUnit = 'kb';
  if (sizeInGb > 1) {
    primarySize = sizeInGb;
    primaryUnit = 'gb';
  } else if (sizeInMb > 1) {
    primarySize = sizeInMb;
    primaryUnit = 'mb';
  }
  primarySize = primarySize < 0.1 ? 0.1 : +(primarySize.toFixed(1));
  return `${primarySize.toLocaleString(i18n.locale)} ${unitsDict[primaryUnit]}`;
}

function humanizeTimezoneName(date: Date, i18n: WidgetI18n): string {
  dayjs.locale(i18n.locale);

  date = new Date(date);

  const timezones = [
    'Moscow',
    'Samara',
    'Yekaterinburg',
    'Novosibirsk',
    'Omsk',
    'Krasnoyarsk',
    'Irkutsk',
    'Yakutsk',
    'Vladivostok',
    'Sakhalin',
    'Magadan',
    'Kamchat',
    'Anadyr',
    'Tajikistan',
    'Turkmenistan',
    'Uzbekistan',
    'Kyrgyzstan',
    'Azerbaijan',
    'Armenia',
    'East Kazakhstan',
    'West Kazakhstan',
    'Eastern Europe'
  ];

  const timezoneName = date
    .toTimeString()
    .replace(/.*\((.+)\)$/, '$1');

  const tz = humanizeTimezoneOffset(date);
  for (let timezoneKeyword of timezones) {
    if (timezoneName.toLowerCase().includes(timezoneKeyword.toLowerCase())) {
      return i18n.t(`timezone ${timezoneKeyword}`, { tz });
    }
  }
  return i18n.t('timezone default', { tz });
}

function humanizeTimezoneOffset(date: Date) {
  date = new Date(date);
  const timezoneOffset = date.getTimezoneOffset() / -60;
  const timezoneSign = timezoneOffset < 0 ? '-' : '+';
  const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset));
  const timezoneOffsetMinutes = Math.abs(timezoneOffset % 1 * 60);
  return `GMT${
    timezoneSign
  }${timezoneOffsetHours
  }${timezoneOffsetMinutes ? `:${timezoneOffsetMinutes}` : ''}`;
}

export function humanizeUpcomingDate(date: Date | string, i18n: WidgetI18n): string {
  dayjs.locale(i18n.locale);

  const tz = humanizeTimezoneName(date, i18n);
  date = new Date(date);
  const inflectDayDict = {
    [dayjs().day(1)]: i18n.t('on_monday'),
    [dayjs().day(2)]: i18n.t('on_tuesday'),
    [dayjs().day(3)]: i18n.t('on_wednesday'),
    [dayjs().day(4)]: i18n.t('on_thursday'),
    [dayjs().day(5)]: i18n.t('on_friday'),
    [dayjs().day(6)]: i18n.t('on_saturday'),
    [dayjs().day(0)]: i18n.t('on_sunday')
  };
  let humanizedDate = dayjs(date).calendar(null, {
    nextWeek: i18n.t('humanized_date_next_week', { tz }),
    nextDay: i18n.t('humanized_date_next_day', { tz }),
    sameDay: i18n.t('humanized_date_same_day', { tz }),
    lastDay: i18n.t('humanized_date', { tz }),
    lastWeek: i18n.t('humanized_date', { tz }),
    sameElse: i18n.t('humanized_date', { tz })
  });
  for (let nominativeDay in inflectDayDict) {
    humanizedDate = humanizedDate.replace(nominativeDay, inflectDayDict[nominativeDay]);
  }
  return humanizedDate;
}

export async function getImageDimensions(imageUrl: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height
      });
    };
    image.onerror = () => {
      resolve({
        width: 0,
        height: 0
      });
    };
    image.src = imageUrl;
  });
}

export function generateReplyMessageQuote(messageToReplyTo: IMessage, elixirChatWidget: ElixirChatWidget) {
  const { sender, text, attachments } = messageToReplyTo || {};
  if (text) {
    return text.substr(0, 100);
  } else if (attachments?.length) {
    return attachments.map((attachment) => attachment.name).join(', ');
  } else if (!sender?.isOperator) {
    return getUserFullName(sender);
  } else {
    return getUserFullName(sender) || elixirChatWidget.widgetTitle;
  }
}

export function fitDimensionsIntoLimits(originalWidth, originalHeight, limitWidth, limitHeight) {
  limitWidth = limitWidth || Infinity;
  limitHeight = limitHeight || Infinity;
  const originalRatio = originalWidth / originalHeight;
  const newWidth = Math.min(originalWidth, limitWidth, limitHeight * originalRatio);
  const newHeight = newWidth / originalRatio;
  return [_round(newWidth), _round(newHeight)];
}

export function isWithinElement(target, container) {
  if (typeof container === 'string') {
    return Boolean(target.closest(`.${container}`));
  } else if (container instanceof HTMLElement) {
    return container.contains(target) || target === container;
  }
  return false;
}

export function isMobile() {
  const mobileRegex = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];
  return mobileRegex.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

export function exposeComponentToGlobalScope(
  instance: { constructor: { name: string } },
  elixirChatWidget: ElixirChatWidget
) {
  elixirChatWidget.widgetComponents[instance.constructor.name] = instance;
}

export function getAvatarColorByUserId(userId: string): string {
  const defaultColor = '#0033FF';
  if (!userId) {
    return defaultColor;
  }
  const idDigits = userId.replace(/[a-z\-_=]/gi, '');
  const factor = +_last(idDigits) + (0.1 * +idDigits[idDigits.length - 2]);
  const colorIndex = Math.floor(factor * 2);
  const colorDict = [
    '#b35766',
    '#b38b72',
    '#d4a471',
    '#e83b52',
    '#ef6e9c',
    '#fd4c26',
    '#f46e41',
    '#f87b31',
    '#bafc09',
    '#c6da6e',
    '#7dcb39',
    '#12972d',
    '#19c36a',
    '#79f2c2',
    '#79e6f2',
    '#066afc',
    '#0d01a6',
    '#c52bf0',
    '#9405df',
    '#273c4f'
  ];
  return colorDict[colorIndex];
}
