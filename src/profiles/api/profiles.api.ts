import { inject, injectable } from 'inversify';

import {
  type Camelize,
  CoreApiHttpService,
  EndpointVersion,
  type Uuid,
  camelize,
} from '@/common';

import {
  type CreateOneProfileDto,
  type CreateOneProfileResponse,
  type GetByIdProfileResponse,
  type GetManyProfilesResponse,
} from './dtos';

@injectable()
export class ProfilesApi {
  private path = '/profiles';

  constructor(
    @inject(CoreApiHttpService) private coreApiHttpService: CoreApiHttpService,
  ) {}

  async getMany(): Promise<Camelize<GetManyProfilesResponse>> {
    return camelize(
      await this.coreApiHttpService.get<GetManyProfilesResponse>(
        this.path,
        EndpointVersion.V1,
        {
          withAuth: true,
        },
      ),
    );
  }

  async getById(id: Uuid) {
    return this.coreApiHttpService.get<GetByIdProfileResponse>(
      `${this.path}/${id}`,
      EndpointVersion.V1,
      {
        withAuth: true,
      },
    );
  }

  async createOne(dto: CreateOneProfileDto) {
    const _dto: CreateOneProfileDto = {
      name: dto.name,
      birthday: dto.birthday,
    };

    return this.coreApiHttpService.post<
      CreateOneProfileResponse,
      CreateOneProfileDto
    >(this.path, _dto, EndpointVersion.V1, {
      withAuth: true,
    });
  }
}
