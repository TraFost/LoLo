import type { ZodType } from 'zod';
import type { MiddlewareHandler, ValidationTargets } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { zValidator as zv } from '@hono/zod-validator';

import { StatusCodes } from 'shared/src/http-status';

export const zValidator = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
): MiddlewareHandler =>
  zv(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, { cause: result.error });
    }
  });
