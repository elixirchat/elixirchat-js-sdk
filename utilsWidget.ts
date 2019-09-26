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


export function playNotificationSound(): void {
  const context = new AudioContext();
  const filter = context.createBiquadFilter();
  filter.type = 'notch';
  filter.frequency.value = 780;
  filter.Q.value = 1.5;
  filter.connect(context.destination);

  const gain1 = context.createGain();
  gain1.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1);
  gain1.connect(filter);

  const tone1 = context.createOscillator();
  tone1.frequency.value = 830.6;
  tone1.connect(gain1);
  tone1.start(0);
  tone1.stop(1.65);

  const gain2 = context.createGain();
  gain2.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.5);
  gain2.connect(filter);

  const tone2 = context.createOscillator();
  tone2.frequency.value = 440;
  tone2.connect(gain2);
  tone2.start(0.15);
  tone2.stop(1.65);
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
