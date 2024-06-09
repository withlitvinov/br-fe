import { inject, injectable } from 'inversify';

import { EndpointVersion } from '@/core/constants';
import { DiSymbols } from '@/core/di';
import { HttpServiceOptions, type IHttpService } from '@/core/http/interfaces';

export type CoreBeHttpServiceOptions = HttpServiceOptions & {};

export interface ICoreBeHttpService {
  get<T>(
    path: string,
    version: EndpointVersion,
    options?: CoreBeHttpServiceOptions,
  ): Promise<T>;

  post<T, P>(
    path: string,
    payload: P,
    version: EndpointVersion,
    options?: CoreBeHttpServiceOptions,
  ): Promise<T>;
}

@injectable()
export class CoreBeHttpService implements ICoreBeHttpService {
  private baseUrl: string = 'http://127.0.0.1:4000/api';

  constructor(
    @inject(DiSymbols.HttpService) private httpService: IHttpService,
  ) {}

  get<T>(
    path: string,
    version: EndpointVersion,
    options: CoreBeHttpServiceOptions = {},
  ): Promise<T> {
    return this.httpService.get<T>(this.baseUrl + path, {
      ...options,
      headers: {
        ...options.headers,
        Accept: `application/json;v=${version}`,
      },
    });
  }

  post<T, P>(
    path: string,
    payload: P,
    version: EndpointVersion,
    options: CoreBeHttpServiceOptions = {},
  ): Promise<T> {
    return this.httpService.post<T, P>(this.baseUrl + path, payload, {
      ...options,
      headers: {
        ...options.headers,
        Accept: `application/json;v=${version}`,
      },
    });
  }
}
