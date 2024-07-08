import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

import { RootPage, ExploreProfilePage, LoginPage } from './pages';
import { AuthLayout, MainLayout } from './components/layouts';
import { AuthProvider } from '@/auth/auth.context.tsx';
import { ProtectedRoute } from '@/auth/components/ProtectedRoute.tsx';

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
]);

export function Application() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
