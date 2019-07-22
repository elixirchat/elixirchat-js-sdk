import { logEvent } from '../utilsCommon';

export interface IGraphQLClientConfig {
  url: string;
  token?: string;
}

export class GraphQLClient {
  public url: string;
  public token?: string;

  protected headers: any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  constructor({url, token}: IGraphQLClientConfig){
    this.url = url;
    this.token = token;
    if (this.token) {
      this.headers.Authorization = `Bearer ${this.token}`;
    }
  }

  public query(query: string, variables?: object, token?: string){
    let headers = this.headers;
    if (token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    }
    return new Promise((resolve, reject) => {
      fetch(this.url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
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


export interface IPrepareGraphQLQuery {
  (queryType: 'query' | 'mutation', query: string, variables: any, optionalTypes?: any) : string
}

export const prepareGraphQLQuery: IPrepareGraphQLQuery = (queryType, query, variables, optionalTypes = {}) => {
  const queryTypes = [];
  const queryVariables = [];

  Object.keys(variables).forEach(key => {
    const variableValue = variables[key];
    if (variableValue) {
      let variableType;
      if (optionalTypes && optionalTypes[key]) {
        variableType = optionalTypes[key];
      }
      else if (/id$/i.test(key)) {
        variableType = 'ID';
      }
      else if (typeof variableValue === 'string') {
        variableType = 'String';
      }
      else if (typeof variableValue === 'number' && variableValue % 1) {
        variableType = 'Float';
      }
      else if (typeof variableValue === 'number' && !(variableValue % 1)) {
        variableType = 'Int';
      }
      else {
        logEvent(true, `'Unable to detect GraphQL variable type for "${key}": ${variableValue}'`, {
          query,
          variables,
          optionalTypes,
        }, 'error');
        return '';
      }
      queryTypes.push(`$${key}: ${variableType}!`);
      queryVariables.push(`${key}: $${key}`);
    }
  });
  return `
    ${queryType} (${ queryTypes.join(', ') }) {
      ${query.trim().replace(/^([a-z_]+).*{/i, `$1 (${ queryVariables.join(', ') }) {`)}        
    }
  `;
};


export interface ISimplifyGraphQLJSON {
  (graphQLJSON: { edges: Array<any> }): object
}

export const simplifyGraphQLJSON: ISimplifyGraphQLJSON = (graphQLJSON) => {
  return graphQLJSON.edges.map(data => ({
    ...data.node,
    cursor: data.cursor,
  }));
};
