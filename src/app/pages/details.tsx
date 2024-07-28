import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { useDiContainer, usePageTitle } from '@/common/contexts';
import { dateUtils } from '@/common/utils';
import { ProfilesApi } from '@/profiles';

import { BIRTHDAY_PROFILE_BY_ID_KEY } from '../constants';

const getFormattedBirthday = (birthday: string, isFull: boolean) => {
  const date = dateUtils.getWithFormat(
    birthday,
    isFull
      ? dateUtils.DateFormatEnum.Full
      : dateUtils.DateFormatEnum.WithoutYear,
  );

  return (
    date.format(
      isFull
        ? dateUtils.DisplayDateFormatEnum.Dot
        : dateUtils.DisplayDateFormatEnum.DotWithoutYear,
    ) +
    ' ' +
    '(' +
    date.format(
      isFull
        ? dateUtils.DisplayDateFormatEnum.DayWithShortMonthAndYear
        : dateUtils.DisplayDateFormatEnum.DayWithShortMonth,
    ) +
    ')'
  );
};

const isNotFound = (error: unknown) => {
  return isAxiosError(error) && error.response?.status === 404;
};

const DEFAULT_TITLE = 'Profile details';

function DetailsContent() {
  const { updateTitle } = usePageTitle(DEFAULT_TITLE);
  const { id } = useParams();
  const container = useDiContainer();

  const isId = !!id;

  const {
    data: details,
    isLoading,
    error,
  } = useQuery({
    queryKey: [BIRTHDAY_PROFILE_BY_ID_KEY, id],
    queryFn: () => container.get(ProfilesApi).getById(id!),
    enabled: isId,
  });

  useEffect(() => {
    if (details) {
      updateTitle(`"${details.name}" profile details`);
    }
  }, [updateTitle, details]);

  if (!isId) {
    return <Navigate to="/" />;
  }

  if (!isLoading && isNotFound(error)) {
    return <>Profile doesn't exist</>;
  }

  return (
    details && (
      <div>
        <span className="font-medium">Birthday:</span>{' '}
        {getFormattedBirthday(details.birthday, details.isFull)}
      </div>
    )
  );
}

export function DetailsPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <Link to="/" className="w-fit hover:text-blue-400">
        {'<-'} Back to home page
      </Link>
      <DetailsContent />
    </div>
  );
}
