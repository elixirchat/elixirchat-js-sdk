import assets from './widget/DefaultWidget/assets';

export function inflect(locale: 'en-US' | 'ru-RU', number: number, endings: [string], hideNumber?: boolean): string {
  const getEnding = {};

  getEnding['en-US'] = (number, endings) => {
    return number === 1 ? endings[0] : endings[1];
  };

  getEnding['ru-RU'] = (number, endings) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const endingIndex = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ Math.min(number % 10, 5) ];
    return endings[endingIndex];
  };

  const ending = getEnding[locale](number, endings) || endings[0];
  return hideNumber ? ending : number + ' ' + ending;
}


export function inflectDayJSWeekDays(locale: 'en-US' | 'ru-RU', formattedDateString: string): string {
  if (locale === 'en-US') {
    return formattedDateString;
  }
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
    console.error('Unable to play notification sound before any action was taken by the user');
  }
}


export function generateFontFaceRule(fontFamily: string, fontWeight: string | null, fontUrl: string, format: string): string {
  return `@font-face {
    font-family: "${fontFamily}";
    ${fontWeight ? `font-weight: ${fontWeight};` : ''}
    src: url("${fontUrl}") format("${format}");
  }`;
}


export function getHumanReadableFileSize(locale: 'ru-RU' | 'en-US', sizeInBytes: number): string {
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
      isSmooth: boolean;
      position: string;
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
      const intersectionObserver = new IntersectionObserver(function(entries) {
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
