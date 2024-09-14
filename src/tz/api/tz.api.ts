import { inject, injectable } from 'inversify';

import {
  type Camelize,
  CoreApiHttpService,
  EndpointVersion,
  camelize,
} from '@/common';

type TimeZoneDto = {
  id: string;
  utc_offset: number;
};

type CamelizedTimeZoneDto = Camelize<TimeZoneDto>;

@injectable()
export class TzApi {
  private path = '/tz';

  constructor(
    @inject(CoreApiHttpService) private coreApiHttpService: CoreApiHttpService,
  ) {}

  async getTimeZones(): Promise<Camelize<TimeZoneDto[]>> {
    return camelize(
      await this.coreApiHttpService.get<TimeZoneDto[]>(
        this.path,
        EndpointVersion.V1,
      ),
    );
  }
}

export type { CamelizedTimeZoneDto };
