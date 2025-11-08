const rawServer = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3000').trim();
const normalizedServer = rawServer.replace(/\/$/, '');

const rawAppUrl = (import.meta.env.VITE_APP_URL || '').trim();
const fallbackAppUrl =
  rawAppUrl.length > 0
    ? rawAppUrl
    : typeof window !== 'undefined' && typeof window.location?.origin === 'string'
    ? window.location.origin
    : 'http://localhost:5173';
const normalizedAppUrl = fallbackAppUrl.replace(/\/$/, '');

const rawShareBase = (import.meta.env.VITE_SHARE_BASE_URL || '').trim();
const resolvedShareBase = (rawShareBase.length > 0 ? rawShareBase : normalizedServer).replace(
  /\/$/,
  '',
);

const normalizedShareBase = (() => {
  try {
    const url = new URL(resolvedShareBase);
    if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
      url.port = '';
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return resolvedShareBase;
  }
})();

export const ENV = {
  SERVER: normalizedServer,
  APP_URL: normalizedAppUrl,
  SHARE_BASE_URL: normalizedShareBase,
} as const;
