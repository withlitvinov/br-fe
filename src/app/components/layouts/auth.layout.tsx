import { PropsWithChildren } from 'react';

type AuthLayoutProps = PropsWithChildren;

export const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;

  return (
    <div className="min-h-dvh flex items-center justify-center">{children}</div>
  );
};
