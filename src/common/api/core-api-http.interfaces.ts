import { EndpointVersion } from '@/common';
import { HttpServiceOptions } from '@/core/http';

type CoreApiHttpServiceOptions = HttpServiceOptions;

interface ICoreApiHttpService {
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

export type { CoreApiHttpServiceOptions, ICoreApiHttpService };
