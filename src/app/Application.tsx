import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { AuthProvider, AuthenticationStatusEnum } from '@/auth/auth.context';
import { useAuth } from '@/auth/auth.hook';
import { ProtectedRoute } from '@/auth/components';
import { PageTitleProvider } from '@/common/contexts';

import { AuthLayout, MainLayout } from './components/layouts';
import { ExplorePage, LoginPage, NewPage, RootPage } from './pages';

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
        path: 'new',
        element: <NewPage />,
      },
      {
        path: ':id',
        element: <ExplorePage />,
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
      <PageTitleProvider>
        <ApplicationContent />
      </PageTitleProvider>
    </AuthProvider>
  );
}
