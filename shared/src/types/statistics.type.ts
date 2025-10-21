export interface StatisticItem {
  title: string;
  value: string;
  subtitle: string;
}

export interface ChampionStats {
  name: string;
  matches: number;
  wins: number;
  winrate: number;
}

export interface MonthlyMetric {
  month: string;
  value: number;
}

export interface RoleDistribution {
  role: string;
  value: number;
}

export interface ChartStatistics {
  kda: MonthlyMetric[];
  net_worth: MonthlyMetric[];
  cs: MonthlyMetric[];
}

export interface GameplayData {
  chartStatistics: ChartStatistics;
  roleDistribution: RoleDistribution[];
}

export interface StatisticsResponse {
  statistics: StatisticItem[];
  champions: ChampionStats[];
  gameplay: GameplayData;
}

// Riot API DTOs
export interface MatchDTO {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    participants: ParticipantDTO[];
  };
}

export interface ParticipantDTO {
  puuid: string;
  summonerName: string;
  championName: string;
  championId: number;
  teamId: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  goldEarned: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  pentaKills: number;
  teamPosition: string;
  individualPosition: string;
}

export interface SummonerDTO {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}
