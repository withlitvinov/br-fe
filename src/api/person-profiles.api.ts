import { inject, injectable } from 'inversify';

import { EndpointVersion } from '@/core/constants';
import { DiSymbols } from '@/core/di';

import { type ICoreBeHttpService } from './common/core-be-http.service';

export type PersonProfile = {
  id: string;
  name: string;
  birthday: string;
};

export type CreatePersonProfileDto = {
  name: string;
  birthday: string;
};

export interface IPersonProfilesApi {
  all(): Promise<PersonProfile[]>;
  getById(id: string): Promise<PersonProfile>;
  create(payload: CreatePersonProfileDto): Promise<void>;
}

@injectable()
export class PersonProfilesApi implements IPersonProfilesApi {
  constructor(
    @inject(DiSymbols.CoreBeHttpService)
    private httpService: ICoreBeHttpService,
  ) {}

  async all(): Promise<PersonProfile[]> {
    return this.httpService.get<PersonProfile[]>(
      '/person_profiles',
      EndpointVersion.V1,
    );
  }

  async getById(id: string): Promise<PersonProfile> {
    return this.httpService.get<PersonProfile>(
      `/person_profiles/${id}`,
      EndpointVersion.V1,
    );
  }

  async create(payload: CreatePersonProfileDto): Promise<void> {
    return this.httpService.post<void, CreatePersonProfileDto>(
      '/person_profiles',
      {
        name: payload.name,
        birthday: payload.birthday,
      },
      EndpointVersion.V1,
    );
  }
}
