import { createHttpClient, type HttpInstance } from 'shared/src/lib/axios';
import { REGION_MAP } from 'shared/src/constants/match.constant';

import type {
  StatisticsResponse,
  MatchDTO,
  ParticipantDTO,
  StatisticItem,
  ChampionStats,
  MonthlyMetric,
  RoleDistribution,
} from 'shared/src/types/statistics.type';

import { ENV } from '../configs/env.config';

interface ChampionData {
  matches: number;
  wins: number;
}

interface RoleData {
  count: number;
}

interface MonthlyData {
  kills: number;
  deaths: number;
  assists: number;
  gold: number;
  cs: number;
  games: number;
}

export class StatisticsService {
  private regionalClient: HttpInstance;

  constructor(platformRegion: string) {
    const regional = REGION_MAP[platformRegion] || 'asia';

    this.regionalClient = createHttpClient({
      baseURL: `https://${regional}.api.riotgames.com`,
      timeoutMs: 15000,
      retries: 3,
      defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
    });
  }

  async getStatistics(puuid: string, count: number = 100): Promise<StatisticsResponse> {
    const matchIds = await this.getMatchIds(puuid, count);

    const matches = await this.fetchMatchDetails(matchIds);

    const playerMatches = this.filterPlayerMatches(matches, puuid);

    return {
      statistics: this.calculateStatistics(playerMatches),
      champions: this.calculateChampionStats(playerMatches),
      gameplay: {
        chartStatistics: this.calculateChartStatistics(matches, puuid),
        roleDistribution: this.calculateRoleDistribution(playerMatches),
      },
    };
  }

  private async getMatchIds(puuid: string, count: number): Promise<string[]> {
    const url = `/lol/match/v5/matches/by-puuid/${puuid}/ids`;
    const params = new URLSearchParams({
      start: '0',
      count: Math.min(count, 100).toString(),
    });

    const res = await this.regionalClient.get<string[]>(`${url}?${params}`);
    return res.data;
  }

  private async fetchMatchDetails(matchIds: string[]): Promise<MatchDTO[]> {
    const matches: MatchDTO[] = [];

    const batchSize = 10;
    for (let i = 0; i < matchIds.length; i += batchSize) {
      const batch = matchIds.slice(i, i + batchSize);
      const batchPromises = batch.map((id) => this.getMatchDetail(id));
      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value) {
          matches.push(result.value);
        }
      }

      if (i + batchSize < matchIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return matches;
  }

