import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { RootPage, ExploreProfilePage } from './pages';
import { MainLayout } from './components/layouts';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
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
]);

export function Application() {
  return <RouterProvider router={router} />;
}
