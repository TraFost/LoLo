import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';

import { StatusCodes } from 'shared/src/http-status';

import accountRoutes from './routes/account.route';
import statisticsRoutes from './routes/statistics.route';
import analyzeRoutes from './routes/analyze.route';
import {
  VALID_CARD_TYPES,
  buildImageUrl,
  buildShareUrl,
  shareImageRoutes,
} from './routes/share-image.route';
import type { ShareCardType } from 'shared/src/types/share.type';

import { CORS } from './configs/cors.config';
import { rateLimiterConfig } from './configs/rate-limiter.config';

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

  app.use(rateLimiterConfig);

  app.use('*', requestLogger);
  app.use(logger());

  app.use(cors(CORS));
  app.use(prettyJSON());
  app.use(secureHeaders());

  app.get('/', (c) => c.text('Hello from LoLo Server'));

  api.route('/account', accountRoutes);
  api.route('/statistics', statisticsRoutes);
  api.route('/analyze', analyzeRoutes);
  api.route('/share-image', shareImageRoutes);

  app.route('/', api);

  const CARD_META: Record<ShareCardType, { title: string; description: string }> = {
    'player-overview': {
      title: 'LoLo – Player Overview',
      description: 'Check out my latest LoLo performance snapshot.',
    },
    'most-played': {
      title: 'LoLo – Most Played Champions',
      description: 'These champions are carrying my climb. See why!',
    },
    'pro-comparison': {
      title: 'LoLo – Pro Player Comparison',
      description: 'See which pro player my playstyle mirrors the most.',
    },
  };

  const DEFAULT_META = {
    title: 'LoLo – Share',
    description: 'Analyze your League of Legends performance with LoLo.',
  };

  app.get('/share/:puuid/:cardType', (c) => {
    const { puuid, cardType } = c.req.param();
    const typed = cardType as ShareCardType;

    if (!VALID_CARD_TYPES.includes(typed)) {
      return c.text('Invalid share card type', StatusCodes.NOT_FOUND);
    }

    const imageUrl = buildImageUrl(puuid, typed);
    const shareUrl = buildShareUrl(puuid, typed);
    const meta = CARD_META[typed] ?? DEFAULT_META;

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.title}</title>
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${shareUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  </head>
  <body style="margin:0; background:#050511; color:#f8fafc; display:flex; justify-content:center; align-items:center; min-height:100vh;">
    <main>
      <img src="${imageUrl}" alt="LoLo share image" style="max-width:100%; height:auto;" />
    </main>
  </body>
</html>`;

    return c.html(html);
  });

  app.notFound((c) =>
    c.json({ success: false, message: 'Route not found' }, StatusCodes.NOT_FOUND),
  );

  return app;
}
