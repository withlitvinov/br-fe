import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useDi, usePageTitle } from '@/common/contexts';
import { dateUtils } from '@/common/utils';
import { MyApi } from '@/my';
import { ProfilesApi } from '@/profiles';

import { AUTHORIZED_MY_DETAILS_KEY, BIRTHDAY_PROFILES_KEY } from '../constants';

const getDaysLeftLabel = (daysLeft: number) => {
  if (daysLeft === 0) {
    return <span className="font-medium">Today</span>;
  }

  if (daysLeft === 1) {
    return 'Tomorrow';
  }

  return `In ${daysLeft} days`;
};

const getPageTitle = (name?: string) => {
  const base = 'Welcome back 👋';

  if (name) {
    return base + ', ' + name + '.';
  }

  return base + '.';
};

export function RootPage() {
  const { updateTitle } = usePageTitle(getPageTitle());

  const profilesApi = useDi(ProfilesApi);
  const myApi = useDi(MyApi);

  const { data: myDetails } = useQuery({
    queryKey: [AUTHORIZED_MY_DETAILS_KEY],
    queryFn: () => {
      return myApi.getMy();
    },
  });
  const { data: profiles } = useQuery({
    queryKey: [BIRTHDAY_PROFILES_KEY],
    queryFn: () => {
      return profilesApi.getMany();
    },
  });

  useEffect(() => {
    if (myDetails) {
      updateTitle(getPageTitle(myDetails.name));
    }
  }, [updateTitle, myDetails]);

  return (
    <div className="flex flex-col gap-y-[16px]">
      <div className="flex flex-col">
        <div className="text-lg font-medium">Upcoming birthdays</div>
        <NavLink
          to="/new"
          className="w-fit text-sm underline hover:text-blue-400"
        >
          Want to track new birthday?
        </NavLink>
      </div>
      <div className="flex flex-col gap-y-[8px]">
        {profiles &&
          profiles.map((profile) => {
            const dbirthday = dateUtils.getWithFormat(
              profile.birthday,
              dateUtils.getFormat(profile.isFull),
            );
            const daysLeft = dateUtils.daysBeforeWithoutYear(dbirthday);

            return (
              <Link
                key={profile.id}
                to={`/${profile.id}`}
                className="flex min-h-[48px] items-center justify-between gap-x-[16px]"
              >
                <div className="flex flex-col gap-y-[4px]">
                  <span className="capitalize hover:underline w-fit">
                    {profile.name}
                  </span>
                  <span>
                    {dbirthday.format(
                      profile.isFull
                        ? dateUtils.DisplayDateFormatEnum.Dot
                        : dateUtils.DisplayDateFormatEnum.DotWithoutYear,
                    )}
                  </span>
                </div>
                <div>
                  {getDaysLeftLabel(daysLeft)} (
                  {dbirthday.format(
                    dateUtils.DisplayDateFormatEnum.DayWithShortMonth,
                  )}
                  )
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
