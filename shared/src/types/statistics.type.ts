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
  mastery: MasteryDTO | null;
}

export interface MonthlyMetric {
  month: string;
  value: number;
}

export interface RoleDistribution {
  role: string;
  value: number;
}

export interface RoleChartStatistics {
  role: 'ADC' | 'Mid' | 'Jungle' | 'Top' | 'Support';
  metrics: Record<string, MonthlyMetric[]>;
}

export interface GameplayData {
  chartStatistics: RoleChartStatistics;
  roleDistribution: RoleDistribution[];
}

export interface StatisticsResponse {
  statistics: StatisticItem[];
  champions: ChampionStats[];
  gameplay: GameplayData;
}

export interface MatchDTO {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    queueId: number;
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

  // Core combat
  kills: number;
  deaths: number;
  assists: number;
  pentaKills: number;

  // Economy / farming
  goldEarned: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;

  // Damage
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;

  // Vision & utility
  visionScore?: number;
  challenges?: {
    visionScore?: number;
    soloKills?: number;
    dragonTakedowns?: number;
    baronTakedowns?: number;
    riftHeraldTakedowns?: number;
  };

  // Duration
  timePlayed?: number;

  // Positioning
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

export interface MasteryDTO {
  level: number;
  points: number;
  chestGranted: boolean;
}

export interface ChampionAgg {
  championId: number;
  name: string;
  matches: number;
  wins: number;
}
