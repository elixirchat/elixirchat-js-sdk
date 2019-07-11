type handleAPIErrorParams = {
  e: any,
  query?: string,
  variables?: Array<any>
  isGraphQL: boolean
};

export function handleAPIError({ e = {}, query = '', variables = [], isGraphQL = false }: handleAPIErrorParams){
  let args = variables.length ? Array.from(variables) : [];
  console.error(
    `%cElixirChat: ${isGraphQL ? 'GraphQL' : 'API'} returned an error`, 'font-weight: bold',
    '\n   Error:', e,
    '\n   Arguments:', args,
    isGraphQL ? '\n   Query: ' + query : ''
  );
}

export function logEvent(isDebug: boolean = false, message: string, data?: any, type: 'info' | 'error' = 'info'){
  if (isDebug) {
    const output = [`%cElixirChat: ${message}`, 'font-weight: bold', '\n   Data:', data];
    if (type === 'error') {
      console.error(...output);
    }
    else {
      console.log(...output);
    }
  }
}

export function capitalize(str){
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}
