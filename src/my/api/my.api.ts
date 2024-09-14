import { inject, injectable } from 'inversify';

import {
  type Camelize,
  CoreApiHttpService,
  EndpointVersion,
  camelize,
} from '@/common';

import { type MyResponseDto, request } from './dtos';

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
      ),
    );
  }

  async updateTz(timeZone: string): Promise<void> {
    return this.coreApiHttpService.patch<void, request.UpdateTimeZoneDto>(
      this.path + '/time_zone',
      {
        time_zone: timeZone,
      },
      EndpointVersion.V1,
    );
  }
}
