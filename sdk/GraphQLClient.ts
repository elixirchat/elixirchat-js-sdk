export interface IGraphQLClientConfig {
  url: string;
  token?: string;
}

export interface IGraphQLClientQuery {
  (
    query: string,
    variables?: object,
    options?: {
      asFormData: boolean,
    },
  ): void
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

  protected makeFormData(query: string, variables: object): FormData {
    const formData = new FormData();
    const formVariables = {
      roomId: variables.roomId,
      text: variables.text,
      attachments: variables.attachments.map(file => file.name),
      responseToMessageId: variables.responseToMessageId,
    };

    formData.append('query', query);
    formData.append('variables', JSON.stringify(formVariables));
    variables.attachments.forEach(file => {
      formData.append(file.name, file);
    });

    return formData;
  };

  public query(query, variables, options = { asFormData: false }): IGraphQLClientQuery {
    let headers;
    let body;

    if (options.asFormData) {
      body = this.makeFormData(query, variables);
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
