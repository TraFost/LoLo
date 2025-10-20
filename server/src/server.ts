import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';

import { StatusCodes } from 'shared/src/http-status';
import type { ApiResponse } from 'shared/src/types/response';
import { CORS } from './configs/cors.config';

export function createApp() {
  const app = new Hono();
  const api = new Hono().basePath('/api');

  app.use(cors(CORS));
  app.use(csrf());
  app.use(logger());
  app.use(prettyJSON());
  app.use(secureHeaders());

  app.get('/', (c) => c.text('Hello from LoLo Server'));

  api.post('/analyze', (c) => c.text('here is your analyze'));

  app.route('/', api);

  app.get('*', (c) => {
    const data: ApiResponse = {
      message: 'Endpoint not available Or you might have a typos',
      success: false,
    };
    return c.json(data, { status: StatusCodes.NOT_FOUND });
  });

  return app;
}
