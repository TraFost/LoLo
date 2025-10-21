import { handle } from 'hono/aws-lambda';

import { createApp } from '../server';

const app = createApp();
export const handler = handle(app);
