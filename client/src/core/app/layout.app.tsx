import { Outlet } from 'react-router';
import { AppProviders } from './providers.app';

import '@/index.css';

export function App() {
  return (
    <>
      <AppProviders>
        <Outlet />
      </AppProviders>
    </>
  );
}
