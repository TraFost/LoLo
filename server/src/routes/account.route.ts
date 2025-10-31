import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { PlatformRegion } from 'shared/src/types/account.type';
import { StatusCodes } from 'shared/src/http-status';

import { AccountService } from '../services/account.service';
import { accountSchema } from '../schemas/account.schema';
import { zValidator } from '../middlewares/validator.middleware';
import { successWithData } from '../lib/utils/response.util';

const app = new Hono();

app.get('/:gameName/:tagLine', zValidator('param', accountSchema), async (c) => {
  const platformRegion = c.req.query('region');

  if (!platformRegion?.trim()) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, {
      message: 'Region is Required!',
    });
  }

  const { gameName, tagLine } = c.req.param();
  const accountService = new AccountService(platformRegion as PlatformRegion);

  try {
    const data = await accountService.getAccountByRiotId({ gameName, tagLine });

    return c.json(successWithData('LoL Account Fetched!', { ...data }), StatusCodes.OK);
  } catch (err: any) {
    const status = err?.response?.status;
    const riotBody = err?.response?.data;

    if (status === 401 || status === 403) {
      throw new HTTPException(status, {
        message: 'Riot rejected the request',
        cause: riotBody ?? err,
      });
    }

    if (status === 404) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: 'Account not found on Riot',
        cause: riotBody ?? err,
      });
    }

    throw new HTTPException(StatusCodes.BAD_GATEWAY, {
      message: 'Upstream Riot API not reachable',
      cause: err,
    });
  }
});

export default app;
