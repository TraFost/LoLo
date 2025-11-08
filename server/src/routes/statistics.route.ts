import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { StatusCodes } from 'shared/src/http-status';
import type { PlatformRegion } from 'shared/src/types/account.type';

import { StatisticsService } from '../services/statistics.service';
import { statisticsSchema, statisticsQuerySchema } from '../schemas/statistics.schema';

import { zValidator } from '../middlewares/validator.middleware';
import { successWithData } from '../lib/utils/response.util';
import { getJSONFromS3, isS3Enabled, putObject } from '../lib/utils/s3.util';

type StatisticsPayload = Awaited<ReturnType<StatisticsService['getStatistics']>>;

const app = new Hono();

app.get(
  '/:puuid',
  zValidator('param', statisticsSchema),
  zValidator('query', statisticsQuerySchema),
  async (c) => {
    const { puuid } = c.req.param();
    const region = c.req.query('region')?.toLowerCase()! as PlatformRegion;

    const cacheKey = `statistics/${region}/${puuid}.json`;

    let cached: StatisticsPayload | null = null;

    if (isS3Enabled()) {
      try {
        cached = await getJSONFromS3<StatisticsPayload>(cacheKey);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '';
        const code = (err as any)?.Code ?? (err as any)?.code ?? (err as any)?.name ?? '';
        const status = (err as any)?.$metadata?.httpStatusCode;
        const isExpectedMiss =
          code === 'NoSuchKey' ||
          code === 'NotFound' ||
          status === 404 ||
          message.includes('NoSuchKey') ||
          message.includes('S3 access is disabled');

        if (!isExpectedMiss) {
          console.warn(`Cache read failed for ${cacheKey}`, err);
        }
      }
    }

    if (cached) {
      return c.json(successWithData('Statistics fetched successfully!', cached), StatusCodes.OK);
    }

    const statisticsService = new StatisticsService(region);

    try {
      const data = await statisticsService.getStatistics(puuid);

      if (isS3Enabled()) {
        try {
          await putObject({
            key: cacheKey,
            body: JSON.stringify(data),
            contentType: 'application/json',
            metadata: { cachedat: new Date().toISOString() },
          });
        } catch (cacheErr) {
          const message = cacheErr instanceof Error ? cacheErr.message : '';
          if (!message.includes('S3 access is disabled')) {
            console.warn(`Cache write failed for ${cacheKey}`, cacheErr);
          }
        }
      }

      return c.json(successWithData('Statistics fetched successfully!', data), StatusCodes.OK);
    } catch (err: unknown) {
      console.error('Error fetching statistics:', err);

      throw new HTTPException(StatusCodes.BAD_GATEWAY, {
        message: 'Failed to fetch statistics from Riot API',
        cause: err,
      });
    }
  },
);

export default app;
