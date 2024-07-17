import { inject, injectable } from 'inversify';

import {
  type Camelize,
  CoreApiHttpService,
  EndpointVersion,
  camelize,
} from '@/common';

import { type MyResponseDto } from './dtos';

@injectable()
export class MyApi {
  private path = '/my';

  constructor(
    @inject(CoreApiHttpService) private coreApiHttpService: CoreApiHttpService,
  ) {}

  async getMy(): Promise<Camelize<MyResponseDto>> {
    return camelize(
      await this.coreApiHttpService.get<MyResponseDto>(
        this.path,
        EndpointVersion.V1,
        {
          withAuth: true,
        },
      ),
    );
  }
}
