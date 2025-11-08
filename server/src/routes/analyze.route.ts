import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { StatusCodes } from 'shared/src/http-status';
import type { PlatformRegion } from 'shared/src/types/account.type';
import type { AnalyzeRequestDTO } from 'shared/src/types/analyze.dto';

import { AnalyzeService } from '../services/analyze.service';
import { zValidator } from '../middlewares/validator.middleware';

import { improvementRequestSchema } from '../schemas/analyze.schema';
import { successWithData } from '../lib/utils/response.util';
import { handleRiotError } from '../lib/utils/riot-error.util';

const app = new Hono();

app.post('/improvement', zValidator('json', improvementRequestSchema), async (c) => {
  try {
    const body = (await c.req.json()) as AnalyzeRequestDTO;

    const improvementService = new AnalyzeService(body.region as PlatformRegion);
    const report = await improvementService.generateImprovementReport(body.puuid);

    return c.json(successWithData('Improvement analysis generated', report), StatusCodes.OK);
  } catch (err: unknown) {
    console.error('Error in improvement analysis', err);
    handleRiotError(
      err,
      StatusCodes.INTERNAL_SERVER_ERROR as ContentfulStatusCode,
      'Failed to generate improvement analysis',
    );
  }
});

app.post('/pro-comparison', zValidator('json', improvementRequestSchema), async (c) => {
  try {
    const body = (await c.req.json()) as AnalyzeRequestDTO;

    const analyzeService = new AnalyzeService(body.region as PlatformRegion);
    const comparison = await analyzeService.generateProComparison(body.puuid);

    return c.json(successWithData('Pro comparison generated', comparison), StatusCodes.OK);
  } catch (err: unknown) {
    console.error('Error in pro comparison analysis', err);
    handleRiotError(
      err,
      StatusCodes.INTERNAL_SERVER_ERROR as ContentfulStatusCode,
      'Failed to generate pro comparison',
    );
  }
});

export default app;
