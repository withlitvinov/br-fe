import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customFormat);

import { useDi } from '@/common';
import { ProfilesApi } from '@/profiles';

import { PROFILE_LIST } from '../constants';

const getDateFormat = (isFull = false) => (isFull ? 'YYYY-MM-DD' : 'MM-DD');

const getDaysLeft = (birthday: dayjs.Dayjs) => {
  const now = dayjs();

  const isBirthdayHappened =
    birthday.month() > now.month() ||
    (birthday.month() === now.month() && birthday.day() >= now.day());

  birthday = birthday.year(isBirthdayHappened ? now.year() : now.year() + 1);

  return birthday.diff(now, 'd') + 1;
};

export function RootPage() {
  const container = useDi();

  const { data: profiles } = useQuery({
    queryKey: [PROFILE_LIST],
    queryFn: () => {
      return container.get(ProfilesApi).getMany();
    },
  });

  return (
    <div className="flex flex-col gap-y-[16px]">
      <div className="text-lg">Upcoming birthdays</div>
      <div className="flex flex-col gap-y-[8px]">
        {profiles &&
          profiles.map((profile) => {
            const dbirthday = dayjs(
              profile.birthday,
              getDateFormat(profile.isFull),
            );

            return (
              <div className="flex min-h-[48px] items-center justify-between gap-x-[16px]">
                <div className="flex flex-col gap-y-[4px]">
                  <span className="capitalize">{profile.name}</span>
                  <span>{dbirthday.format('DD.MM.YYYY')}</span>
                </div>
                <div>
                  In {getDaysLeft(dbirthday)} days ({dbirthday.format('D MMM')})
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
