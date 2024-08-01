import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { MoveLeftIcon } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/common/components';
import { useDi, usePageTitle } from '@/common/contexts';
import { dateUtils } from '@/common/utils';
import { ProfilesApi } from '@/profiles';

import {
  BIRTHDAY_PROFILES_KEY,
  BIRTHDAY_PROFILE_BY_ID_KEY,
} from '../constants';

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
  const { id } = useParams();
  const navigate = useNavigate();

  usePageTitle(DEFAULT_TITLE);
  const queryClient = useQueryClient();
  const profilesApi = useDi(ProfilesApi);

  const isEnabled = !!id;

  const {
    data: details,
    isLoading,
    error,
  } = useQuery({
    queryKey: [BIRTHDAY_PROFILE_BY_ID_KEY, id],
    queryFn: () => profilesApi.getById(id!),
    enabled: isEnabled,
  });
  const { mutate: deleteProfile, isPending } = useMutation({
    mutationFn: (id: string) => {
      return profilesApi.delete(id);
    },
  });

  const handleDelete = () => {
    if (!id) {
      return;
    }

    deleteProfile(id, {
      onSuccess: async () => {
        navigate('/');

        queryClient.invalidateQueries({
          queryKey: [BIRTHDAY_PROFILES_KEY],
          exact: true,
        });
        queryClient.removeQueries({
          queryKey: [BIRTHDAY_PROFILE_BY_ID_KEY, id],
          exact: true,
        });
      },
    });
  };

  if (!id) {
    return <Navigate to="/" />;
  }

  if (!isLoading && isNotFound(error)) {
    return <>Not found</>;
  }

  return (
    details && (
      <div className="flex flex-col gap-y-[16px]">
        <div className="flex justify-between gap-x-[16px]">
          <span className="text-xl font-medium">{details.name}</span>
          <Button
            variant="destructiveOutline"
            size="sm"
            disabled={isPending}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
        <div>
          <span className="font-medium">Birthday:</span>{' '}
          {getFormattedBirthday(details.birthday, details.isFull)}
        </div>
      </div>
    )
  );
}

export function DetailsPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-x-2 w-fit hover:text-blue-400"
      >
        <MoveLeftIcon /> Back to home page
      </Link>
      <DetailsContent />
    </div>
  );
}
