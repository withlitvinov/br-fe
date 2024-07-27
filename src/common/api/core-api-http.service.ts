import { inject, injectable } from 'inversify';

import { DiTokens, type IHttpService } from '@/core';

import { EndpointVersion } from '../constants';

import {
  type CoreApiHttpServiceOptions,
  type ICoreApiHttpService,
} from './core-api-http.interfaces.ts';

const DEFAULT_BASE_API_URL = 'http://localhost:2300/api';

@injectable()
export class CoreApiHttpService implements ICoreApiHttpService {
  private baseUrl = import.meta.env.BASE_API_URL ?? DEFAULT_BASE_API_URL;

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
}
