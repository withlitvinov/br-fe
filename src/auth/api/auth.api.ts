import { inject, injectable } from 'inversify';

import { CoreApiHttpService, EndpointVersion, camelize } from '@/common';

import * as authDtos from './auth.api.dtos';

@injectable()
export class AuthApi {
  private path = '/auth';

  constructor(
    @inject(CoreApiHttpService) private coreApiHttpService: CoreApiHttpService,
  ) {}

  async login(dto: authDtos.LoginRequestDto) {
    return camelize(
      await this.coreApiHttpService.post<void, authDtos.LoginRequestDto>(
        this.path + '/login',
        dto,
        EndpointVersion.V1,
      ),
    );
  }

  async logout() {
    await this.coreApiHttpService.post(
      this.path + '/logout',
      undefined,
      EndpointVersion.V1,
    );
  }
}
