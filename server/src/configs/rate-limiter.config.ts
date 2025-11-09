import { createHash } from 'node:crypto';

import type { Context } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';

const TEN_MINUTES_MS = 10 * 60 * 1000;

const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export const resolveRateLimitKey = (c: Context) => {
  const apiKey = c.req.header('x-api-key');
  if (apiKey?.trim()) {
    return hash(apiKey.trim());
  }

  const sessionId = c.req.header('x-session-id') ?? c.req.header('x-user-id');
  if (sessionId?.trim()) {
    return hash(sessionId.trim());
  }

  const routeKey = `${c.req.method} ${c.req.path}`;
  const userAgent = c.req.header('user-agent') ?? 'unknown-agent';
  const origin = c.req.header('origin') ?? c.req.header('referer') ?? 'unknown-origin';

  return hash(`${routeKey}::${userAgent}::${origin}`);
};

export const rateLimiterConfig = rateLimiter({
  windowMs: TEN_MINUTES_MS,
  limit: 100,
  keyGenerator: resolveRateLimitKey,
});

export const createRouteRateLimiter = (limit: number) =>
  rateLimiter({
    windowMs: TEN_MINUTES_MS,
    limit,
    keyGenerator: resolveRateLimitKey,
  });
