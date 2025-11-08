import type { RefObject } from 'react';
import type { ShareCardType } from 'shared/src/types/share.type';

import { ENV } from '@/core/configs/env.config';
import { cardToPngBlob } from '../image-card/card-to-png-blob.util';

interface GetOrCreateShareUrlOptions {
  puuid: string;
  cardType: ShareCardType;
  ref: RefObject<HTMLElement | null>;
}

interface ShareStatusResponse {
  exists: boolean;
  shareUrl?: string;
}

interface ShareUploadResponse {
  shareUrl: string;
}

const RAW_SERVER = (ENV.SERVER ?? '').replace(/\/$/, '');
const API_BASE = RAW_SERVER.endsWith('/api') ? RAW_SERVER.slice(0, -4) : RAW_SERVER;

const STATUS_ENDPOINT = API_BASE ? `${API_BASE}/api/share-image/status` : '/api/share-image/status';
const UPLOAD_ENDPOINT = API_BASE ? `${API_BASE}/api/share-image/upload` : '/api/share-image/upload';

export async function getOrCreateShareUrl(options: GetOrCreateShareUrlOptions): Promise<string> {
  const { puuid, cardType, ref } = options;

  const params = new URLSearchParams({ puuid, cardType });

  const statusRes = await fetch(`${STATUS_ENDPOINT}?${params.toString()}`, {
    method: 'GET',
  });

  if (!statusRes.ok) {
    throw new Error('Failed to check share image status.');
  }

  const status = (await statusRes.json()) as ShareStatusResponse;

  if (status.exists && status.shareUrl) {
    return status.shareUrl;
  }

  const blob = await cardToPngBlob(ref);

  const formData = new FormData();
  formData.append('puuid', puuid);
  formData.append('cardType', cardType);
  formData.append('file', blob, `${cardType}.png`);

  const uploadRes = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload share image.');
  }

  const upload = (await uploadRes.json()) as ShareUploadResponse;
  return upload.shareUrl;
}
