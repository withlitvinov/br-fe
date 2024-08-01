import { inject, injectable } from 'inversify';

import config from '@/config.ts';
import { DiTokens, HttpServiceOptions, type IHttpService } from '@/core';

import { EndpointVersion } from '../constants';

type CoreApiHttpServiceOptions = HttpServiceOptions;

@injectable()
export class CoreApiHttpService {
  private baseUrl = config.VITE_API_URL;

  constructor(
    @inject(DiTokens.HttpService) private httpService: IHttpService,
  ) {}

  get<T = unknown>(
    path: string,
    version: EndpointVersion,
    options: CoreApiHttpServiceOptions = {},
  ): Promise<T> {
    return this.httpService.get<T>(this.baseUrl + path, {
      ...options,
      headers: {
        ...options.headers,
        'X-Version': version,
      },
    });
  }

  post<T = unknown, P = unknown>(
    path: string,
    payload: P,
    version: EndpointVersion,
    options: CoreApiHttpServiceOptions = {},
  ): Promise<T> {
    return this.httpService.post<T, P>(this.baseUrl + path, payload, {
      ...options,
      headers: {
        ...options.headers,
        'X-Version': version,
      },
    });
  }

  patch<T = unknown, P = unknown>(
    path: string,
    payload: P,
    version: EndpointVersion,
    options: CoreApiHttpServiceOptions = {},
  ): Promise<T> {
    return this.httpService.patch<T, P>(this.baseUrl + path, payload, {
      ...options,
      headers: {
        ...options.headers,
        'X-Version': version,
      },
    });
  }

  delete<T = unknown>(
    path: string,
    version: EndpointVersion,
    options: CoreApiHttpServiceOptions = {},
  ): Promise<T> {
    return this.httpService.delete<T>(this.baseUrl + path, {
      ...options,
      headers: {
        ...options.headers,
        'X-Version': version,
      },
    });
  }
}
