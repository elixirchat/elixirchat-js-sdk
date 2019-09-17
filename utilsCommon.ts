export function logEvent(isDebug:boolean = false, message: string, data: any, type?: 'info' | 'error' = 'info'): void {
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
}


export function capitalize(str: string): string {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}


export function randomDigitStringId(idLength: number): string {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
}


type TParseUrl = {
  protocol: string;
  host: string;
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
};

export function parseUrl(url: string): TParseUrl {
  const link = document.createElement('a');
  link.href = url;
  return link;
}


// Lodash-like _.get
export function _get(object: any, path: string, defaultValue?: any): any {
  try {
    return eval('object.' + path);
  }
  catch (e) {
    return defaultValue;
  }
}


// Lodash-like _.omit
export function _omit(object: object, listOfKeys: Array<string>) {
  const newObject = {};
  for (let key in object) {
    if (!listOfKeys.includes(key)) {
      newObject[key] = object[key];
    }
  }
  return newObject;
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

// Similar to Lodash-like _.isEqual but doesn't perform deep comparison (unlike  _.isEqual in Lodash)
export function _isEqualShallow(object1, object2) {
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }
  for (let key in object1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}
