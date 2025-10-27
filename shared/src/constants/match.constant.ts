import type { Region } from '../types/account.type';

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
