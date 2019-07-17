export interface ILogEvent {
  (
    isDebug: boolean,
    message: string,
    data: object | Array<[string, any]> | null,
    type?: 'info' | 'error',
  ): void;
}

export const logEvent: ILogEvent = (isDebug = false, message, data, type = 'info') => {
  if (isDebug && window.console) {
    const color = type === 'error' ? '#EB3223;' : '';
    const messageConsoleStyles = `
       font-weight: bold;
       color: ${color}
    `;
    const infoButtonConsoleStyles = `
      font-weight: normal;
      text-decoration: underline;
      color: ${color}
    `;
    const arrowConsoleStyles = `
      font: 10px Arial;
      padding-left: 3px;
      color: ${color}
    `;
    const additionalDataConsoleStyles = `font-weight: bold;`;

    console.groupCollapsed(`%cElixirChat: ${message} %cInfo%c▾`, messageConsoleStyles, infoButtonConsoleStyles, arrowConsoleStyles);
    if (typeof data === 'object' && !(data instanceof Array)) {
      Object.keys(data).forEach(key => {
        console.log(`%c${key}:\n`, additionalDataConsoleStyles, data[key], '\n');
      });
    }
    else {
      console.log('%c\nData:\n', additionalDataConsoleStyles, data);
    }
    console.log('%c\nStacktrace:', additionalDataConsoleStyles);
    console.trace();
    console.groupEnd();
  }
};


export interface ICapitalize {
  (str: string) : string;
}

export const capitalize: ICapitalize = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
};


export interface ICss {
  (template: Array<string>, variables: Array<string>): string
}

export const css: ICss = (template, ...variables) => {
  return template.map((fragment, i) => {
    return fragment + (variables[i] || '');
  }).join('');
};


export interface IInsertElement {
  (tagName: string, attributes?: any, elementToAppendTo?: HTMLElement): HTMLElement
}

export const insertElement: IInsertElement = (tagName, attributes, elementToAppendTo) => {
  const element = document.createElement(tagName);
  if (typeof attributes === 'object') {
    for (let key in attributes) {
      element[key] = attributes[key];
    }
  }
  if (elementToAppendTo) {
    elementToAppendTo.appendChild(element);
  }
  return element;
};


export interface IInflect {
  (locale: 'en-US' | 'ru-RU', number: number, endings: Array<string>, hideNumber?: boolean): string
}

export const inflect: IInflect = (locale, number, endings, hideNumber = false) => {
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
};


export interface IRandomDigitStringId {
  (idLength: number): string;
}

export const randomDigitStringId: IRandomDigitStringId = (idLength) => {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
};


export interface IPlayNote {
  (frequency: number, fadingOutDuration: number): void;
}

export const playTone: IPlayNote = (frequency, fadingOutDuration = 1) => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.connect(gain);
  oscillator.frequency.value = frequency;
  gain.connect(context.destination);
  oscillator.start(0);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + fadingOutDuration);
  setTimeout(() => {
    oscillator.stop();
  }, fadingOutDuration * 1000);
};


export interface IPlayNotificationSound {
  (): void
}

export const playNotificationSound: IPlayNotificationSound = () => {
  playTone(830.6, 0.9); // La (A)
  setTimeout(() => {
    playTone(440.0, 1.5); // Sol (G#)
  }, 150);
};
