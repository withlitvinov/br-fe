import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
]);

function Application() {
  return <RouterProvider router={router} />;
}

export default Application;
