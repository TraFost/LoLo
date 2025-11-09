import { ENV } from '@/core/configs/env.config';
import { createHttpClient } from 'shared/src/lib/axios';

export const apiClient = createHttpClient({
  baseURL: `${ENV.SERVER}/api`,
  timeoutMs: 10000,
  retries: 1,
  isClient: true,
});

export const fetchWithProgress = async <T>(
  url: string,
  options: {
    params?: Record<string, any>;
    onProgress?: (percent: number) => void;
  } = {},
): Promise<T> => {
  const res = await apiClient.get<T>(url, {
    params: options.params,
    onDownloadProgress: (event) => {
      if (event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        options.onProgress?.(percent);
      }
    },
  });
  return res.data;
};
