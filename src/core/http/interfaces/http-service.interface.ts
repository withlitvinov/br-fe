export type HttpServiceOptions = {
  headers?: {
    [key: string]: string;
  };
};

export interface IHttpService {
  get<T>(url: string, options?: HttpServiceOptions): Promise<T>;
  post<T, P>(url: string, payload: P, options?: HttpServiceOptions): Promise<T>;
}
