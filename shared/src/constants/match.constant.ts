import type { PlatformRegion, RoutingRegion } from '../types/account.type';

export const RANKED_MATCH = '420';

export const REGION_MAP: Record<PlatformRegion, RoutingRegion> = {
  na1: 'americas',
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',

  euw1: 'europe',
  eun1: 'europe',
  tr1: 'europe',
  ru: 'europe',

  kr: 'asia',
  jp1: 'asia',

  oc1: 'sea',

  ph2: 'sea',
  sg2: 'sea',
  th2: 'sea',
  tw2: 'sea',
  vn2: 'sea',
};

export const PLATFORM_HOST_MAP: Record<PlatformRegion, string> = {
  na1: 'na1',
  euw1: 'euw1',
  eun1: 'eun1',
  kr: 'kr',
  jp1: 'jp1',
  br1: 'br1',
  la1: 'la1',
  la2: 'la2',
  oc1: 'oc1',
  tr1: 'tr1',
  ru: 'ru',

  // SEA
  ph2: 'ph2',
  sg2: 'sg2',
  th2: 'th2',
  tw2: 'tw2',
  vn2: 'vn2',
} as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
