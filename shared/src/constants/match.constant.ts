import type { Region } from '../types/account.type';

export const RANKED_MATCH = '420';

export const REGION_MAP: Record<string, Region> = {
  // Americas
  na: 'americas',
  na1: 'americas',
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',

  // Europe
  euw1: 'europe',
  eun1: 'europe',
  tr1: 'europe',
  ru: 'europe',

  // Asia (KR/JP)
  kr: 'asia',
  jp1: 'asia',

  // SEA (Garena migration regions)
  ph2: 'sea',
  sg2: 'sea',
  th2: 'sea',
  tw2: 'sea',
  vn2: 'sea',
};

export const PLATFORM_HOST_MAP: Record<string, string> = {
  na1: 'na1',
  euw1: 'euw1',
  eun1: 'eun1',
  kr: 'kr',
  jp1: 'jp1',
  br1: 'br1',
  la1: 'la1',
  la2: 'la2',
  oce: 'oce',
  tr1: 'tr1',
  ru: 'ru',
} as const;
