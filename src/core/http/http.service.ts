import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { injectable } from 'inversify';

import { HttpServiceOptions, IHttpService } from './interfaces';

axios.defaults.withCredentials = true;

@injectable()
export class HttpService implements IHttpService {
  async get<T>(url: string, options: HttpServiceOptions = {}): Promise<T> {
    const headers = new AxiosHeaders(options.headers);

    const { data } = await axios.get<T>(url, {
      headers,
      meta: {
        withAuth: options.withAuth ?? false,
      },
    });

    return data;
  }

  async post<T, P = unknown>(
    url: string,
    payload?: P,
    options: HttpServiceOptions = {},
  ): Promise<T> {
    const headers = new AxiosHeaders(options.headers);

    const { data } = await axios.post<T, AxiosResponse<T>, P>(url, payload, {
      headers,
      meta: {
        withAuth: options.withAuth ?? false,
      },
    });

    return data;
  }
}
