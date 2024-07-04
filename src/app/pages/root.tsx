import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
dayjs.extend(customFormat);
dayjs.extend(utc);

import { useDi } from '@/common';
import { ProfilesApi } from '@/profiles';

import { PROFILE_LIST } from '../constants';

// Use when date comes without year
const LEAP_YEAR = 1600;

const getDateFormat = (isFull: boolean) => (isFull ? 'YYYY-MM-DD' : 'MM-DD');

const getDate = (date: string, isFull: boolean) => {
  const _result = dayjs(date, getDateFormat(isFull));

  if (isFull) {
    return _result;
  }

  return _result.year(LEAP_YEAR);
};

const isBeforeWithoutYear = (now: dayjs.Dayjs, dateToCheck: dayjs.Dayjs) => {
  if (now.month() > dateToCheck.month()) {
    return true;
  }

  return now.month() === dateToCheck.month() && now.date() > dateToCheck.date();
};

const getDaysLeft = (birthday: dayjs.Dayjs) => {
  const now = dayjs();
  let _birthday = birthday.clone();

  _birthday = _birthday.year(
    isBeforeWithoutYear(now, _birthday) ? now.year() + 1 : now.year(),
  );

  return _birthday.diff(now, 'd');
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
            const dbirthday = getDate(profile.birthday, profile.isFull);
            const daysLeft = getDaysLeft(dbirthday);

            return (
              <div
                key={profile.id}
                className="flex min-h-[48px] items-center justify-between gap-x-[16px]"
              >
                <div className="flex flex-col gap-y-[4px]">
                  <span className="capitalize">{profile.name}</span>
                  <span>
                    {dbirthday.format(profile.isFull ? 'DD.MM.YYYY' : 'DD.MM')}
                  </span>
                </div>
                <div>
                  {daysLeft === 0 ? (
                    <span className="font-medium">Today</span>
                  ) : (
                    `In ${daysLeft} days`
                  )}{' '}
                  ({dbirthday.format('D MMM')})
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
