import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customFormat);

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
        birthday: {
          year: createProfileDto.birthday.year,
          month: createProfileDto.birthday.month,
          day: createProfileDto.birthday.day,
        },
      });
    },
  });

  const handleSubmitProfileCreation: ComponentProps<
    typeof AddProfileForm
  >['onSubmit'] = (payload, postSubmitFn) => {
    mutate(
      {
        name: payload.name,
        birthday: {
          year: payload.birthday.year,
          month: payload.birthday.month,
          day: payload.birthday.day,
        },
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
    <div className="page root">
      <h1>Person profiles</h1>
      <div className="layout">
        <div className="layout__content">
          {data && (
            <table className="border-spacing-3">
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'start',
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      textAlign: 'start',
                    }}
                  >
                    Birthday date
                  </th>
                  <th
                    style={{
                      textAlign: 'start',
                    }}
                  >
                    Age
                  </th>
                  <th
                    style={{
                      textAlign: 'start',
                    }}
                  >
                    Birthday in (days)
                  </th>
                  <th
                    style={{
                      textAlign: 'start',
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {data.map((person) => (
                  <tr
                    key={person.id}
                    style={{
                      height: '32px',
                    }}
                  >
                    <td
                      style={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {person.name}
                    </td>
                    <td
                      style={{
                        textAlign: 'end',
                      }}
                    >
                      {person.birthday}
                    </td>
                    <td>
                      {person.isFull
                        ? dayjs().diff(dayjs(person.birthday), 'y')
                        : ''}
                    </td>
                    <td>
                      {(() => {
                        const now = dayjs();
                        let birthday = dayjs(
                          person.birthday,
                          person.isFull ? 'YYYY-MM-DD' : 'MM-DD',
                        );

                        const isBirthdayHappened =
                          birthday.month() > now.month() ||
                          (birthday.month() === now.month() &&
                            birthday.day() >= now.day());

                        birthday = birthday.year(
                          isBirthdayHappened ? now.year() : now.year() + 1,
                        );

                        return birthday.diff(now, 'd') - 1;
                      })()}
                    </td>
                    <td>
                      <Link to={person.id}>Explore</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="layout__sidebar">
          <h2>Add new</h2>
          <AddProfileForm onSubmit={handleSubmitProfileCreation} />
        </div>
      </div>
    </div>
  );
}
