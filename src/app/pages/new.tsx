import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { useDi, usePageTitle } from '@/common';
import { Button, Input, Label } from '@/common/components';
import { ProfilesApi } from '@/profiles';

type CreateProfilePayload = {
  name: string;
  birthday: {
    year: number | null;
    month: number;
    day: number;
  };
};

type FormState = {
  name: string;
  birthday: string;
};

const PAGE_TITLE = 'New birthday profile';

export function NewPage() {
  usePageTitle(PAGE_TITLE);
  const navigate = useNavigate();
  const profilesApi = useDi(ProfilesApi);
  const { control, handleSubmit } = useForm<FormState>({
    defaultValues: {
      name: '',
      birthday: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateProfilePayload) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return profilesApi.createOne(payload);
    },
  });

  const onSubmit = async (state: FormState) => {
    const [year, month, day] = state.birthday.split('-');

    const payload = {
      name: state.name,
      birthday: {
        year: year.includes('#') ? null : +year,
        month: +month,
        day: +day,
      },
    };

    mutate(payload, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-6">
      <Link to="/" className="w-fit hover:text-blue-400">
        {'<-'} Back
      </Link>
      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <div className="w-full grid gap-y-1.5">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                {...field}
                placeholder="Birthday owner's name or nickname"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="birthday"
          render={({ field }) => (
            <div className="w-full grid gap-y-1.5">
              <div className="flex flex-col gap-y-1">
                <Label htmlFor={field.name}>Birthday</Label>
                <div className="text-xs">
                  If you don't know a birth year, you can write{' '}
                  <span className="font-medium">####</span> as a year. (e.g.
                  ####-01-01)
                </div>
              </div>
              <Input {...field} placeholder="yyyy-mm-dd" />
            </div>
          )}
        />

        <Button disabled={isPending}>Create</Button>
      </form>
    </div>
  );
}
