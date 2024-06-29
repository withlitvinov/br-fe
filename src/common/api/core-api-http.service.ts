import { inject, injectable } from 'inversify';

import { DiTokens, type IHttpService } from '@/core';

import { EndpointVersion } from '../constants';
import type {
  ICoreApiHttpService,
  CoreApiHttpServiceOptions,
} from './core-api-http.interfaces.ts';

const DEFAULT_BASE_API_URL = 'http://127.0.0.1:4000/api';

@injectable()
export class CoreApiHttpService implements ICoreApiHttpService {
  private baseUrl = import.meta.env.BASE_API_URL ?? DEFAULT_BASE_API_URL;

  constructor(
    @inject(DiTokens.HttpService) private httpService: IHttpService,
  ) {}

  get<T>(
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

  post<T, P>(
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
