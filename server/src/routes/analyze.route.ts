import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { StatusCodes } from 'shared/src/http-status';
import type { PlatformRegion } from 'shared/src/types/account.type';

import { AnalyzeService } from '../services/analyze.service';
import { zValidator } from '../middlewares/validator.middleware';

import { improvementRequestSchema, type ImprovementRequest } from '../schemas/analyze.schema';
import { buildSystemPrompt, buildUserPrompt } from '../lib/llm/prompt';
import { invokeNovaMicroJSON } from '../lib/llm/bedrock';
import { successWithData } from '../lib/utils/response.util';

const app = new Hono();

app.post('/improvement', zValidator('json', improvementRequestSchema), async (c) => {
  try {
    const body = (await c.req.json()) as ImprovementRequest;

    const improvementService = new AnalyzeService(body.region as PlatformRegion);

    const { role, patch, matchData } = await improvementService.getImprovementAnalysis(body.puuid);

    const systemText = buildSystemPrompt();
    const userText = buildUserPrompt(role, patch, matchData);

    const { text, stop, usage } = await invokeNovaMicroJSON(systemText, userText, {});

    console.log('Nova response:', { stop, usage });

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error('Invalid JSON from model:', text);

      parsed = {
        analysis: {
          overall: 'Summary unavailable.',
          strengths: [],
          improvement: [],
        },
      };
    }

    return c.json(
      successWithData('Improvement analysis generated', { improvement: parsed }),
      StatusCodes.OK,
    );
  } catch (err: unknown) {
    console.error(err, 'Error in improvement analysis');

    throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
      message: 'Failed to generate improvement analysis',
      cause: err,
    });
  }
});

export default app;
