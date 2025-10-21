import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

type ErrorDetails = Record<string, unknown> | undefined;

function httpError(status: ContentfulStatusCode, message: string, details?: ErrorDetails): never {
  throw new HTTPException(status, { message: details ? `${message}` : message });
}

export const BadRequest = (message = 'Bad request', details?: ErrorDetails) =>
  httpError(400, message, details);

export const Unauthorized = (message = 'Unauthorized') => httpError(401, message);

export const Forbidden = (message = 'Forbidden') => httpError(403, message);

export const NotFound = (message = 'Not found') => httpError(404, message);

export const Conflict = (message = 'Conflict') => httpError(409, message);

export const Unprocessable = (message = 'Unprocessable entity', details?: ErrorDetails) =>
  httpError(422, message, details);

export const TooManyRequests = (message = 'Too many requests') => httpError(429, message);

export const ServerError = (message = 'Internal server error') => httpError(500, message);
