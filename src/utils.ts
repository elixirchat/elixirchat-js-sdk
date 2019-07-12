export interface IHandleAPIError {
  (
    params: {
      error: any;
      variables?: any;
      graphQlQuery: string;
    }
  ) : void;
}

export const handleAPIError: IHandleAPIError = ({ error = {}, graphQlQuery = '', variables = [] }) => {
  const errorData = [
    ['Error', error],
    ['Variables', variables],
    ['GraphQL Query', graphQlQuery || false],
  ];
  logEvent(true, `${graphQlQuery ? 'GraphQL' : 'API'} returned an error`, errorData, 'error')
};


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
    if (data instanceof Array) {
      data.forEach(([title, value]) => {
        console.log(`%c${title}:\n`, additionalDataConsoleStyles, value, '\n');
      })
    }
    else {
      console.log('%c\nData:\n', additionalDataConsoleStyles, data);
    }
    console.log('%c\nStacktrace:', additionalDataConsoleStyles);
    console.trace();
    console.groupEnd();
  }
};


interface ICapitalize {
  (str: string) : string;
}

export const capitalize: ICapitalize = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
};
