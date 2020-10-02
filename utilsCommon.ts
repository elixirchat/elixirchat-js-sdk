import { IUser } from './sdk/serializers/serializeUser';


export function randomDigitStringId(idLength: number): string {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
}


// Lodash-like _.upperFirst
export function _upperFirst(str: string): string {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}


// Lodash-like _.last
export function _last(arr: Array | string): any {
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


// Lodash-like _.find
export function _find(arr: Array, validation: Function | object, returnIndex: boolean): any {
  if (!arr?.length || !validation) {
    return [];
  }
  const isValidItem = typeof validation === 'function'
    ? validation
    : (item) => {
      for (let key in validation) {
        if (validation[key] !== item[key]) {
          return false;
        }
      }
      return true;
    };
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (isValidItem(item)) {
      return returnIndex ? i : item;
    }
  }
}


// Lodash-like _.findIndex
export function _findIndex(arr: Array, validation: Function | object) {
  return _find(arr, validation, true);
}


// Lodash-like _.uniq
export function _uniq(arr: Array): Array {
  const uniqueItemsTable = {};
  return arr.filter(item => {
    if (!uniqueItemsTable[item]) {
      uniqueItemsTable[item] = true;
      return true;
    }
    return false;
  });
}


// Lodash-like _.uniqBy
export function _uniqBy(arr: Array, propFunction: Function | string): Array {
  const uniqueItemsTable = {};
  const getPropValue = typeof propFunction === 'string'
    ? (item) => item[propFunction]
    : propFunction;

  return arr.filter(item => {
    const propValue = getPropValue(item);
    if (!uniqueItemsTable[propValue]) {
      uniqueItemsTable[propValue] = true;
      return true;
    }
    return false;
  });
}


// Simple template engine. Example: template('Hello {{a}} {{b}}', { a: 'foo', bar: 'b' })
export function template(str: string, dict: object) {
  return (str || '').toString().replace(/{{\s*([a-z0-9]+)\s*}}/ig, (match, key) => {
    return dict[key] || '';
  });
}


export function detectBrowser(): 'opera' | 'chrome' | 'safari' | 'firefox' | 'ie' | null {
  const userAgentKeywords = { // do not change order of keywords
    'Opera': 'opera',
    'Chrome': 'chrome',
    'Safari': 'safari',
    'Firefox': 'firefox',
    'MSIE': 'ie',
  };
  for (let keyword in userAgentKeywords) {
    if (navigator.userAgent.indexOf(keyword) > -1) {
      return userAgentKeywords[keyword];
    }
  }
  return null;
}


export function detectPlatform(): { isWindows: boolean, isMac: boolean } {
  return {
    isWindows: navigator.platform.indexOf('Win') > -1,
    isMac: navigator.platform.indexOf('Mac') > -1,
  };
}


export function getFromLocalStorage(key: string, defaultValue: any = ''): any {
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


export function setToLocalStorage(key: string, data: any){
  localStorage.setItem(key, JSON.stringify(data));
}


export function getMediaType(mimeType: string): string | null {
  if ( ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(mimeType.toLowerCase()) ) {
    return 'image';
  }
  else if ( mimeType.toLowerCase().trim() === 'video/mp4' ) {
    return 'video';
  }
  return null;
}


export function getUserFullName(user: IUser, separator: string = ' ') :string {
  const firstName = (user?.firstName || '').trim();
  const lastName = (user?.lastName || '').trim();
  return [firstName, lastName].filter(word => word).join(separator);
}


export function parseFullName(fullName: string): { firstName: string, lastName: string } {
  const [ firstName, lastName ] = (fullName || '').trim().replace(/\s+/, '◆◆◆').split('◆◆◆');
  return {
    firstName: firstName || '',
    lastName: lastName || '',
  };
}


export function extractSerializedData(data: any, defaultValues: object): object {
  const serializedData = {};
  for (let key in defaultValues) {
    serializedData[key] = data?.[key] || defaultValues[key];
  }
  return serializedData;
}


export function normalizeErrorStack(errorStackString: string, maxLines?: number): string {
  return (errorStackString || '')
    .trim()
    .replace(/^Error\n\s*/, '')
    .split(/\n/)
    .map(row => row.trim())
    .filter(row => row)
    .slice(0, maxLines || undefined)
    .join('\n');
}


// Simple non-secure hash function (implementation of Java's String.hashCode() method)
export function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}


// Same as https://www.npmjs.com/package/classnames but lightweight
export function cn(...args){
  if (typeof args[0] === 'object') {
    const classNameArr = [];
    for (let className in args[0]) {
      if ( args[0][className] ) {
        classNameArr.push(className);
      }
    }
    return classNameArr.join(' ');
  }
  else {
    return args.join(' ');
  }
}


export function parseGETParams(getParamsString){
  const params = {};
  if (!getParamsString.trim()) {
    return {};
  }
  getParamsString
    .replace(/^#?\??/, '')
    .split('&')
    .forEach(param => {
      const [ key, value ] = param.split('=');
      params[key] = value;
    });
  return params;
}
