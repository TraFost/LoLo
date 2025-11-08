import { ENV } from '@/core/configs/env.config';
import { createHttpClient } from 'shared/src/lib/axios';

export const apiClient = createHttpClient({
  baseURL: `${ENV.SERVER}/api`,
  timeoutMs: 10000,
  retries: 1,
  isClient: true,
});
