import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { StatusCodes } from 'shared/src/http-status';
import type { PlatformRegion } from 'shared/src/types/account.type';

import { zValidator } from '../middlewares/validator.middleware';
import { successWithData } from '../lib/utils/response.util';
import { proIngestSchema, type ProIngestRequest } from '../schemas/pro.schema';
import { ProService } from '../services/pro.service';

const app = new Hono();

app.post('/ingest', zValidator('json', proIngestSchema), async (c) => {
  try {
    const body = (await c.req.json()) as ProIngestRequest;

    const service = new ProService();
    const result = await service.ingestPro({
      id: body.id,
      name: body.name,
      puuid: body.puuid,
      region: body.region as PlatformRegion,
      role: body.role,
    });

    return c.json(successWithData('Pro player ingested', result), StatusCodes.CREATED);
  } catch (err: unknown) {
    console.error(err, 'Error ingesting pro player');

    throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
      message: 'Failed to ingest pro player',
      cause: err,
    });
  }
});

export default app;
