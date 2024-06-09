import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import ExploreProfile from './routes/explore-profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/:id',
    element: <ExploreProfile />,
  },
]);

function Application() {
  return <RouterProvider router={router} />;
}

export default Application;