  private async getMatchDetail(matchId: string): Promise<MatchDTO | null> {
    try {
      const url = `/lol/match/v5/matches/${matchId}`;
      const res = await this.regionalClient.get<MatchDTO>(url);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch match ${matchId}:`, error);
      return null;
    }
  }

  private filterPlayerMatches(matches: MatchDTO[], puuid: string): ParticipantDTO[] {
    return matches
      .map((match) => match.info.participants.find((p) => p.puuid === puuid))
      .filter((p): p is ParticipantDTO => p !== undefined);
  }

  private calculateStatistics(playerMatches: ParticipantDTO[]): StatisticItem[] {
    const totalGames = playerMatches.length;
    const wins = playerMatches.filter((p) => p.win).length;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    const totalKills = playerMatches.reduce((sum, p) => sum + p.kills, 0);
    const totalPentaKills = playerMatches.reduce((sum, p) => sum + p.pentaKills, 0);

    const totalMinutes = totalGames * 30;
    const totalHours = Math.round(totalMinutes / 60);

    return [
      {
        title: 'Total Games',
        value: totalGames.toLocaleString(),
        subtitle: 'Across all queues',
      },
      {
        title: 'Win Rate',
        value: `${winRate.toFixed(1)}%`,
        subtitle: 'Overall performance',
      },
      {
        title: 'Total Kills',
        value: totalKills.toLocaleString(),
        subtitle: `${(totalKills / totalGames).toFixed(1)} per game`,
      },
      {
        title: 'Pentakills',
        value: totalPentaKills.toString(),
        subtitle: totalPentaKills > 0 ? 'One man army!' : 'Keep trying!',
      },
      {
        title: 'Hours Played',
        value: totalHours.toString(),
        subtitle: `That's ${Math.round(totalHours / 24)} days!`,
      },
    ];
  }

  private calculateChampionStats(playerMatches: ParticipantDTO[]): ChampionStats[] {
    const championMap = new Map<string, ChampionData>();

    for (const match of playerMatches) {
      const existing = championMap.get(match.championName) || { matches: 0, wins: 0 };
      championMap.set(match.championName, {
        matches: existing.matches + 1,
        wins: existing.wins + (match.win ? 1 : 0),
      });
    }

    const champions: ChampionStats[] = Array.from(championMap.entries())
      .map(([name, data]) => ({
        name,
        matches: data.matches,
        wins: data.wins,
        winrate: (data.wins / data.matches) * 100,
      }))
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 5);

    return champions;
  }

  private calculateChartStatistics(
    matches: MatchDTO[],
    puuid: string,
  ): {
    kda: MonthlyMetric[];
    net_worth: MonthlyMetric[];
    cs: MonthlyMetric[];
  } {
    const monthlyData = new Map<string, MonthlyData>();
    const monthNames = [
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

    for (const match of matches) {
      const participant = match.info.participants.find((p) => p.puuid === puuid);
      if (!participant) continue;

      const gameDate = new Date(match.info.gameCreation);
      const monthIndex = gameDate.getMonth();
      const monthName = monthNames[monthIndex] || 'January';

      const existing = monthlyData.get(monthName) || {
        kills: 0,
        deaths: 0,
        assists: 0,
        gold: 0,
        cs: 0,
        games: 0,
      };

      monthlyData.set(monthName, {
        kills: existing.kills + participant.kills,
        deaths: existing.deaths + participant.deaths,
        assists: existing.assists + participant.assists,
        gold: existing.gold + participant.goldEarned,
        cs: existing.cs + participant.totalMinionsKilled + participant.neutralMinionsKilled,
        games: existing.games + 1,
      });
    }

    const kda: MonthlyMetric[] = [];
    const net_worth: MonthlyMetric[] = [];
    const cs: MonthlyMetric[] = [];

    for (let i = 0; i < 11; i++) {
      const month = monthNames[i] || 'January';
      const data = monthlyData.get(month);

      if (data && data.games > 0) {
        const kdaValue =
          data.deaths > 0 ? (data.kills + data.assists) / data.deaths : data.kills + data.assists;

        kda.push({ month, value: parseFloat(kdaValue.toFixed(1)) });
        net_worth.push({ month, value: Math.round(data.gold / data.games) });
        cs.push({ month, value: Math.round(data.cs / data.games) });
      } else {
        kda.push({ month, value: 3.0 });
        net_worth.push({ month, value: 10000 });
        cs.push({ month, value: 200 });
      }
    }

    return { kda, net_worth, cs };
  }

  private calculateRoleDistribution(playerMatches: ParticipantDTO[]): RoleDistribution[] {
    const roleMap = new Map<string, RoleData>();

    const roleNameMap: Record<string, string> = {
      TOP: 'Top',
      JUNGLE: 'Jungle',
      MIDDLE: 'Mid',
      BOTTOM: 'ADC',
      UTILITY: 'Support',
    };

    for (const match of playerMatches) {
      const position = match.teamPosition || match.individualPosition || 'UNKNOWN';
      const roleName = roleNameMap[position] || position;

      const existing = roleMap.get(roleName) || { count: 0 };
      roleMap.set(roleName, { count: existing.count + 1 });
    }

    return Array.from(roleMap.entries())
      .map(([role, data]) => ({
        role,
        value: data.count,
      }))
      .sort((a, b) => b.value - a.value);
  }
}
