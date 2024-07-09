import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthenticationStatusEnum } from '../auth.context';
import { useAuth } from '../auth.hook';

const AUTH_PATH = '/auth';

type ProtectedRouteProps = PropsWithChildren;

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { children } = props;

  const { status } = useAuth();

  if (status === AuthenticationStatusEnum.Authenticated) {
    return children;
  }

  return <Navigate to={AUTH_PATH} />;
};
