export type PlatformRegion =
  | 'na1'
  | 'br1'
  | 'la1'
  | 'la2'
  | 'euw1'
  | 'eun1'
  | 'tr1'
  | 'ru'
  | 'kr'
  | 'jp1'
  | 'oc1'
  // SEA
  | 'ph2'
  | 'sg2'
  | 'th2'
  | 'tw2'
  | 'vn2';

export type RoutingRegion = 'americas' | 'europe' | 'asia' | 'sea';

export type Account = Omit<AccountDTO, 'puuid'>;

export interface AccountDTO {
  puuid: string;
  gameName: string;
  tagLine: string;
  profilePict: string;
}

export interface SummonerDTO {
  profileIconId: number;
  revisionDate: number;
  puuid: string;
  summonerLevel: string;
}
