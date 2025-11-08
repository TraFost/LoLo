import { RANKED_MATCH } from 'shared/src/constants/match.constant';
import type { MatchDTO, ParticipantDTO } from 'shared/src/types/statistics.type';
import type { HttpInstance } from 'shared/src/lib/axios';
import type { PlatformRegion, RankSummaryDTO } from 'shared/src/types/account.type';

import { PlayerAnalystAgent } from '../agents/player-analyst.agent';
import { ProComparisonAgent } from '../agents/pro-comparison.agent';
import { PracticePlanAgent } from '../agents/practice-plan.agent';
import { AccountService } from './account.service';
import type {
  AnalysisDTO,
  ImprovementResponseDTO,
  PracticePlanPayload,
  ProComparisonDTO,
} from 'shared/src/types/analyze.dto';
import { normalizeRole } from '../lib/utils/helper.util';
import { createRegionalClient } from '../lib/utils/riot.util';
import { getJSONFromS3, isS3Enabled, putObject } from '../lib/utils/s3.util';

export class AnalyzeService {
  private regionalClient: HttpInstance;
  private readonly accountService: AccountService;
  private readonly region: PlatformRegion;

  constructor(platformRegion: PlatformRegion) {
    this.regionalClient = createRegionalClient(platformRegion);
    this.accountService = new AccountService(platformRegion);
    this.region = platformRegion;
  }

  async generateImprovementReport(puuid: string): Promise<ImprovementResponseDTO> {
    const improvementKey = this.buildCacheKey('improvement', puuid);
    const practicePlanKey = this.buildCacheKey('practice-plan', puuid);

    const [cachedImprovement, cachedPracticePlan] = await Promise.all([
      this.readCache<AnalysisDTO>(improvementKey),
      this.readCache<PracticePlanPayload>(practicePlanKey),
    ]);

    let analysis = cachedImprovement ?? null;
    let practicePlan = cachedPracticePlan ?? null;

    let context: { role: string; matchData: any[]; rank?: string } | null = null;

    if (!analysis || !practicePlan) {
      context = await this.getImprovementAnalysis(puuid);
    }

    if (!analysis && context) {
      const analyst = new PlayerAnalystAgent();
      analysis = await analyst.run({ role: context.role, matchData: context.matchData });
      await this.writeCache(improvementKey, analysis);
    }

    if (!practicePlan && context) {
      if (!analysis) {
        throw new Error('Unable to generate practice plan without analysis payload.');
      }
      const practiceAgent = new PracticePlanAgent();
      practicePlan = await practiceAgent.run({
        role: context.role,
        analysis,
        matchCount: context.matchData.length,
        rank: context.rank,
      });
      await this.writeCache(practicePlanKey, practicePlan);
    }

    if (!analysis) {
      throw new Error('Failed to load or generate improvement analysis.');
    }

    return {
      analysis,
      practicePlan: practicePlan ?? undefined,
    };
  }

  async generateProComparison(puuid: string): Promise<ProComparisonDTO> {
    const comparisonKey = this.buildCacheKey('pro-comparison', puuid);
    const cachedComparison = await this.readCache<ProComparisonDTO>(comparisonKey);
    if (cachedComparison) {
      return cachedComparison;
    }

    const { role, matchData } = await this.getImprovementAnalysis(puuid);
    const analyst = new PlayerAnalystAgent();

    const improvementKey = this.buildCacheKey('improvement', puuid);
    let analysis = await this.readCache<AnalysisDTO>(improvementKey);

    if (!analysis) {
      analysis = await analyst.run({ role, matchData });
      await this.writeCache(improvementKey, analysis);
    }

    const comparisonAgent = new ProComparisonAgent(analyst);
    const comparison = await comparisonAgent.run({
      role,
      matchData,
      playerAnalysis: analysis,
    });

    await this.writeCache(comparisonKey, comparison);

    return comparison;
  }

