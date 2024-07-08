import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../auth.hook';

const AUTH_PATH = '/auth';

type ProtectedRouteProps = PropsWithChildren;

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { children } = props;

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to={AUTH_PATH} />;
};
