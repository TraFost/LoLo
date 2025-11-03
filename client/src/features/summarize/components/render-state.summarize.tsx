import { ErrorSection } from '@/ui/organisms/error-section.organism';
import { LoadingSection } from '@/ui/organisms/loading-section.organism';

export function RenderState({
  isRedirecting,
  isLoading,
  isError,
  error,
  children,
}: {
  isRedirecting?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  if (isRedirecting) return <LoadingSection />;
  if (isLoading) return <LoadingSection />;
  if (isError) return <ErrorSection error={error || 'Unknown error'} />;
  return <>{children}</>;
}
