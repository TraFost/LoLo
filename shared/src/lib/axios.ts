import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import qs from 'qs';

type CreateClientOpts = {
  baseURL: string;
  timeoutMs?: number;
  retries?: number;
  defaultHeaders?: Record<string, string>;
  userAgent?: string;
  onLog?: (msg: string, ctx?: any) => void;
};

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function createHttpClient(opts: CreateClientOpts): AxiosInstance {
  const {
    baseURL,
    timeoutMs = 10000,
    retries = 3,
    defaultHeaders = {},
    userAgent = 'LoLo-Client/1.0',
    onLog,
  } = opts;

  const instance = axios.create({
    baseURL,
    timeout: timeoutMs,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': userAgent,
      ...defaultHeaders,
    },
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    },
    validateStatus: (s) => s >= 200 && s < 300,
  });

  instance.interceptors.request.use((cfg) => {
    const id = crypto.randomUUID();

    if (cfg.headers instanceof AxiosHeaders) {
      cfg.headers.set('X-Request-Id', id);
    } else {
      (cfg.headers as Record<string, string>)['X-Request-Id'] = id;
    }

    return cfg;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError<{ message?: string }>) => {
      const cfg = (error.config ?? {}) as AxiosRequestConfig & { __retryCount?: number };
      const status = error.response?.status;
      const shouldRetry = status === 429 || (status !== undefined && status >= 500);

      cfg.__retryCount = cfg.__retryCount ?? 0;

      if (shouldRetry && cfg.__retryCount < retries) {
        cfg.__retryCount++;
        const ra = error.response?.headers?.['retry-after'];
        const delay = ra ? Number(ra) * 1000 : Math.min(1000 * 2 ** cfg.__retryCount, 5000);
        onLog?.('retrying request', { url: cfg.url, attempt: cfg.__retryCount, status, delay });
        await sleep(delay);
        return instance(cfg);
      }

      const norm = {
        status: status || 0,
        code: error.code || 'REQUEST_FAILED',
        message: error.response?.data?.message || error.message || 'Request failed',
        data: error.response?.data,
        url: cfg.url,
        method: cfg.method,
      };
      onLog?.('request failed', norm);
      return Promise.reject(norm);
    },
  );

  return instance;
}
