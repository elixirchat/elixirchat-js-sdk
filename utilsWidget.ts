import { Component } from 'react';
import { ElixirChatWidget } from './widget/ElixirChatWidget';
import {_last, _round, getUserFullName} from './utilsCommon';
import assets from './widget/DefaultWidget/assets';

import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/ru';

dayjs.locale('ru');
dayjs.extend(dayjsCalendar);



export function inflect(number: number, endings: [string], hideNumber?: boolean): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const endingIndex = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ Math.min(number % 10, 5) ];
  const ending = endings[endingIndex] || endings[0];
  return hideNumber ? ending : number + ' ' + ending;
}

/**
 * Prevents browser from muting audio autoplay
 * @see https://medium.com/@curtisrobinson/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
 */
export function unlockNotificationSoundAutoplay(e: Event): void {
  const notification = new Audio(assets.notificationSound);
  notification.play().then(() => {
    notification.pause();
    notification.currentTime = 0;
  });

  if (e.target.tagName !== 'TEXTAREA') { // In Firefox, click on textarea doesn't unlock autoplay
    e.currentTarget.removeEventListener(e.type, unlockNotificationSoundAutoplay);
  }
}

export function playNotificationSound(): void {
  const notification = new Audio(assets.notificationSound);
  try {
    notification.play();
  }
  catch (e) {
    console.error('Unable to play notification sound before any action was taken by the user in the current browser tab');
  }
}


export interface IGenerateFontFaceRule {
  (
    fontFamily: string,
    fontWeight: string | null,
    fontStyle: string | null,
    fontUrl: string,
    format: string
  ): string
}


export function generateSvgIconsCSS(iconClassNamePrefix: string, iconMap: object): string {
  const iconsCSSArr = [];
  for (let iconName in iconMap) {
    const iconUrl = iconMap[iconName];
    iconsCSSArr.push(
      `.${iconClassNamePrefix}${iconName} { background-image: url("${iconUrl}"); }`
    );
  }
  return iconsCSSArr.join('\n');
}


