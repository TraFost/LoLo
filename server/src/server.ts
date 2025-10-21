import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';

import { StatusCodes } from 'shared/src/http-status';

import accountRoutes from './routes/account.route';
import statisticsRoutes from './routes/statistics.route';

import { CORS } from './configs/cors.config';

import { errorHandler } from './lib/utils/response.util';

import { requestLogger } from './middlewares/logger.middleware';

export function createApp() {
  const app = new Hono();
  const api = new Hono().basePath('/api');

  app.use('*', async (c, next) => {
    try {
      await next();
    } catch (err) {
      return errorHandler(err, c);
    }
  });
  app.onError(errorHandler);

  app.use('*', requestLogger);
  app.use(logger());

  app.use(cors(CORS));
  app.use(csrf());
  app.use(prettyJSON());
  app.use(secureHeaders());

  app.get('/', (c) => c.text('Hello from LoLo Server'));

  api.route('/account', accountRoutes);
  api.route('/statistics', statisticsRoutes);

  app.route('/', api);

  app.notFound((c) =>
    c.json({ success: false, message: 'Route not found' }, StatusCodes.NOT_FOUND),
  );

  return app;
}
