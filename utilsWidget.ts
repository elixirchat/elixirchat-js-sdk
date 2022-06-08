import { Component } from 'react';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';

import { ElixirChatWidget } from './widget/ElixirChatWidget';
import { IMessage } from './sdk/serializers/serializeMessage';
import { _last, _round, getUserFullName } from './utilsCommon';

dayjs.extend(dayjsCalendar);

export function humanizeFileSize(sizeInBytes: number, intl: any): string {
  const unitsDict = {
    'kb': intl.formatMessage({ id: 'size_kb' }),
    'mb': intl.formatMessage({ id: 'size_mb' }),
    'gb': intl.formatMessage({ id: 'size_gb' }),
  };
  const sizeInKb = sizeInBytes / 1024;
  const sizeInMb = sizeInKb / 1024;
  const sizeInGb = sizeInMb / 1024;

  let primarySize = sizeInKb;
  let primaryUnit = 'kb';
  if (sizeInGb > 1) {
    primarySize = sizeInGb;
    primaryUnit = 'gb';
  }
  else if (sizeInMb > 1) {
    primarySize = sizeInMb;
    primaryUnit = 'mb';
  }
  primarySize = primarySize < 0.1 ? 0.1 : +(primarySize.toFixed(1));
  return primarySize.toLocaleString(intl.locale) + ' ' + unitsDict[primaryUnit];
}


function humanizeTimezoneName(date: Date, intl: any): string {
  dayjs.locale(intl.locale);

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
      return intl.formatMessage({ id: `timezone ${timezoneKeyword}` }, { tz });
    }
  }
  return intl.formatMessage({ id: `timezone default` }, { tz });
}


function humanizeTimezoneOffset(date: Date) {
  date = new Date(date);
  const timezoneOffset = date.getTimezoneOffset() / -60;
  const timezoneSign = timezoneOffset < 0 ? '-' : '+';
  const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset));
  const timezoneOffsetMinutes = Math.abs(timezoneOffset % 1 * 60);
  return 'GMT'
    + timezoneSign
    + timezoneOffsetHours
    + (timezoneOffsetMinutes ? ':' + timezoneOffsetMinutes : '');
}


export function humanizeUpcomingDate(date: Date | string, intl: any): string {
  dayjs.locale(intl.locale);

  const tz = humanizeTimezoneName(date, intl);
  date = new Date(date);
  const inflectDayDict = {
    [dayjs().day(1)]: intl.formatMessage({ id: 'on_monday' }),
    [dayjs().day(2)]: intl.formatMessage({ id: 'on_tuesday' }),
    [dayjs().day(3)]: intl.formatMessage({ id: 'on_wednesday' }),
    [dayjs().day(4)]: intl.formatMessage({ id: 'on_thursday' }),
    [dayjs().day(5)]: intl.formatMessage({ id: 'on_friday' }),
    [dayjs().day(6)]: intl.formatMessage({ id: 'on_saturday' }),
    [dayjs().day(0)]: intl.formatMessage({ id: 'on_sunday' }),
  };
  let humanizedDate = dayjs(date).calendar(null, {
    nextWeek: intl.formatMessage({ id: 'humanized_date_next_week' }, { tz }),
    nextDay: intl.formatMessage({ id: 'humanized_date_next_day' }, { tz }),
    sameDay: intl.formatMessage({ id: 'humanized_date_same_day' }, { tz }),
    lastDay: intl.formatMessage({ id: 'humanized_date' }, { tz }),
    lastWeek: intl.formatMessage({ id: 'humanized_date' }, { tz }),
    sameElse: intl.formatMessage({ id: 'humanized_date' }, { tz }),
  });
  for (let nominativeDay in inflectDayDict) {
    humanizedDate = humanizedDate.replace(nominativeDay, inflectDayDict[nominativeDay]);
  }
  return humanizedDate;
}


export async function getImageDimensions(imageUrl: string): Promise<{ width: number, height: number }> {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });
    };
    image.onerror = () => {
      resolve({
        width: 0,
        height: 0,
      });
    };
    image.src = imageUrl;
  });
}


export function generateReplyMessageQuote(messageToReplyTo: IMessage, elixirChatWidget: ElixirChatWidget) {
  const { sender, text, attachments } = messageToReplyTo || {};
  if (text) {
    return text.substr(0, 100);
  }
  else if (attachments?.length) {
    return attachments.map(attachment => attachment.name).join(', ');
  }
  else if (!sender?.isOperator) {
    return getUserFullName(sender);
  }
  else {
    return getUserFullName(sender) || elixirChatWidget.widgetTitle;
  }
}


export function fitDimensionsIntoLimits(originalWidth, originalHeight, limitWidth, limitHeight){
  limitWidth = limitWidth || Infinity;
  limitHeight = limitHeight || Infinity;
  const originalRatio = originalWidth / originalHeight;
  const newWidth = Math.min(originalWidth, limitWidth, limitHeight * originalRatio);
  const newHeight = newWidth / originalRatio;
  return [_round(newWidth), _round(newHeight)];
}


export function isWithinElement(target, container){
  if (typeof container === 'string') {
    return Boolean(target.closest('.' + container));
  }
  else if (container instanceof HTMLElement) {
    return container.contains(target) || target === container;
  }
  return false;
}


export function isMobile(){
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


export function exposeComponentToGlobalScope(instance: Component, elixirChatWidget: ElixirChatWidget) {
  elixirChatWidget.widgetComponents[instance.constructor.name] = instance;
}


export function getAvatarColorByUserId(userId: string): string {
  const defaultColor = '#0033FF';
  if (!userId) {
    return defaultColor;
  }
  const idDigits = userId.replace(/[a-z\-_=]/ig, '');
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
    '#273c4f',
  ];
  return colorDict[colorIndex];
}
