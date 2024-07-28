import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { BIRTHDAY_PROFILES_KEY } from '@/app/constants';
import { Button, Input, Label } from '@/common/components';
import { useDi, usePageTitle } from '@/common/contexts';
import { ProfilesApi } from '@/profiles';

type CreateProfilePayload = {
  name: string;
  birthday: string;
};

const DATE_REGEX = /(\d{4}|####)-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/; // Format like: ####-01-01 or 2000-01-01

const schema = z.object({
  name: z.string().min(1, { message: 'Should contain at least 1 character' }),
  birthday: z.string().regex(DATE_REGEX, {
    message: 'Should match pattern "yyyy-mm-dd"',
  }),
});
type FormState = z.infer<typeof schema>;

const PAGE_TITLE = 'New birthday profile';

export function NewPage() {
  usePageTitle(PAGE_TITLE);
  const navigate = useNavigate();
  const profilesApi = useDi(ProfilesApi);
  const queryClient = useQueryClient();

  const { control, handleSubmit } = useForm<FormState>({
    defaultValues: {
      name: '',
      birthday: '',
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateProfilePayload) => {
      return profilesApi.createOne(payload);
    },
  });

  const onSubmit = async (state: FormState) => {
    const payload = {
      name: state.name,
      birthday: state.birthday,
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [BIRTHDAY_PROFILES_KEY],
        });
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
          render={({ field, fieldState }) => (
            <div className="w-full grid gap-y-1.5">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                {...field}
                placeholder="Birthday owner's name or nickname"
              />
              {fieldState.error && fieldState.error.message && (
                <div className="text-sm text-red-500">
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="birthday"
          render={({ field, fieldState }) => (
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
              {fieldState.error && fieldState.error.message && (
                <div className="text-sm text-red-500">
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />

        <Button disabled={isPending}>Create</Button>
      </form>
    </div>
  );
}
