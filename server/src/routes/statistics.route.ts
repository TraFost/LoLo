import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { StatisticsService } from '../services/statistics.service';

import { statisticsSchema, statisticsQuerySchema } from '../schemas/statistics.schema';

import { zValidator } from '../middlewares/validator.middleware';

import { successWithData } from '../lib/utils/response.util';

import { StatusCodes } from 'shared/src/http-status';

const app = new Hono();

app.get(
  '/:puuid',
  zValidator('param', statisticsSchema),
  zValidator('query', statisticsQuerySchema),
  async (c) => {
    const { puuid } = c.req.param();
    const region = c.req.query('region')?.toLowerCase()!;

    const statisticsService = new StatisticsService(region);

    try {
      const data = await statisticsService.getStatistics(puuid);
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
