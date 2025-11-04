import { ErrorSection } from '@/ui/organisms/error-section.organism';
import { LoadingSection } from '@/ui/organisms/loading-section.organism';

export function RenderState({
  isRedirecting,
  isAccountLoading,
  isLoading,
  isError,
  error,
  children,
}: {
  isRedirecting?: boolean;
  isAccountLoading?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  if (isRedirecting) return <LoadingSection isLoading={isLoading} />;
  if (isAccountLoading) return <LoadingSection isLoading={isAccountLoading} />;
  if (isLoading) return <LoadingSection isLoading={isLoading} showProgressBar={true} />;
  if (isError) return <ErrorSection error={error || 'Unknown error'} />;
  return <>{children}</>;
}