  async getImprovementAnalysis(puuid: string): Promise<{
    role: string;
    matchData: any[];
    rank?: string;
  }> {
    const matchIds = await this.getMatchIds(puuid);
    const matches = await this.getMatchDetails(matchIds);

    const playerMatches = this.filterPlayerMatches(matches, puuid);

    if (playerMatches.length < 5) {
      throw new Error('Not enough matches');
    }

    const rankSummary = await this.getPlayerRank(puuid);

    const roleCounts = new Map<string, number>();
    for (const p of playerMatches) {
      const role = normalizeRole(p.teamPosition, p.individualPosition);
      roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
    }
    const role = [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'ADC';

    const matchData = [];
    for (const match of matches) {
      const player = match.info.participants.find((p) => p.puuid === puuid);
      if (player && normalizeRole(player.teamPosition, player.individualPosition) === role) {
        const timeline = await this.getMatchTimeline(match.metadata.matchId);
        matchData.push({
          match: match,
          timeline: timeline,
          player: player,
        });
      }
    }

    return { role, matchData, rank: rankSummary?.display };
  }

  private async getPlayerRank(puuid: string): Promise<RankSummaryDTO | null> {
    try {
      const summoner = await this.accountService.getSummonerByPuuid(puuid);
      const entries = await this.accountService.getLeagueEntries(summoner.id);
      return this.accountService.selectPrimaryRank(entries);
    } catch (error) {
      console.warn('Failed to retrieve player rank', error);
      return null;
    }
  }

  private async getMatchIds(puuid: string): Promise<string[]> {
    const url = `/lol/match/v5/matches/by-puuid/${puuid}/ids`;
    const params = new URLSearchParams({
      start: '0',
      count: '15',
      queue: RANKED_MATCH,
    });

    const res = await this.regionalClient.get<string[]>(`${url}?${params.toString()}`);
    return res.data ?? [];
  }

  private async getMatchDetails(matchIds: string[]): Promise<MatchDTO[]> {
    const matches: MatchDTO[] = [];
    for (const id of matchIds) {
      const match = await this.getMatchDetail(id);
      if (match) matches.push(match);
    }
    return matches;
  }

  private async getMatchDetail(matchId: string): Promise<MatchDTO | null> {
    const url = `/lol/match/v5/matches/${matchId}`;
    try {
      const res = await this.regionalClient.get<MatchDTO>(url);
      return res.data;
    } catch (e: any) {
      console.warn(`Failed to fetch match ${matchId}:`, e.message);
      return null;
    }
  }

  private async getMatchTimeline(matchId: string): Promise<any> {
    const url = `/lol/match/v5/matches/${matchId}/timeline`;
    try {
      const res = await this.regionalClient.get(url);
      return res.data;
    } catch (e: any) {
      console.warn(`Failed to fetch timeline ${matchId}:`, e.message);
      return null;
    }
  }

  private filterPlayerMatches(matches: MatchDTO[], puuid: string): ParticipantDTO[] {
    return matches
      .map((m) => m.info.participants.find((p) => p.puuid === puuid))
      .filter((p): p is ParticipantDTO => !!p);
  }

  private buildCacheKey(
    type: 'improvement' | 'practice-plan' | 'pro-comparison',
    puuid: string,
  ): string {
    return `analyze/${type}/${this.region}/${puuid}.json`;
  }

  private async readCache<T>(key: string): Promise<T | null> {
    if (!isS3Enabled()) return null;

    try {
      return await getJSONFromS3<T>(key);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      const code = (err as any)?.Code ?? (err as any)?.code ?? (err as any)?.name ?? '';
      const status = (err as any)?.$metadata?.httpStatusCode;
      const expectedMiss =
        code === 'NoSuchKey' ||
        code === 'NotFound' ||
        status === 404 ||
        message.includes('NoSuchKey') ||
        message.includes('S3 access is disabled');

      if (!expectedMiss) {
        console.warn(`[AnalyzeService] cache read failed for ${key}`, err);
      }

      return null;
    }
  }

  private async writeCache(key: string, data: unknown): Promise<void> {
    if (!isS3Enabled()) return;

    try {
      await putObject({
        key,
        body: JSON.stringify(data),
        contentType: 'application/json',
        metadata: { cachedat: new Date().toISOString() },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (!message.includes('S3 access is disabled')) {
        console.warn(`[AnalyzeService] cache write failed for ${key}`, err);
      }
    }
  }
}
