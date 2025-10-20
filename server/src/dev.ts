import { serve } from '@hono/node-server';
import { createApp } from './server';

import { ENV } from './configs/env.config';

const app = createApp();

serve({ fetch: app.fetch, port: ENV.port });

console.log(`Dev server on http://localhost:${ENV.port}`);
