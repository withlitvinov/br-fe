import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

import { ExploreProfilePage, LoginPage, RootPage } from './pages';
import { AuthLayout, MainLayout } from './components/layouts';
import {
  AuthenticationStatusEnum,
  AuthProvider,
} from '@/auth/auth.context.tsx';
import { ProtectedRoute } from '@/auth/components/ProtectedRoute.tsx';
import { useAuth } from '@/auth/auth.hook.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RootPage />,
      },
      {
        path: ':id',
        element: <ExploreProfilePage />,
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="login" />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

function ApplicationContent() {
  const { status } = useAuth();

  if (status === AuthenticationStatusEnum.Loading) {
    return <>Loading...</>;
  }

  return <RouterProvider router={router} />;
}

export function Application() {
  return (
    <AuthProvider>
      <ApplicationContent />
    </AuthProvider>
  );
}
