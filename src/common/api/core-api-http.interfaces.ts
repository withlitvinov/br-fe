import { HttpServiceOptions } from '@/core/http';

import { EndpointVersion } from '../constants';

export type CoreApiHttpServiceOptions = HttpServiceOptions & {};

export interface ICoreApiHttpService {
  get<T>(
    path: string,
    version: EndpointVersion,
    options?: CoreApiHttpServiceOptions,
  ): Promise<T>;

  post<T, P>(
    path: string,
    payload: P,
    version: EndpointVersion,
    options?: CoreApiHttpServiceOptions,
  ): Promise<T>;
}
