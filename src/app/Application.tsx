import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RootPage, ExploreProfilePage } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
  {
    path: '/:id',
    element: <ExploreProfilePage />,
  },
]);

export function Application() {
  return <RouterProvider router={router} />;
}
