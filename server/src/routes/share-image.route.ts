import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { StatusCodes } from 'shared/src/http-status';
import type { ShareCardType } from 'shared/src/types/share.type';

import { zValidator } from '../middlewares/validator.middleware';
import { shareImageQuerySchema, type ShareImageQuery } from '../schemas/share-image.schema';
import { ENV } from '../configs/env.config';
import { getPublicObjectUrl, headObject, isS3Enabled, putObject } from '../lib/utils/s3.util';

const VALID_CARD_TYPES: ShareCardType[] = ['player-overview', 'most-played', 'pro-comparison'];

const SHARE_PREFIX = 'share';

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

const SHARE_PAGE_BASE = trimTrailingSlash(
  process.env.SHARE_PUBLIC_URL || process.env.AWS_LAMBDA_FUNCTION_URL || ENV.client.url,
);

function buildShareKey(puuid: string, cardType: ShareCardType): string {
  return `${SHARE_PREFIX}/${puuid}/${cardType}.png`;
}

function buildShareUrl(puuid: string, cardType: ShareCardType): string {
  return `${SHARE_PAGE_BASE}/share/${puuid}/${cardType}`;
}

function buildImageUrl(puuid: string, cardType: ShareCardType): string {
  const key = buildShareKey(puuid, cardType);
  return getPublicObjectUrl(key);
}

function assertS3Enabled() {
  if (!isS3Enabled()) {
    throw new HTTPException(StatusCodes.SERVICE_UNAVAILABLE, {
      message: 'S3 storage is not configured. Sharing is currently unavailable.',
    });
  }
}

const app = new Hono();

app.get('/status', zValidator('query', shareImageQuerySchema), async (c) => {
  const { puuid, cardType } = c.req.query() as ShareImageQuery;

  const castedCardType = cardType as ShareCardType;

  if (!VALID_CARD_TYPES.includes(castedCardType)) {
    return c.json({ exists: false }, StatusCodes.OK);
  }

  if (!isS3Enabled()) {
    return c.json({ exists: false }, StatusCodes.OK);
  }

  const key = buildShareKey(puuid, castedCardType);

  try {
    const exists = await headObject(key);

    if (!exists) {
      return c.json({ exists: false }, StatusCodes.OK);
    }

    return c.json(
      {
        exists: true,
        shareUrl: buildShareUrl(puuid, castedCardType),
        imageUrl: buildImageUrl(puuid, castedCardType),
      },
      StatusCodes.OK,
    );
  } catch (error) {
    console.warn(`[share-image] headObject failed for ${key}`, error);
    return c.json({ exists: false }, StatusCodes.OK);
  }
});

app.post('/upload', async (c) => {
  assertS3Enabled();

  const form = await c.req.formData();
  const puuid = (form.get('puuid') ?? '').toString();
  const cardType = (form.get('cardType') ?? '').toString();
  const fileEntry = form.get('file');

  if (!puuid || !cardType || !(fileEntry instanceof Blob)) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, {
      message: 'puuid, cardType, and PNG file are required.',
    });
  }

  if (!VALID_CARD_TYPES.includes(cardType as ShareCardType)) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, {
      message: 'Invalid card type.',
    });
  }

  if (fileEntry.type !== 'image/png') {
    throw new HTTPException(StatusCodes.UNSUPPORTED_MEDIA_TYPE, {
      message: 'Only PNG files are supported.',
    });
  }

  const arrayBuffer = await fileEntry.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const key = buildShareKey(puuid, cardType as ShareCardType);

  await putObject({
    key,
    body: buffer,
    contentType: 'image/png',
    metadata: { cardtype: cardType, puuid },
  });

  return c.json(
    {
      shareUrl: buildShareUrl(puuid, cardType as ShareCardType),
      imageUrl: buildImageUrl(puuid, cardType as ShareCardType),
    },
    StatusCodes.OK,
  );
});

export { VALID_CARD_TYPES, buildImageUrl, buildShareKey, buildShareUrl, app as shareImageRoutes };
