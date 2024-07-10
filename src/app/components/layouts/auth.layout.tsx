import { PropsWithChildren } from 'react';
import { useAuth } from '@/auth/auth.hook.ts';
import { AuthenticationStatusEnum } from '@/auth/auth.context.tsx';
import { Navigate } from 'react-router-dom';

type AuthLayoutProps = PropsWithChildren;

export const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;

  const { status } = useAuth();

  if (status === AuthenticationStatusEnum.Authenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-dvh h-dvh flex items-center justify-center">
      {children}
    </div>
  );
};