export function base64toBlobUrl(base64Url: string, sliceSize: number = 512): string {
  const [ dataUrlPrefix, base64Data ] = base64Url.trim().split(',');
  const contentType = dataUrlPrefix.replace(/data:\s*/, '').replace(/s*;s*base64s*/, '');
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return URL.createObjectURL(blob);
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


export function generateReplyMessageQuote(messageToReplyTo, elixirChatWidget: ElixirChatWidget) {
  const { sender, text } = messageToReplyTo || {};
  if (text) {
    return text.substr(0, 100);
  }
  else if (!sender?.isOperator) {
    return getUserFullName(sender);
  }
  else {
    return getUserFullName(sender) || elixirChatWidget.widgetMainTitle;
  }
}


export function replaceMarkdownWithHTML(markdown){
  markdown = '\n\n' + (markdown || '') + '\n\n';

  const allExtractedHtml = [];
  const handleHtmlReplacement = (match) => {
    allExtractedHtml.push(match);
    const currentHtmlIndex = allExtractedHtml.length - 1;
    return `◆◆◆${currentHtmlIndex}◆◆◆`;
  };

  return markdown
  // Temporarily replace all HTML (e.g. links) with placeholders surrounded by '◆◆◆'
    .replace(/<[a-z]+[^>]*>[^<]*<\/[a-z]+>/igm, match => handleHtmlReplacement(match))

    // Font formatting <b> & <i>
    .replace(/_(?=[^ ])([^_\n]+)(?=[^ ])_/igm, '<i>$1</i>')
    .replace(/\*(?=[^ ])([^\*\n]+)(?=[^ ])\*/igm, '<b>$1</b>')

    // <ul> / <ol> - replacing leading spaces before list items
    .replace(/\n\s*\*/gm, '\n*')
    .replace(/\n\s*(\d)\./gm, '\n$1.')

    // Unordered list <ul>
    .replace(/^\*\s+([^\n]+)\n/gm, '<li>$1</li>')
    .replace(/([^>])<li>/gm, '$1<ul><li>')
    .replace(/<\/li>([^<])/gm, '</li></ul>$1')

    // Ordered list <ol>
    .replace(/^\d+\.\s+([^\n]+)\n/gm, '<li>$1</li>')
    .replace(/([^>])<li>/gm, '$1<ol><li>')
    .replace(/<\/li>([^<])/gm, '</li></ol>$1')

    // Paragraph <p>
    .replace(/^\s*(\n)?(.+)/igm, function(match){
      return  /<(\/)?(ul|ol|li|a)/.test(match) ? match : `<p>\n ${match.trim()} \n</p>`;
    })

    // Put back <a href...> HTML (that was extracted on the first step)
    .replace(/◆◆◆([0-9]+)◆◆◆/igm, (match, index) => {
      return allExtractedHtml[+index];
    })
    .trim();
}


export function replaceLinksInText(text){
  text = ' ' + (text || '') + ' ';

  // For all existing non-country domain zones, see https://gist.github.com/egorvinogradov/d7d946a06e680d79723f12f4a1c697a7#file-all-non-country-domains-txt
  const top50NonCountryDomains = ['com', 'org', 'net', 'info', 'xyz', 'biz', 'club', 'online', 'pro', 'site', 'top', 'edu', 'shop', 'live', 'cat', 'gov', 'blog', 'asia', 'store', 'mobi', 'space', 'tech', 'website', 'app', 'news', 'life', 'fun', 'world', 'icu', 'vip', 'today', 'work', 'tokyo', 'media', 'one', 'travel', 'agency', 'guru', 'cloud', 'name', 'coop', 'xxx', 'design', 'win', 'global', 'link', 'nyc', 'digital', 'network', 'studio', 'chat'];
  const topTwoLetterFileExtensions = ['js', 'db', 'cs', 'rm'];
  const allExtractedUrls = [];

  const fullUrlRe = /\b_?(?:https?|ftp):\/\/[a-z0-9\-\.]+\.([a-z]{2,10})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  const localhostRe = /\b_?(?:http):\/\/([a-z0-9\-]+)(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  const ipAddressRe = /\b_?(?:https?):\/\/((?:[0-9]{1,3}\.?){4})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  const countryDomainRe = /\b_?[a-z0-9\-\.]+\.([a-z]{2})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?(?![a-z])_?/igm;
  const nonCountryDomainRe = /\b_?[a-z0-9\-\.]+\.([a-z]{3,10})(?::[0-9]{4,5})?(?:\/[a-zа-я0-9\-_\/\.?&%=#+;:,!~]*)?_?/igm;
  const emailAddressRe = /\b_?[a-z0-9\.\-_+]+@[a-z0-9\.\-]+_?/igm;

  const handleLinkReplacement = (match, offset, urlPrefix = '') => {
    let isWrappedWithUnderscore = false;
    if (match[0] === '_' && match[match.length - 1] === '_') {
      isWrappedWithUnderscore = true;
      match = match.replace(/^_/, '').replace(/_$/, '');
    }
    let [ urlWithoutTrailingHtmlEntities, trailingHtmlEntities = '' ] = match
      .replace(/(&quot;|&lt;|&gt;)/, '◆◆◆$1')
      .split('◆◆◆');
    let [ urlWithoutTrailingSymbols, trailingSymbols = '' ] = urlWithoutTrailingHtmlEntities
      .replace(/([^a-zа-я0-9\-_\/=]+)$/ig, '◆◆◆$1')
      .split('◆◆◆');

    allExtractedUrls.push(urlWithoutTrailingSymbols);
    const urlIndex = allExtractedUrls.length - 1;

    // Temporarily replace all URLs with placeholders surrounded by '◆◆◆'
    return (isWrappedWithUnderscore ? '_' : '')
      + `◆◆◆${urlIndex}|${urlPrefix}◆◆◆`
      + trailingSymbols
      + trailingHtmlEntities
      + (isWrappedWithUnderscore ? '_' : '');
  };

  return text
    .replace(fullUrlRe, (match, topLevelDomain, offset) => handleLinkReplacement(match, offset))
    .replace(ipAddressRe, (match, topLevelDomain, offset) => handleLinkReplacement(match, offset))
    .replace(localhostRe, (match, topLevelDomain, offset) => handleLinkReplacement(match, offset))
    .replace(emailAddressRe, (match, topLevelDomain, offset) => handleLinkReplacement(match, offset, 'mailto:'))
    .replace(nonCountryDomainRe, (match, topLevelDomain, offset) => {
      return top50NonCountryDomains.includes(topLevelDomain.toLowerCase())
        ? handleLinkReplacement(match, offset, 'http://')
        : match;
    })
    .replace(countryDomainRe, (match, topLevelDomain, offset) => {
      return !topTwoLetterFileExtensions.includes(topLevelDomain.toLowerCase())
        ? handleLinkReplacement(match, offset, 'http://')
        : match;
    })

    // Put back URLs (that was extracted on the first step)
    .replace(/◆◆◆([0-9]+)\|([^◆]*)◆◆◆/igm, (match, index, urlPrefix) => {
      const currentUrl = allExtractedUrls[+index];
      return `<a rel="noreferrer noopener" target="_blank" href="${urlPrefix}${currentUrl}">${currentUrl}</a>`;
    })
    .trim();
}


export function sanitizeHTML(html){
  html = html || '';
  return html
    .replace(/</gm, '&lt;')
    .replace(/>/gm, '&gt;')
    .replace(/"/gm, '&quot;')
    .replace(/'/gm, '&apos;')
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


export function exposeComponentToGlobalScope(name: string, instance: Component, elixirChatWidget: ElixirChatWidget) {
  // Can't simply use instance.constructor.name for the name due to bundler obfuscation; must pass name explicitly
  elixirChatWidget.widgetComponents[name] = instance;
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
