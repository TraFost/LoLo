import type { Context, Next } from 'hono';

export async function requestLogger(c: Context, next: Next) {
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);

  const start = Date.now();
  try {
    await next();
  } finally {
    const ms = Date.now() - start;

    c.res.headers.set('x-request-id', requestId);

    const log = {
      ts: new Date().toISOString(),
      id: requestId,
      method: c.req.method,
      path: new URL(c.req.url).pathname,
      status: c.res.status,
      ms,
      ua: c.req.header('user-agent') ?? '',
      ip: c.req.header('x-forwarded-for') ?? c.req.header('cf-connecting-ip') ?? '',
    };

    console.info(JSON.stringify(log));
  }
}
