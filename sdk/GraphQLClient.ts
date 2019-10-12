export interface IGraphQLClientConfig {
  url: string;
  token?: string;
}

export class GraphQLClient {
  public url: string;
  public token?: string;

  protected headers: any = {
    'Accept': 'application/json',
  };

  constructor({url, token}: IGraphQLClientConfig){
    this.url = url;
    this.token = token;
    if (this.token) {
      this.headers.Authorization = `Bearer ${this.token}`;
    }
  }

  protected makeFormData(query: string, variables: object, binaryFiles?: object): FormData {
    const formData = new FormData();
    formData.append('query', query);
    formData.append('variables', JSON.stringify(variables));

    for (let fileName in binaryFiles) {
      formData.append(fileName, binaryFiles[fileName]);
    }
    return formData;
  };

  public query(query: string, variables: object, binaryFiles: object): Promise<any> {
    let headers;
    let body;

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

    return new Promise((resolve, reject) => {
      fetch(this.url, {
        method: 'POST',
        headers,
        body,
      })
        .then(response => response.json())
        .then(response => {
          if (response.errors) {
            reject(response);
          }
          else {
            resolve(response.data);
          }
        })
        .catch(response => reject(response));
    });
  }
}


export interface ISimplifyGraphQLJSON {
  (graphQLJSON: { edges: Array<any> }): object
}

export const simplifyGraphQLJSON: ISimplifyGraphQLJSON = (graphQLJSON) => {
  return graphQLJSON.edges.map(data => ({
    ...data.node,
    cursor: data.cursor,
  }));
};


/**
 * When used like this:
 *  @example gql`some string`
 * it simply returns its argument i.e. "some string"
 *
 * It's only designed to trigger WebStorm Plugin "JS GraphQL" highlight strings as graphql queries
 */
export interface IGql {
  (queryParts: Array<string>, ...variables: Array<any>): string
}

export const gql: IGql = (queryParts, ...variables) => {
  let str = '';
  for (let i = 0; i < queryParts.length; i ++) {
    str += queryParts[i] + (variables[i] || '');
  }
  return str;
};


export interface IInsertGraphQlFragments {
  (query: string, fragments: object): string
}

export const insertGraphQlFragments: IInsertGraphQlFragments = (query, fragments = {}) => {
  let fragmentsString = '';
  for (let name in fragments) {
    fragmentsString += fragments[name];
  }
  return query + fragmentsString;
};
