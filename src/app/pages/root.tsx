import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SubmitStatus, useDi } from '@/common';
import {
  ProfilesApi,
  AddProfileForm,
  type CreateOneProfileDto,
} from '@/profiles';

import { CREATE_ONE_PROFILE, PROFILE_LIST } from '../constants';

export function RootPage() {
  const container = useDi();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [PROFILE_LIST],
    queryFn: () => {
      return container.get(ProfilesApi).getMany();
    },
  });

  const { mutate } = useMutation({
    mutationKey: [CREATE_ONE_PROFILE],
    mutationFn: (createProfileDto: CreateOneProfileDto) => {
      return container.get(ProfilesApi).createOne({
        name: createProfileDto.name,
        birthday: createProfileDto.birthday,
      });
    },
  });

  const handleSubmitProfileCreation: ComponentProps<
    typeof AddProfileForm
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
            queryKey: [PROFILE_LIST],
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
      <AddProfileForm onSubmit={handleSubmitProfileCreation} />
      <h2>Existed profiles</h2>
      {data && (
        <ul>
          {data.map((person) => (
            <li key={person.id}>
              <span>
                {person.name} - {person.birthday}
              </span>
              <Link to={person.id}>Explore</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
