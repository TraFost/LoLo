import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';

import { StatusCodes } from 'shared/src/http-status';
import type { ApiResponse, ErrorBody, ResponseWithData } from 'shared/src/types/response';

const isProd = process.env.NODE_ENV === 'production';

export const errorHandler = (err: unknown, c: Context) => {
  const requestId = (c.get('requestId') as string | undefined) ?? crypto.randomUUID();

  if (err instanceof HTTPException) {
    const res = err.getResponse();
    res.headers.set('x-request-id', requestId);
    return res;
  }

  if (err instanceof ZodError) {
    const body: ErrorBody = {
      success: false,
      message: 'Validation failed',
      requestId,
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
      })),
    };
    console.error('[validation]', { requestId, issues: err.issues });

    return c.json(body, { status: StatusCodes.BAD_REQUEST });
  }

  const body: ErrorBody = {
    success: false,
    message: 'Something went wrong',
    requestId,
    details:
      !isProd && err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : undefined,
  };

  console.error('[unhandled]', { requestId, error: err });

  return c.json(body, { status: StatusCodes.INTERNAL_SERVER_ERROR });
};

export const success = (message = 'OK'): ApiResponse => ({
  message,
  success: true,
});

export const successWithData = <T>(data: T, message = 'OK'): ResponseWithData<T> => ({
  message,
  success: true,
  data,
});
