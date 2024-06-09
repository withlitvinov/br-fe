import { injectable } from 'inversify';

import axios, { AxiosHeaders, AxiosResponse } from 'axios';

import { HttpServiceOptions, IHttpService } from './interfaces';

@injectable()
export class HttpService implements IHttpService {
  async get<T>(url: string, options: HttpServiceOptions = {}): Promise<T> {
    const headers = new AxiosHeaders(options.headers);

    const { data } = await axios.get<T>(url, {
      headers,
    });

    return data;
  }

  async post<T, P>(
    url: string,
    payload: P,
    options: HttpServiceOptions = {},
  ): Promise<T> {
    const headers = new AxiosHeaders(options.headers);

    const { data } = await axios.post<T, AxiosResponse<T>, P>(url, payload, {
      headers,
    });

    return data;
  }
}
