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

  public query(query: string, variables?: object){
    return new Promise((resolve, reject) => {
      fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ query, variables })
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
