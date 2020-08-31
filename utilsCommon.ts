export function capitalize(str: string): string {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}


export function randomDigitStringId(idLength: number): string {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
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

export function isVideoConvertibleIntoMp4(mimeType){
  const supportedTypes = [
    'video/mp4',
    'video/x-msvideo',
    'video/vnd.avi',
    'video/avi',
    'video/msvideo',
    'video/quicktime',
    'video/x-ms-wmv',
    'video/x-ms-asf',
    'video/webm',
    'video/x-matroska',
    'video/x-flv',
    'video/dvd',
    'video/mpeg',
    'video/x-ms-vo',
    'video/ogg',
    'video/mp2t',
    'video/x-m4v',
  ];
  return supportedTypes.includes(mimeType.toLowerCase().trim());
}

export function trimEachRow(text: string): string {
  return text.split(/\n/).map(row => row.trim()).join('\n');
}

export function extractSerializedData(data: any, defaultValues: object): object {
  const serializedData = {};
  for (let key in defaultValues) {
    serializedData[key] = data?.[key] || defaultValues[key];
  }
  return serializedData;
}
