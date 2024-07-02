import { Controller, useForm } from 'react-hook-form';

import { BaseFormProps, SubmitStatus } from '@/common';
import * as Field from '@/common/components/Field';

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
  const { control, handleSubmit, reset } = useForm<FormState>();

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
        <Controller
          control={control}
          name="name"
          render={({ field: { name, ...field } }) => (
            <Field.Root name={name}>
              <Field.Control {...field} type="text" placeholder="Person name" />
            </Field.Root>
          )}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            columnGap: '4px',
          }}
        >
          <Controller
            control={control}
            name="birthday.year"
            render={({ field: { name, ...field } }) => (
              <Field.Root name={name}>
                <Field.Control
                  {...field}
                  type="text"
                  placeholder="Birthday year (Optional)"
                />
              </Field.Root>
            )}
          />
          <Controller
            control={control}
            name="birthday.month"
            render={({ field: { name, ...field } }) => (
              <Field.Root name={name}>
                <Field.Control
                  {...field}
                  type="text"
                  placeholder="Birthday month"
                />
              </Field.Root>
            )}
          />
          <Controller
            control={control}
            name="birthday.day"
            render={({ field: { name, ...field } }) => (
              <Field.Root name={name}>
                <Field.Control
                  {...field}
                  type="text"
                  placeholder="Birthday day"
                />
              </Field.Root>
            )}
          />
        </div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
