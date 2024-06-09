import { ComponentProps } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DiSymbols } from '@/core/di';
import { SubmitStatus } from '@/core/component-helpers';
import { CreatePersonProfileDto, IPersonProfilesApi } from '@/api';
import { useDi } from '@/global-contexts';
import { AddPersonProfileForm } from '@/app/modules/person-profiles';

function Root() {
  const container = useDi();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['personProfiles'],
    queryFn: () => {
      return container
        .get<IPersonProfilesApi>(DiSymbols.PersonProfilesApi)
        .all();
    },
  });

  const { mutate } = useMutation({
    mutationKey: ['createPersonProfile'],
    mutationFn: (payload: CreatePersonProfileDto) => {
      return container
        .get<IPersonProfilesApi>(DiSymbols.PersonProfilesApi)
        .create({
          name: payload.name,
          birthday: payload.birthday,
        });
    },
  });

  const handleCreateNewPersonProfile: ComponentProps<
    typeof AddPersonProfileForm
  >['onSubmit'] = (data, postSubmitFn) => {
    mutate(
      {
        name: data.name,
        birthday: data.birthday,
      },
      {
        onSuccess: () => {
          postSubmitFn(SubmitStatus.Ok);
          queryClient.invalidateQueries({
            queryKey: ['personProfiles'],
          });
        },
        onError: () => {
          postSubmitFn(SubmitStatus.Fail);
        },
      },
    );
  };

  return (
    <>
      <h1>Person profiles</h1>
      <h2>Add new</h2>
      <AddPersonProfileForm onSubmit={handleCreateNewPersonProfile} />
      <h2>Existed profiles</h2>
      {data && (
        <ul>
          {data.map((person) => (
            <li key={person.id}>
              {person.name} - {person.birthday}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default Root;
