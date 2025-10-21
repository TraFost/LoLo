import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { StatusCodes } from 'shared/src/http-status';
import type { ApiResponse, ErrorBody, ResponseWithData } from 'shared/src/types/response';

const isProd = process.env.NODE_ENV === 'production';

export const errorHandler = (err: unknown, c: Context) => {
  const requestId = (c.get('requestId') as string | undefined) ?? crypto.randomUUID();

  if (err instanceof HTTPException) {
    const res = err.getResponse();
    const status = res.status as ContentfulStatusCode;
    const cause: any = (err as any).cause;

    if (cause && cause._kind === 'zod') {
      const body: ErrorBody = {
        requestId,
        success: false,
        message: 'Validation failed',
        details: cause.issues.map((i: any) => ({
          path: Array.isArray(i.path) ? i.path.join('.') : '',
          message: i.message,
          code: i.code,
        })),
      };
      return c.json(body, { status });
    }

    const body: ErrorBody = {
      requestId,
      success: false,
      message: err.message || 'Request failed',
      details: !isProd && cause ? cause : undefined,
    };
    return c.json(body, { status });
  }

  const body: ErrorBody = {
    requestId,
    success: false,
    message: 'Something went wrong',
    details:
      !isProd && err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : undefined,
  };
  return c.json(body, { status: StatusCodes.INTERNAL_SERVER_ERROR });
};

export const success = (message = 'OK'): ApiResponse => ({
  message,
  success: true,
});

export const successWithData = <T>(message = 'OK', data: T): ResponseWithData<T> => ({
  message,
  success: true,
  data,
});
