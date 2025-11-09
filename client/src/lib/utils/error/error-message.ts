import { CustomError } from '@/types/error';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const e = error as CustomError;
    return e.response?.data?.message || e.message || 'Something went wrong';
  }

  if (typeof error === 'object' && error !== null) {
    const e = error as CustomError;
    return e.response?.data?.message || e.data?.message || 'Something went wrong';
  }

  return 'Unknown error occurred';
}
