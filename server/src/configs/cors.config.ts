import { ENV } from './env.config';

export const CORS = {
  origin: ['http://localhost:5173', ENV.client.url],
  allowMethods: ['POST', 'GET'],
  exposeHeaders: ['Content-Length'],
};
