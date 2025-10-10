import { Outlet } from 'react-router';
import { AppProviders } from './providers.app';

import '@/index.css';

export default function AppLayout() {
  return (
    <>
      <AppProviders>
        <Outlet />
      </AppProviders>
    </>
  );
}
