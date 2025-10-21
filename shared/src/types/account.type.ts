export interface AccountDTO {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export type Region = 'americas' | 'europe' | 'asia' | 'sea';

export type Account = Omit<AccountDTO, 'puuid'>;
