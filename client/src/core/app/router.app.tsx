import { createBrowserRouter, RouterProvider, Navigate, type RouteObject } from 'react-router';
import { HomePage } from '@/features/home/pages/home.page';
import { AnalyzePage } from '@/features/analyze/pages/analyze.page';
import { SummarizePage } from '@/features/summarize/page/summarize.page';

export interface Page {
  id: string;
  label: string;
  path: string;
  element: RouteObject['element'];
}

export const PAGES: Page[] = [
  { id: 'home', label: 'Home', path: '/home', element: <HomePage /> },
  { id: 'analyze', label: 'Analyze', path: '/analyze', element: <AnalyzePage /> },
  { id: 'summarize', label: 'Summarize', path: '/summarize', element: <SummarizePage /> },
  { id: 'team', label: 'Team', path: '/team', element: <></> },
] as const;

const DEFAULT_PATH = PAGES.find((p) => p.id === 'home')!.path;

const createRoute = (option: RouteObject): RouteObject => ({
  id: option.id,
  path: option.path,
  element: option.element,
});

const router = createBrowserRouter([
  { path: '/', element: <Navigate to={DEFAULT_PATH} replace /> },
  ...PAGES.map((p) => createRoute(p)),
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
