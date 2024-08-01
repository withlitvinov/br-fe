type HttpServiceOptions = {
  headers?: {
    [key: string]: string;
  };
  withAuth?: boolean;
};

interface IHttpService {
  get<T>(url: string, options?: HttpServiceOptions): Promise<T>;
  post<T, P>(url: string, payload: P, options?: HttpServiceOptions): Promise<T>;
  patch<T, P>(
    url: string,
    payload: P,
    options?: HttpServiceOptions,
  ): Promise<T>;
  delete<T>(url: string, options?: HttpServiceOptions): Promise<T>;
}

export type { HttpServiceOptions, IHttpService };
