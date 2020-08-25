import assets from './widget/DefaultWidget/assets';
import { _round } from './utilsCommon';

export function inflect(locale: 'en-US' | 'ru-RU', number: number, endings: [string], hideNumber?: boolean): string {
  const getEnding = {
    'en-US': (number, endings) => {
      return number === 1 ? endings[0] : endings[1];
    },
    'ru-RU': (number, endings) => {
      const cases = [2, 0, 1, 1, 1, 2];
      const endingIndex = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ Math.min(number % 10, 5) ];
      return endings[endingIndex];
    }
  };
  const ending = getEnding[locale](number, endings) || endings[0];
  return hideNumber ? ending : number + ' ' + ending;
}


export function inflectDayJSWeekDays(locale: 'en-US' | 'ru-RU', formattedDateString: string): string {
  if (locale === 'en-US') {
    return formattedDateString;
  }
  // TODO: check out the proper way to customize date string in dayjs
  let updatedFormattedDateString = formattedDateString;
  const reDictRu = {
    'в понедельник': 'в понедельник',
    'в вторник': 'во вторник',
    'в среда': 'в среду',
    'в четверг': 'в четверг',
    'в пятница': 'в пятницу',
    'в суббота': 'в субботу',
    'в воскресенье': 'в воскресенье',
  };
  for (let key in reDictRu) {
    const regex = new RegExp(key, 'ig');
    updatedFormattedDateString = updatedFormattedDateString.replace(regex, reDictRu[key]);
  }
  return updatedFormattedDateString;
}


export function getTimezoneNameByDate(locale: 'en-US' | 'ru-RU', date){

}


/**
 * Prevents browser from muting audio autoplay
 * @see https://medium.com/@curtisrobinson/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
 */
export function unlockNotificationSoundAutoplay(e): void {
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

export function generateFontFaceRule(fontFamily, fontWeight, fontStyle, fontUrl): IGenerateFontFaceRule {
  const { contentType, data } = parseBase64DataUrl(fontUrl);
  const fontBlobUrl = base64toBlobUrl(data, contentType);

  return `@font-face {
    font-family: "${fontFamily}";
    ${fontWeight ? `font-weight: ${fontWeight};` : ''}
    ${fontStyle ? `font-style: ${fontStyle};` : ''}
    src: url("${fontBlobUrl}") format("woff");
  }`;
}


export function generateSVGIcons(iconsHashMap): string {
  const iconsCSSArr = [];
  for (let iconName in iconsHashMap) {
    const iconBase64Url = iconsHashMap[iconName];
    const { contentType, data } = parseBase64DataUrl(iconBase64Url);
    const iconBlobUrl = base64toBlobUrl(data, contentType);
    iconsCSSArr.push(
      `.svg-icon-${iconName} { background-image: url("${iconBlobUrl}"); }`
    );
  }
  return iconsCSSArr.join('\n');
}


export function base64toBlobUrl(base64Data, contentType = '', sliceSize = 512): string {
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


export function parseBase64DataUrl(base64Url) {
  const [ prefix, data ] = base64Url.trim().split(',');
  const contentType = prefix.replace(/data:\s*/, '').replace(/s*;s*base64s*/, '');
  return { contentType, data };
}


export function getHumanReadableFileSize(locale: 'en-US' | 'ru-RU', sizeInBytes: number): string {
  const unitsDict = {
    'ru-RU': {
      'kb': 'Кб',
      'mb': 'Мб',
      'gb': 'Гб',
    },
    'en-US': {
      'kb': 'Kb',
      'mb': 'Mb',
      'gb': 'Gb',
    },
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
  return primarySize.toLocaleString(locale) + ' ' + unitsDict[locale || 'en-US'][primaryUnit];
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


export interface IScrollToElement {
  (
    element: HTMLElement,
    options: {
      isSmooth: boolean;  // same as native Element.scrollIntoView({ behavior: 'smooth' })
      position: string;   // same as native Element.scrollIntoView({ block: ... })
    },
    callback: () => {}
  ): void
}

export function scrollToElement(element, options = {}, callback = () => {}): IScrollToElement {
  const { isSmooth, position } = options;

  if (element && element.tagName) {
    element.scrollIntoView({
      behavior: isSmooth ? 'smooth' : 'auto',
      block: position || 'center',
    });

    if (typeof IntersectionObserver !== 'undefined') {
      const intersectionObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          intersectionObserver.unobserve(element);
          callback();
        }
      });
      intersectionObserver.observe(element);
    }
    else {
      setTimeout(() => {
        callback && callback();
      }, 300); // default callback timeout for browsers not supporting IntersectionObserver
    }
  }
}


export function generateCustomerSupportSenderName(message, widgetTitle) {
  const { firstName, lastName } = message.sender || {};
  if (firstName || lastName) {
    return [firstName, lastName].join(' ');
  }
  else {
    return widgetTitle;
  }
}


export function generateReplyMessageQuote(messageToReplyTo, widgetTitle) {
  const { sender = {}, text = '' } = messageToReplyTo || {};
  const { firstName, lastName } = sender;

  if (text) {
    return text.substr(0, 100);
  }
  else if (!sender.isOperator) {
    return [firstName, lastName].join(' ');
  }
  else {
    return generateCustomerSupportSenderName(messageToReplyTo, widgetTitle);
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


export function isMobileSizeScreen(){
  return window.innerWidth < 480; // equals to $mobile-max-size from Widget.scss
}
