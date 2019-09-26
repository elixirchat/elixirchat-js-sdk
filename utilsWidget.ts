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

  // function _base64ToArrayBuffer(base64) {
  //   var binary_string =  window.atob(base64);
  //   var len = binary_string.length;
  //   var bytes = new Uint8Array( len );
  //   for (var i = 0; i < len; i++)        {
  //     bytes[i] = binary_string.charCodeAt(i);
  //   }
  //   return bytes.buffer;
  // }
  //
  //
  // window.AudioContext = window.AudioContext || window.webkitAudioContext;
  // window.context = new AudioContext();
  //
  // window.playSound = (buffer) => {
  //   var source = context.createBufferSource(); // creates a sound source
  //   source.buffer = buffer;                    // tell the source which sound to play
  //   source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  //   source.start(0);                           // play the source now
  // }



  window.addEventListener('load', init, false);
  function init() {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      context = new AudioContext();
      console.log('___ context', context);
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }
  }



  console.log('___ unlock 000', e.target, '---', e.currentTarget, '--', e.type);

  const notification = new Audio(assets.notificationSound);
  // notification.autoplay = true;
  notification.play();
  // notification.pause();
  // notification.currentTime = 0;
  // e.currentTarget.removeEventListener(e.type, unlockNotificationSoundAutoplay);
}

export function playNotificationSound(): void {
  const notification = new Audio(assets.notificationSound);
  notification.autoplay = true;
  notification.play();
}


export function generateFontFaceRule(fontFamily: string, fontWeight: string | null, fontUrl: string): string {
  return `@font-face {
    font-family: "${fontFamily}";
    ${fontWeight ? `font-weight: ${fontWeight};` : ''}
    src: url("${fontUrl}") format("woff");
  }`;
}


export function isWebImage(mimeType: string): boolean {
  return ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(mimeType.toLowerCase());
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


export async function getImageDimensions(imageUrl) {
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
