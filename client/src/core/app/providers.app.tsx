import type { ReactNode } from 'react';

import AppRouter from './router.app';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <AppRouter />

      {children}
    </>
  );
}
