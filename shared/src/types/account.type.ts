export type Region = 'americas' | 'europe' | 'asia' | 'sea';
export type Account = Omit<AccountDTO, 'puuid'>;

export interface AccountDTO {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerDTO {
  profileIconId: number;
  revisionDate: number;
  puuid: string;
  summonerLevel: string;
}
