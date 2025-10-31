import { createHttpClient, type HttpInstance } from 'shared/src/lib/axios';
import { PLATFORM_HOST_MAP, REGION_MAP } from 'shared/src/constants/match.constant';
import type { Region } from 'shared/src/types/account.type';

import { ENV } from '../../configs/env.config';

export function createRegionalClient(platformRegion: Region): HttpInstance {
  const key = platformRegion.toLowerCase().trim();
  const regional = REGION_MAP[key] ?? (['kr', 'jp1'].includes(key) ? 'asia' : 'americas');

  return createHttpClient({
    baseURL: `https://${regional}.api.riotgames.com`,
    defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
    timeoutMs: 15000,
    retries: 3,
  });
}

export function createPlatformClient(platformRegion: Region): HttpInstance {
  const key = platformRegion.toLowerCase().trim();
  const platformHost = PLATFORM_HOST_MAP[key];

  if (!platformHost) {
    throw new Error(`unsupported platform region: ${key}`);
  }

  return createHttpClient({
    baseURL: `https://${platformHost}.api.riotgames.com`,
    defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
    timeoutMs: 15000,
    retries: 3,
  });
}
