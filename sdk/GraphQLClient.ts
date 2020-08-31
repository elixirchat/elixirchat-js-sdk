export interface IGraphQLClientConfig {
  url: string;
  token?: string;
}

export class GraphQLClient {
  public url: string;
  public token?: string;
  public headers: any = {
    'Accept': 'application/json',
  };

  public initialize = ({ url, token }: IGraphQLClientConfig): void => {
    this.url = url;
    this.token = token;
    if (this.token) {
      this.headers.Authorization = `Bearer ${this.token}`;
    }
  };

  public query(query: string, variables: object, binaryFiles: object): Promise<any> {
    let headers;
    let body;
    variables = variables || {};

    if (binaryFiles) {
      body = this.makeFormData(query, variables, binaryFiles);
      headers = this.headers;
    }
    else {
      body = JSON.stringify({ query, variables });
      headers = {
        ...this.headers,
        'Content-Type': 'application/json',
      }
    }

    return fetch(this.url, {
      method: 'POST',
      headers,
      body,
    })
      .then(response => response.json())
      .then(response => {
        if (response.errors || !response.data) {
          throw response;
        }
        else {
          return response.data;
        }
      });
  }

  private makeFormData(query: string, variables: object, binaryFiles?: object): FormData {
    const formData = new FormData();
    formData.append('query', query);
    formData.append('variables', JSON.stringify(variables));

    for (let fileName in binaryFiles) {
      formData.append(fileName, binaryFiles[fileName]);
    }
    return formData;
  };
}


export function simplifyGraphQLJSON(graphQLJSON: { edges: Array<any> }): Array<any> {
  if (!graphQLJSON?.edges?.length) {
    return [];
  }
  return graphQLJSON.edges.map(data => ({
    ...data.node,
    cursor: data.cursor,
  }));
}


/**
 * When used like this:
 *  @example gql`some string`
 * it simply returns its argument i.e. "some string"
 *
 * It's only designed to trigger WebStorm Plugin "JS GraphQL" highlight strings as graphql queries
 */
export function gql(queryParts: Array<string>, ...variables: Array<any>): string {
  let str = '';
  for (let i = 0; i < queryParts.length; i ++) {
    str += queryParts[i] + (variables[i] || '');
  }
  return str;
}


export function insertGraphQlFragments(query: string, fragments: object = {}): string {
  let fragmentsString = '';
  for (let name in fragments) {
    fragmentsString += fragments[name];
  }
  return query + fragmentsString;
}


export function parseGraphQLMethodFromQuery(query: string): string {
  try {
    return query.trim()
      .replace(/(\([^\)]*\))/ig, '')
      .replace(/([a-z]+)?\s*/i, '')
      .replace(/^\{\s*|\s*\}$/ig, '')
      .split(/\s*\{/)[0];
  }
  catch (e) {
    return '';
  }
}


export function getErrorMessageFromResponse(response){
  let errorMessage = 'Unknown error';
  if (response) {
    if (response.errors && response.errors.length) {
      errorMessage = response.errors.map(error => {
        let message = '\n  - ' + error.message;
        if (error.path && error.path.length) {
          message += ' in ' + error.path.join(', ')
        }
        return message;
      }).join('');
    }
    else if (response.message) {
      errorMessage = response.message;
    }
  }
  return errorMessage;
}
