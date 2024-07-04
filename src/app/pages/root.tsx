import { useQuery } from '@tanstack/react-query';

import { useDi, dateUtils } from '@/common';
import { ProfilesApi } from '@/profiles';

import { PROFILE_LIST } from '../constants';

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
            const dbirthday = dateUtils.getWithFormat(
              profile.birthday,
              dateUtils.getFormat(profile.isFull),
            );
            const daysLeft = dateUtils.daysBeforeWithoutYear(dbirthday);
            const isBirthdayToday = daysLeft === 0;

            return (
              <div
                key={profile.id}
                className="flex min-h-[48px] items-center justify-between gap-x-[16px]"
              >
                <div className="flex flex-col gap-y-[4px]">
                  <span className="capitalize">{profile.name}</span>
                  <span>
                    {dbirthday.format(
                      profile.isFull
                        ? dateUtils.DisplayDateFormatEnum.Dot
                        : dateUtils.DisplayDateFormatEnum.DotWithoutYear,
                    )}
                  </span>
                </div>
                <div>
                  {isBirthdayToday ? (
                    <span className="font-medium">Today</span>
                  ) : (
                    `In ${daysLeft} days`
                  )}{' '}
                  (
                  {dbirthday.format(
                    dateUtils.DisplayDateFormatEnum.DayWithShortMonth,
                  )}
                  )
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
