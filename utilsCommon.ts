export function logEvent(isDebug:boolean = false, message: string, data: any, type?: 'info' | 'event' | 'error' = 'info'): void {
  if (isDebug && window.console) {
    let color = '';
    if (type === 'error') {
      color = '#EB3223';
    }
    else if (type === 'event') {
      color = /_ERROR$/i.test(message) ? '#eba4a7' : '#5ee9eb';
    }
    const messageConsoleStyles = `
       font-weight: bold;
       color: ${color};
    `;
    const infoButtonConsoleStyles = `
      font-weight: normal;
      text-decoration: underline;
      color: ${color};
    `;
    const arrowConsoleStyles = `
      font: 10px Arial;
      padding-left: 3px;
      color: ${color};
    `;
    const additionalDataConsoleStyles = `font-weight: bold;`;

    console.groupCollapsed(`%cElixirChat: ${message} %cInfo%c▾`, messageConsoleStyles, infoButtonConsoleStyles, arrowConsoleStyles);

    if (type === 'error') {
      console.error(data);
    }
    else if (data && typeof data === 'object' && !(data instanceof Array)) {
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
}


export function capitalize(str: string): string {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}


export function randomDigitStringId(idLength: number): string {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
}


// Lodash-like _.get
export function _get(object: any, path: string, defaultValue?: any): any {
  const prefix = /^\[/i.test(path) ? 'object' : 'object.';
  try {
    return eval(prefix + path);
  }
  catch (e) {
    return defaultValue;
  }
}


// Lodash-like _.merge
export function _merge(object1: object, object2: object): object {
  const mergedObject = {};
  for (let a in object1) {
    mergedObject[a] = object1[a];
  }
  for (let b in object2) {
    if (object2[b]) {
      mergedObject[b] = object2[b];
    }
  }
  return mergedObject;
}


// Lodash-like _.last
export function _last(arr: Array): any {
  return arr[arr.length - 1];
}


// Lodash-like _.round
export function _round(num: number): number {
  return +num.toFixed(2);
}


// Lodash-like _.flatten
export function _flatten(arr: Array): Array {
  let flattenedArray = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item instanceof Array) {
      flattenedArray = flattenedArray.concat(item);
    }
    else {
      flattenedArray.push(item);
    }
  }
  return flattenedArray;
}


export function detectPlatform(): { isWindows: boolean, isMac: boolean } {
  return {
    isWindows: navigator.platform.indexOf('Win') > -1,
    isMac: navigator.platform.indexOf('Mac') > -1,
  };
}


export function getJSONFromLocalStorage(key: string, defaultValue: any = ''): any {
  let value = defaultValue;
  try {
    value = JSON.parse(localStorage.getItem(key));
    if (value === null) {
      value = defaultValue;
    }
  }
  catch (e) {}
  return value;
}


export function isWebImage(mimeType: string): boolean {
  return ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(mimeType.toLowerCase());
}
