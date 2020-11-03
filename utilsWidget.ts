import { Component } from 'react';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';

import { ElixirChatWidget } from './widget/ElixirChatWidget';
import { IMessage } from './sdk/serializers/serializeMessage';
import { _last, _round, getUserFullName } from './utilsCommon';
import { i18n, i18nUtils } from './widget/DefaultWidget/i18n';

dayjs.extend(dayjsCalendar);


export function humanizeFileSize(sizeInBytes: number): string {
  const unitsDict = {
    kb: i18n.unit_kb,
    mb: i18n.unit_mb,
    gb: i18n.unit_gb,
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
  return primarySize.toLocaleString(i18nUtils.selectedLanguage) + ' ' + unitsDict[primaryUnit];
}


export function humanizeTimezoneName(date: Date): string {
  date = new Date(date);

  const timezoneDict = {
    Moscow: i18n.timezone_moscow,
    Samara: i18n.timezone_samara,
    Yekaterinburg: i18n.timezone_yekaterinburg,
    Novosibirsk: i18n.timezone_novosibirsk,
    Omsk: i18n.timezone_omsk,
    Krasnoyarsk: i18n.timezone_krasnoyarsk,
    Irkutsk: i18n.timezone_irkutsk,
    Yakutsk: i18n.timezone_yakutsk,
    Vladivostok: i18n.timezone_vladivostok,
    Sakhalin: i18n.timezone_sakhalin,
    Magadan: i18n.timezone_magadan,
    Kamchat: i18n.timezone_kamchatka,
    Anadyr: i18n.timezone_anadyr,
    Tajikistan: i18n.timezone_tajikistan,
    Turkmenistan: i18n.timezone_turkmenistan,
    Uzbekistan: i18n.timezone_uzbekistan,
    Kyrgyzstan: i18n.timezone_kyrgyzstan,
    Azerbaijan: i18n.timezone_azerbaijan,
    Armenia: i18n.timezone_armenia,
    'East Kazakhstan': i18n.timezone_east_kazakhstan,
    'West Kazakhstan': i18n.timezone_west_kazakhstan,
    'Eastern Europe': `${i18n.timezone_eastern_europe} (${humanizeTimezoneOffset(date)})`
  };
  const timezoneName = date
    .toTimeString()
    .replace(/.*\((.+)\)$/, '$1');

  for (let timezoneKeyword in timezoneDict) {
    if (timezoneName.toLowerCase().includes(timezoneKeyword.toLowerCase())) {
      return timezoneDict[timezoneKeyword];
    }
  }
  return `${i18n.timezone_custom} (${humanizeTimezoneOffset(date)})`;
}


export function humanizeTimezoneOffset(date: Date) {
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


export function humanizeUpcomingDate(date: Date | string): string {
  date = new Date(date);

  dayjs.locale(i18nUtils.selectedLanguage);

  let humanizedDate = dayjs(date).calendar(null, {
    nextWeek: i18n.upcoming_date_next_week,
    nextDay: i18n.upcoming_date_next_day,
    sameDay: i18n.upcoming_date_same_day,
    lastDay: i18n.upcoming_date_default,
    lastWeek: i18n.upcoming_date_default,
    sameElse: i18n.upcoming_date_default,
  });
  for (let nominativeDay in i18n.upcoming_weekday_inflection_dict) {
    humanizedDate = humanizedDate.replace(nominativeDay, i18n.upcoming_weekday_inflection_dict[nominativeDay]);
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
    return getUserFullName(sender) || i18n.caption_main;
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
