import { useForm } from 'react-hook-form';

import { BaseFormProps, SubmitStatus } from '@/common';

type FormState = {
  name: string;
  birthday: {
    year: string;
    month: string;
    day: string;
  };
};

type SubmitFormPayload = {
  name: string;
  birthday: {
    year: number | null;
    month: number;
    day: number;
  };
};

type AddPersonProfileFormProps = BaseFormProps<
  FormState,
  SubmitFormPayload
> & {};

export function AddProfileForm({ onSubmit }: AddPersonProfileFormProps) {
  const { register, handleSubmit, reset } = useForm<FormState>();

  const _onSubmit = (state: FormState) => {
    const { name, birthday } = state;

    const payload: SubmitFormPayload = {
      name: name,
      birthday: {
        year: birthday.year.length ? +birthday.year : null,
        month: +birthday.month,
        day: +birthday.day,
      },
    };

    onSubmit(payload, (submitStatus) => {
      if (submitStatus === SubmitStatus.Ok) {
        reset();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(_onSubmit)}
      style={{
        maxWidth: '400px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '4px' }}>
        <input type="text" placeholder="Name" {...register('name')} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            columnGap: '4px',
          }}
        >
          <input
            type="text"
            placeholder="Birthday year (Optional)"
            {...register('birthday.year')}
          />
          <input
            type="text"
            placeholder="Birthday month"
            {...register('birthday.month')}
          />
          <input
            type="text"
            placeholder="Birthday day"
            {...register('birthday.day')}
          />
        </div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
