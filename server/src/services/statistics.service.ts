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
import { HeaderRateGate } from '../lib/utils/rate-limiter.util';

interface ChampionData {
  matches: number;
  wins: number;
}

export class StatisticsService {
  private regionalClient: HttpInstance;
  private gate = new HeaderRateGate();
  private concurrency = 16;

  constructor(platformRegion: string) {
    const regional = REGION_MAP[platformRegion] || 'asia';
    this.regionalClient = createHttpClient({
      baseURL: `https://${regional}.api.riotgames.com`,
      timeoutMs: 15000,
      retries: 0,
      defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
    });
  }

  async getStatistics(puuid: string): Promise<StatisticsResponse> {
    const matchIds = await this.getMatchIds(puuid);
    const matches = await this.getMatchDetails(matchIds);

    const times = matches.map((m) => m.info.gameCreation).sort((a, b) => a - b);
    console.log('[stats] first/last game', {
      first: times[0] ? new Date(times[0]).toISOString() : null,
      last: times.at(-1) ? new Date(times.at(-1)!).toISOString() : null,
    });

    const byQueue = new Map<number, number>();
    for (const m of matches) byQueue.set(m.info.queueId, (byQueue.get(m.info.queueId) || 0) + 1);
    console.log('[stats] byQueue', Object.fromEntries(byQueue));

    console.log(
      '[stats] ids=%d fetched=%d dropped=%d',
      matchIds.length,
      matches.length,
      matchIds.length - matches.length,
    );

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

  private async getMatchIds(puuid: string): Promise<string[]> {
    const nowSec = Math.floor(Date.now() / 1000);
    const startOfYearSec = Math.floor(Date.UTC(2025, 0, 1, 0, 0, 0) / 1000);

    const url = `/lol/match/v5/matches/by-puuid/${puuid}/ids`;
    const all: string[] = [];
    const pageSize = 100;
    let start = 0;

    for (;;) {
      const params = new URLSearchParams({
        start: String(start),
        count: String(pageSize),
        startTime: String(startOfYearSec),
        endTime: String(nowSec),
        queue: '420',
      });

      await this.gate.before();
      const res = await this.regionalClient.get<string[]>(`${url}?${params.toString()}`);
      await this.gate.after(res.headers as any);

      const page = res.data ?? [];
      all.push(...page);
      if (page.length < pageSize) break;
      start += pageSize;
    }

    console.log('[stats] year window', {
      startISO: new Date(startOfYearSec * 1000).toISOString(),
      endISO: new Date(nowSec * 1000).toISOString(),
      ids: all.length,
    });

    return all.slice(0, 120);
  }

  private async getMatchDetails(matchIds: string[]): Promise<MatchDTO[]> {
    const out: MatchDTO[] = [];
    if (!matchIds.length) return out;

    let i = 0;
    let dropped = 0;

    const worker = async (): Promise<void> => {
      for (;;) {
        const idx = i++;
        if (idx >= matchIds.length) return;
        const id = matchIds[idx]!;
        const m = await this.getMatchDetail(id);
        if (m) out.push(m);
        else dropped++;
      }
    };

    const workers = Array.from({ length: this.concurrency }, () => worker());
    await Promise.all(workers);

    if (dropped > matchIds.length * 0.3) {
      console.log(`[stats] high drop (${dropped}), retrying half speed`);
      this.concurrency = Math.max(6, Math.floor(this.concurrency / 2));
      const missing = matchIds.filter((id) => !out.find((m) => m.metadata?.matchId === id));
      const retry: MatchDTO[] = [];
      let j = 0;
      const retryWorker = async (): Promise<void> => {
        for (;;) {
          const idx = j++;
          if (idx >= missing.length) return;
          const id = missing[idx]!;
          const m = await this.getMatchDetail(id);
          if (m) retry.push(m);
        }
      };
      await Promise.all(Array.from({ length: this.concurrency }, () => retryWorker()));
      out.push(...retry);
    }

    return out;
  }

  private async getMatchDetail(matchId: string): Promise<MatchDTO | null> {
    const url = `/lol/match/v5/matches/${matchId}`;
    let delay = 400;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        await this.gate.before();
        const res = await this.regionalClient.get<MatchDTO>(url);
        await this.gate.after(res.headers as any);
        return res.data;
      } catch (e: any) {
        const status = e?.status ?? e?.response?.status;
        const ra = e?.response?.headers?.['retry-after'];
        if (status === 429 || status >= 500) {
          const ms = ra ? Number(ra) * 1000 : delay + Math.random() * 300;
          await new Promise((r) => setTimeout(r, ms));
          delay = Math.min(delay * 2, 8000);
          continue;
        }
        return null;
      }
    }
    return null;
  }

  private filterPlayerMatches(matches: MatchDTO[], puuid: string): ParticipantDTO[] {
    return matches
      .map((m) => m.info.participants.find((p) => p.puuid === puuid))
      .filter((p): p is ParticipantDTO => !!p);
  }

  private calculateStatistics(playerMatches: ParticipantDTO[]): StatisticItem[] {
    const totalGames = playerMatches.length;
    const wins = playerMatches.reduce((s, p) => s + (p.win ? 1 : 0), 0);
    const winRate = totalGames ? (wins / totalGames) * 100 : 0;

    const totalKills = playerMatches.reduce((s, p) => s + p.kills, 0);
    const totalPentaKills = playerMatches.reduce((s, p) => s + p.pentaKills, 0);
    const avgKills = totalGames ? totalKills / totalGames : 0;
    const totalMinutes = totalGames * 30;
    const totalHours = Math.round(totalMinutes / 60);

    return [
      { title: 'Total Games', value: String(totalGames), subtitle: 'Across all queues' },
      { title: 'Win Rate', value: `${winRate.toFixed(1)}%`, subtitle: 'Overall performance' },
      {
        title: 'Total Kills',
        value: String(totalKills),
        subtitle: `${avgKills.toFixed(1)} per game`,
      },
      {
        title: 'Pentakills',
        value: String(totalPentaKills),
        subtitle: totalPentaKills > 0 ? 'One man army!' : 'Keep trying!',
      },
      {
        title: 'Hours Played',
        value: String(totalHours),
        subtitle: `That's ${Math.round(totalHours / 24)} days!`,
      },
    ];
  }

  private calculateChampionStats(playerMatches: ParticipantDTO[]): ChampionStats[] {
    const map = new Map<string, ChampionData>();
    for (const m of playerMatches) {
      const cur = map.get(m.championName) || { matches: 0, wins: 0 };
      cur.matches++;
      if (m.win) cur.wins++;
      map.set(m.championName, cur);
    }
    return [...map.entries()]
      .map(([name, d]) => ({
        name,
        matches: d.matches,
        wins: d.wins,
        winrate: (d.wins / d.matches) * 100,
      }))
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 5);
  }

  private normalizeRole(
    teamPosition?: string,
    individualPosition?: string,
  ): 'ADC' | 'Mid' | 'Jungle' | 'Top' | 'Support' {
    const raw = (teamPosition || individualPosition || 'ADC').toUpperCase();
    if (raw === 'ADC' || raw === 'BOTTOM' || raw === 'BOT' || raw === 'DUO_CARRY') return 'ADC';
    if (raw === 'MIDDLE' || raw === 'MID') return 'Mid';
    if (raw === 'JUNGLE') return 'Jungle';
    if (raw === 'TOP') return 'Top';
    if (raw === 'UTILITY' || raw === 'SUPPORT' || raw === 'DUO_SUPPORT') return 'Support';
    return 'ADC';
  }

  private calculateChartStatistics(
    matches: MatchDTO[],
    puuid: string,
  ): {
    role: 'ADC' | 'Mid' | 'Jungle' | 'Top' | 'Support';
    metrics: Record<string, MonthlyMetric[]>;
  } {
    type Acc = {
      games: number;
      kills: number;
      deaths: number;
      assists: number;
      timePlayed: number;
      cs: number;
      dmgChamp: number;
      dmgTaken: number;
      visionScore: number;
      soloKills: number;
      kpNumerator: number;
      teamKills: number;
      dragonTakes: number;
      baronTakes: number;
      heraldTakes: number;
    };
    const init = (): Acc => ({
      games: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      timePlayed: 0,
      cs: 0,
      dmgChamp: 0,
      dmgTaken: 0,
      visionScore: 0,
      soloKills: 0,
      kpNumerator: 0,
      teamKills: 0,
      dragonTakes: 0,
      baronTakes: 0,
      heraldTakes: 0,
    });

    const roles = ['ADC', 'Mid', 'Jungle', 'Top', 'Support'] as const;
    const byRoleMonth: Record<(typeof roles)[number], Record<number, Acc>> = {
      ADC: {},
      Mid: {},
      Jungle: {},
      Top: {},
      Support: {},
    };
    for (let m = 0; m < 12; m++) {
      byRoleMonth.ADC[m] = init();
      byRoleMonth.Mid[m] = init();
      byRoleMonth.Jungle[m] = init();
      byRoleMonth.Top[m] = init();
      byRoleMonth.Support[m] = init();
    }

    for (const match of matches) {
      const p = match.info.participants.find((x) => x.puuid === puuid);
      if (!p) continue;
      const month = new Date(match.info.gameCreation).getUTCMonth();
      const role = this.normalizeRole(p.teamPosition, p.individualPosition);
      const acc = byRoleMonth[role][month]!;

      const timePlayed = p.timePlayed ?? match.info.gameDuration ?? 0;
      const cs = (p.totalMinionsKilled ?? 0) + (p.neutralMinionsKilled ?? 0);
      const dmgChamp = p.totalDamageDealtToChampions ?? 0;
      const dmgTaken = (p as any).totalDamageTaken ?? 0;
      const visionScore = p.visionScore ?? p.challenges?.visionScore ?? 0;
      const soloKills = p.challenges?.soloKills ?? 0;

      let teamKills = 0;

      for (const q of match.info.participants) {
        if (q.teamId === p.teamId) teamKills += q.kills ?? 0;
      }

      acc.games += 1;
      acc.kills += p.kills ?? 0;
      acc.deaths += p.deaths ?? 0;
      acc.assists += p.assists ?? 0;
      acc.timePlayed += timePlayed;
      acc.cs += cs;
      acc.dmgChamp += dmgChamp;
      acc.dmgTaken += dmgTaken;
      acc.visionScore += visionScore;
      acc.soloKills += soloKills;
      acc.kpNumerator += (p.kills ?? 0) + (p.assists ?? 0);
      acc.teamKills += teamKills;
      acc.dragonTakes += p.challenges?.dragonTakedowns ?? 0;
      acc.baronTakes += p.challenges?.baronTakedowns ?? 0;
      acc.heraldTakes += p.challenges?.riftHeraldTakedowns ?? 0;
    }

    const roleGames: Record<(typeof roles)[number], number> = {
      ADC: 0,
      Mid: 0,
      Jungle: 0,
      Top: 0,
      Support: 0,
    };
    for (const r of roles) {
      roleGames[r] = Object.values(byRoleMonth[r]).reduce((s, a) => s + a.games, 0);
    }
    const mostPlayed = [...roles].sort((a, b) => roleGames[b] - roleGames[a])[0] ?? 'ADC';

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
    const perMonth = (calc: (a: Acc) => number): MonthlyMetric[] => {
      const out: MonthlyMetric[] = [];
      for (let i = 0; i < 12; i++) {
        const a = byRoleMonth[mostPlayed][i];
        const v = a?.games ? calc(a) : 0;
        out.push({ month: monthNames[i]!, value: Number(Number.isFinite(v) ? v.toFixed(2) : 0) });
      }
      return out;
    };

    const perMin = (num: number, secs: number) => (secs > 0 ? num / (secs / 60) : 0);
    const avg = (num: number, den: number) => (den > 0 ? num / den : 0);
    const kda = (k: number, d: number, a: number) => (d > 0 ? (k + a) / d : k + a);

    let metrics: Record<string, MonthlyMetric[]> = {};
    switch (mostPlayed) {
      case 'ADC':
        metrics = {
          kda: perMonth((a) => kda(a.kills, a.deaths, a.assists)),
          csPerMin: perMonth((a) => perMin(a.cs, a.timePlayed)),
          damageToChampions: perMonth((a) => avg(a.dmgChamp, a.games)),
        };
        break;
      case 'Mid':
        metrics = {
          kda: perMonth((a) => kda(a.kills, a.deaths, a.assists)),
          damageToChampions: perMonth((a) => avg(a.dmgChamp, a.games)),
          killParticipation: perMonth(
            (a) => Math.min(1, avg(a.kpNumerator, a.teamKills || 0)) * 100,
          ),
        };
        break;
      case 'Jungle':
        metrics = {
          killParticipation: perMonth(
            (a) => Math.min(1, avg(a.kpNumerator, a.teamKills || 0)) * 100,
          ),
          objectiveControl: perMonth((a) =>
            avg(a.dragonTakes + a.baronTakes + a.heraldTakes, a.games),
          ),
          kda: perMonth((a) => kda(a.kills, a.deaths, a.assists)),
        };
        break;
      case 'Top':
        metrics = {
          damageTakenPerMin: perMonth((a) => perMin(a.dmgTaken, a.timePlayed)),
          csPerMin: perMonth((a) => perMin(a.cs, a.timePlayed)),
          soloKills: perMonth((a) => avg(a.soloKills, a.games)),
        };
        break;
      case 'Support':
        metrics = {
          visionScorePerMin: perMonth((a) => perMin(a.visionScore, a.timePlayed)),
          killParticipation: perMonth(
            (a) => Math.min(1, avg(a.kpNumerator, a.teamKills || 0)) * 100,
          ),
          assists: perMonth((a) => avg(a.assists, a.games)),
        };
        break;
    }

    return { role: mostPlayed ?? 'ADC', metrics };
  }

  private calculateRoleDistribution(playerMatches: ParticipantDTO[]): RoleDistribution[] {
    const map = new Map<string, number>();
    for (const pm of playerMatches) {
      const role = this.normalizeRole(pm.teamPosition, pm.individualPosition);
      map.set(role, (map.get(role) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([role, value]) => ({ role, value }))
      .sort((a, b) => b.value - a.value);
  }
}
