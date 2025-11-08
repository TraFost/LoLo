import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import type { PlatformRegion } from 'shared/src/types/account.type';
import { StatusCodes } from 'shared/src/http-status';

import { AccountService } from '../services/account.service';
import { accountSchema } from '../schemas/account.schema';
import { zValidator } from '../middlewares/validator.middleware';
import { successWithData } from '../lib/utils/response.util';
import { handleRiotError } from '../lib/utils/riot-error.util';

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
    const cached = await accountService.getCachedAccount(gameName, tagLine);

    if (cached) {
      return c.json(
        successWithData('LoL Account Fetched!', {
          ...cached.account,
          profilePict: cached.profilePict,
          rank: cached.rank ?? null,
          summonerLevel: cached.summoner.summonerLevel,
        }),
        StatusCodes.OK,
      );
    }

    const account = await accountService.getAccountByRiotId({ gameName, tagLine });
    const [{ summoner, profilePict }, rankEntries] = await Promise.all([
      accountService.getAccountProfile(account.puuid),
      accountService.getLeagueEntries(account.puuid),
    ]);

    const rank = accountService.selectPrimaryRank(rankEntries);

    try {
      await accountService.saveAccountSnapshot({
        region: platformRegion as PlatformRegion,
        account,
        summoner,
        profilePict,
        rankEntries,
        rank,
      });
    } catch (snapshotErr) {
      console.error('Failed to persist account snapshot', snapshotErr);
    }

    return c.json(
      successWithData('LoL Account Fetched!', {
        ...account,
        profilePict,
        rank,
        summonerLevel: summoner.summonerLevel,
      }),
      StatusCodes.OK,
    );
  } catch (err: unknown) {
    console.error('Failed to fetch account data', err);
    handleRiotError(
      err,
      StatusCodes.BAD_GATEWAY as ContentfulStatusCode,
      'Upstream Riot API not reachable',
    );
  }
});

export default app;
