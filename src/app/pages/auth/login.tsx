import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/auth/auth.hook';

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
    <div className="w-full max-w-80">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <input {...register('email')} placeholder="Email" autoComplete="off" />
        <input
          {...register('password')}
          placeholder="Password"
          autoComplete="off"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
