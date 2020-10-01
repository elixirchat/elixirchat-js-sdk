import { Component } from 'react';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';

import { ElixirChatWidget } from './widget/ElixirChatWidget';
import { IMessage } from './sdk/serializers/serializeMessage';
import { _last, _round, getUserFullName } from './utilsCommon';

dayjs.locale('ru');
dayjs.extend(dayjsCalendar);


export function inflect(number: number, endings: [string], hideNumber?: boolean): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const endingIndex = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ Math.min(number % 10, 5) ];
  const ending = endings[endingIndex] || endings[0];
  return hideNumber ? ending : number + ' ' + ending;
}


export function humanizeFileSize(sizeInBytes: number): string {
  const unitsDict = {
    'kb': 'Кб',
    'mb': 'Мб',
    'gb': 'Гб',
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
  return primarySize.toLocaleString('ru-RU') + ' ' + unitsDict[primaryUnit];
}


export function humanizeTimezoneName(date: Date): string {
  date = new Date(date);

  // TODO: Калининград
  // TODO: Украина
  // TODO: Белоруссия
  // TODO: Прибалтика
  // TODO: figure out when to add GMT+00 (e.g. for Eastern Europe)

  const timezoneDict = {
    Moscow: 'по Москве',
    Samara: 'по Самаре',
    Yekaterinburg: 'по Екатеринбургу',
    Novosibirsk: 'по Новосибирску',
    Omsk: 'по Омску',
    Krasnoyarsk: 'по Красноярску',
    Irkutsk: 'по Иркутску',
    Yakutsk: 'по Якутску',
    Vladivostok: 'по Владивостоку',
    Sakhalin: 'по Южно-Сахалинску',
    Magadan: 'по Магадану',
    Kamchat: 'по Петропавловску-Камчатскому',
    Anadyr: 'по Анадырю',
    Tajikistan: 'по Душанбе',
    Turkmenistan: 'по Ашхабаду',
    Uzbekistan: 'по Ташкенту',
    Kyrgyzstan: 'по Бишкеку',
    Azerbaijan: 'по Баку',
    Armenia: 'по Еревану',
    'East Kazakhstan': 'по Алматы',
    'West Kazakhstan': 'по западноказахстанскому времени',
    'Eastern Europe': `по восточноевропейскому времени (${humanizeTimezoneOffset(date)})`
  };
  const timezoneName = date
    .toTimeString()
    .replace(/.*\((.+)\)$/, '$1');

  for (let timezoneKeyword in timezoneDict) {
    if (timezoneName.toLowerCase().includes(timezoneKeyword.toLowerCase())) {
      return timezoneDict[timezoneKeyword];
    }
  }
  return `по вашему времени (${humanizeTimezoneOffset(date)})`;
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
  const inflectDayDict = {
    'понедельник': 'в понедельник',
    'вторник': 'во вторник',
    'среда': 'в среду',
    'четверг': 'в четверг',
    'пятница': 'в пятницу',
    'суббота': 'в субботу',
    'воскресенье': 'в воскресенье',
  };
  let humanizedDate = dayjs(date).calendar(null, {
    nextWeek: 'dddd [в] H:mm',
    nextDay: '[завтра в] H:mm',
    sameDay: '[сегодня в] H:mm',
    lastDay: 'D MMMM [в] H:mm',
    lastWeek: 'D MMMM [в] H:mm',
    sameElse: 'D MMMM [в] H:mm',
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
    return getUserFullName(sender) || elixirChatWidget.widgetMainTitle;
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


// TODO: detect mobile platforms/OS rather than screen size
export function isMobileSizeScreen(){
  return window.innerWidth < 480; // equals to $mobile-max-size from Widget.scss
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
