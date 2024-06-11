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
  private path = '/profiles';

  constructor(
    @inject(DiSymbols.CoreBeHttpService)
    private httpService: ICoreBeHttpService,
  ) {}

  async all(): Promise<PersonProfile[]> {
    return this.httpService.get<PersonProfile[]>(this.path, EndpointVersion.V1);
  }

  async getById(id: string): Promise<PersonProfile> {
    return this.httpService.get<PersonProfile>(
      `${this.path}/${id}`,
      EndpointVersion.V1,
    );
  }

  async create(payload: CreatePersonProfileDto): Promise<void> {
    return this.httpService.post<void, CreatePersonProfileDto>(
      this.path,
      {
        name: payload.name,
        birthday: payload.birthday,
      },
      EndpointVersion.V1,
    );
  }
}
