import { inject, injectable } from 'inversify';

import { CoreApiHttpService, EndpointVersion, Uuid } from '@/common';

import type {
  CreateOneProfileDto,
  CreateOneProfileResponse,
  GetByIdProfileResponse,
  GetManyProfilesResponse,
} from './dtos';

@injectable()
export class ProfilesApi {
  private path = '/profiles';

  constructor(
    @inject(CoreApiHttpService) private coreApiHttpService: CoreApiHttpService,
  ) {}

  async getMany() {
    return this.coreApiHttpService.get<GetManyProfilesResponse>(
      this.path,
      EndpointVersion.V1,
    );
  }

  async getById(id: Uuid) {
    return this.coreApiHttpService.get<GetByIdProfileResponse>(
      `${this.path}/${id}`,
      EndpointVersion.V1,
    );
  }

  async createOne(createProfileDto: CreateOneProfileDto) {
    const dto: CreateOneProfileDto = {
      name: createProfileDto.name,
      birthday: {
        year: createProfileDto.birthday.year,
        month: createProfileDto.birthday.month,
        day: createProfileDto.birthday.day,
      },
    };

    return this.coreApiHttpService.post<
      CreateOneProfileResponse,
      CreateOneProfileDto
    >(this.path, dto, EndpointVersion.V1);
  }
}
