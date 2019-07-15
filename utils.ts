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



export const css = (template, ...variables) => {
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
    // console.warn('___ append to', elementToAppendTo, '//', element);
  }
  return element;
};
