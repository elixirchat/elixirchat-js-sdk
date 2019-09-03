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
