import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';
import qs from 'qs';
import { sleep } from './utils';

let httpAgent: any;
let httpsAgent: any;
declare const window: any;

if (typeof window === 'undefined') {
  // Node.js only
  const http = require('node:http');
  const https = require('node:https');
  httpAgent = new http.Agent({ keepAlive: true, maxSockets: 128 });
  httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 128 });
}

export type HttpInstance = AxiosInstance;

type CreateClientOpts = {
  baseURL: string;
  timeoutMs?: number;
  retries?: number;
  defaultHeaders?: Record<string, string>;
  userAgent?: string;
  onLog?: (msg: string, ctx?: any) => void;
  isClient?: boolean;
};

export function createHttpClient(opts: CreateClientOpts): AxiosInstance {
  const {
    baseURL,
    timeoutMs = 10000,
    retries = 3,
    defaultHeaders = {},
    userAgent = 'LoLo-Client/1.0',
    onLog,
    isClient = false,
  } = opts;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...defaultHeaders,
  };

  if (!isClient) {
    headers['User-Agent'] = userAgent;
  }

  const instance = axios.create({
    baseURL,
    timeout: timeoutMs,
    headers,
    ...(isClient ? {} : { httpAgent, httpsAgent }),
    paramsSerializer: { serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) },
    validateStatus: (s) => s >= 200 && s < 300,
    decompress: true,
    transitional: { clarifyTimeoutError: true },
  });

  instance.interceptors.request.use((cfg) => {
    const id = crypto.randomUUID();
    if (cfg.headers instanceof AxiosHeaders) cfg.headers.set('X-Request-Id', id);
    else (cfg.headers as Record<string, string>)['X-Request-Id'] = id;
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
        const delay = ra
          ? Number(ra) * 1000
          : 300 + Math.floor(Math.random() * 400) + 2 ** cfg.__retryCount * 200;
        onLog?.('retrying request', { url: cfg.url, attempt: cfg.__retryCount, status, delay });
        await sleep(delay);
        return instance(cfg);
      }

      if (status === 401 || status === 403 || status === 404) {
        return Promise.reject(error);
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
