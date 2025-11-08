import { createHash } from 'node:crypto';

import { rateLimiter } from 'hono-rate-limiter';

export const rateLimiterConfig = rateLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  keyGenerator: (c) => {
    const hash = (value: string) => createHash('sha256').update(value).digest('hex');

    const authHeader = c.req.header('authorization');
    if (authHeader?.trim()) {
      return hash(authHeader.trim());
    }

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
  },
});
