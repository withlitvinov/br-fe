import { useForm } from 'react-hook-form';

import { BaseFormProps, SubmitStatus } from '@/core/component-helpers';

type AddPersonProfileFormState = {
  name: string;
  birthday: string;
};

type AddPersonProfileFormProps = BaseFormProps<AddPersonProfileFormState> & {};

function AddPersonProfileForm({ onSubmit }: AddPersonProfileFormProps) {
  const { register, handleSubmit, reset } =
    useForm<AddPersonProfileFormState>();

  const _onSubmit = (data: AddPersonProfileFormState) => {
    onSubmit(data, (submitStatus) => {
      if (submitStatus === SubmitStatus.Ok) {
        reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <input type="text" placeholder="Name" {...register('name')} />
      <input type="text" placeholder="Birthday" {...register('birthday')} />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddPersonProfileForm;
