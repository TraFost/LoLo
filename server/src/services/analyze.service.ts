import { RANKED_MATCH } from 'shared/src/constants/match.constant';
import type { MatchDTO, ParticipantDTO } from 'shared/src/types/statistics.type';
import type { HttpInstance } from 'shared/src/lib/axios';
import type { PlatformRegion } from 'shared/src/types/account.type';

import { PlayerAnalystAgent } from '../agents/player-analyst.agent';
import { ProComparisonAgent } from '../agents/pro-comparison.agent';
import type { AnalysisDTO, ProComparisonDTO } from 'shared/src/types/analyze.dto';
import { normalizeRole } from '../lib/utils/helper.util';
import { createRegionalClient } from '../lib/utils/riot.util';

export class AnalyzeService {
  private regionalClient: HttpInstance;

  constructor(platformRegion: PlatformRegion) {
    this.regionalClient = createRegionalClient(platformRegion);
  }

  async generateImprovementReport(puuid: string): Promise<AnalysisDTO> {
    const { role, matchData } = await this.getImprovementAnalysis(puuid);
    const analyst = new PlayerAnalystAgent();
    return analyst.run({ role, matchData });
  }

  async generateProComparison(puuid: string): Promise<ProComparisonDTO> {
    const { role, matchData } = await this.getImprovementAnalysis(puuid);
    const analyst = new PlayerAnalystAgent();
    const playerAnalysis = await analyst.run({ role, matchData });

    const comparisonAgent = new ProComparisonAgent(analyst);

    return comparisonAgent.run({
      role,
      matchData,
      playerAnalysis,
    });
  }

  async getImprovementAnalysis(puuid: string): Promise<{ role: string; matchData: any[] }> {
    const matchIds = await this.getMatchIds(puuid);
    const matches = await this.getMatchDetails(matchIds);

    const playerMatches = this.filterPlayerMatches(matches, puuid);

    if (playerMatches.length < 5) {
      throw new Error('Not enough matches');
    }

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

    return { role, matchData };
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
}
