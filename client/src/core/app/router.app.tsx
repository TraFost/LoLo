import { createBrowserRouter, RouterProvider } from 'react-router';

import HomePage from '@/features/home/pages/home.page';

const router = createBrowserRouter([{ path: '/', element: <HomePage /> }]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
