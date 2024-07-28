import { inject, injectable } from 'inversify';

import {
  type Camelize,
  CoreApiHttpService,
  EndpointVersion,
  type Uuid,
  camelize,
} from '@/common';

import { request, response } from './dtos';

@injectable()
export class ProfilesApi {
  private path = '/profiles';

  constructor(
    @inject(CoreApiHttpService) private coreApiHttpService: CoreApiHttpService,
  ) {}

  async getMany(): Promise<Camelize<response.ProfileDto[]>> {
    return camelize(
      await this.coreApiHttpService.get<response.ProfileDto[]>(
        this.path,
        EndpointVersion.V1,
        {
          withAuth: true,
        },
      ),
    );
  }

  async getById(id: Uuid): Promise<Camelize<response.DetailedProfileDto>> {
    return camelize(
      await this.coreApiHttpService.get<response.DetailedProfileDto>(
        `${this.path}/${id}`,
        EndpointVersion.V1,
        {
          withAuth: true,
        },
      ),
    );
  }

  async createOne(dto: request.CreateProfileDto) {
    const _dto: request.CreateProfileDto = {
      name: dto.name,
      birthday: dto.birthday,
    };

    return this.coreApiHttpService.post<
      response.CreatedProfileDto,
      request.CreateProfileDto
    >(this.path, _dto, EndpointVersion.V1, {
      withAuth: true,
    });
  }

  async delete(id: string): Promise<void> {
    return this.coreApiHttpService.delete<void>(
      this.path + '/' + id,
      EndpointVersion.V1,
      {
        withAuth: true,
      },
    );
  }
}
