import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/auth/auth.hook';
import { Button, InputWithLabel } from '@/common/components';

type FormState = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { handleSubmit, register } = useForm<FormState>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (state: FormState) => {
    const success = await login(state);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center size-full p-6 bg-white sm:h-fit sm:max-w-[400px] sm:rounded-md sm:border">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-y-4"
      >
        <h1 className="text-lg">Welcome to Birthday Reminder!</h1>
        <InputWithLabel
          {...register('email')}
          placeholder="Email"
          label="Email"
          autoComplete="off"
          type="email"
        />
        <InputWithLabel
          {...register('password')}
          placeholder="Password"
          label="Password"
          type="password"
        />
        <Button>Login</Button>
      </form>
    </div>
  );
};
