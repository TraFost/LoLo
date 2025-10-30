import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { AccountService } from '../services/account.service';

import { accountSchema } from '../schemas/account.schema';

import { zValidator } from '../middlewares/validator.middleware';

import { successWithData } from '../lib/utils/response.util';

import { StatusCodes } from 'shared/src/http-status';
import type { Region } from 'shared/src/types/account.type';

const app = new Hono();

app.get('/:gameName/:tagLine', zValidator('param', accountSchema), async (c) => {
  const platformRegion = c.req.query('region');

  if (!platformRegion?.trim()) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, {
      message: 'Region is Required!',
    });
  }

  const { gameName, tagLine } = c.req.param();

  const accountService = new AccountService(platformRegion as Region);

  try {
    const data = await accountService.getAccountByRiotId({ gameName, tagLine });
    const profilePict = await accountService.getAccountPict(data.puuid);

    return c.json(
      successWithData('LoL Account Fetched!', { ...data, profilePict }),
      StatusCodes.OK,
    );
  } catch (err: unknown) {
    console.error(err, 'err');

    throw new HTTPException(StatusCodes.BAD_GATEWAY, {
      message: 'Upstream Riot API not reachable',
      cause: err,
    });
  }
});

export default app;
