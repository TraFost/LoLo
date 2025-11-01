import { createHttpClient, type HttpInstance } from 'shared/src/lib/axios';
import { RANKED_MATCH, REGION_MAP } from 'shared/src/constants/match.constant';
import type { MatchDTO, ParticipantDTO } from 'shared/src/types/statistics.type';

import { normalizeRole } from '../lib/utils/helper.util';
import { ENV } from '../configs/env.config';

export class AnalyzeService {
  private regionalClient: HttpInstance;

  constructor(platformRegion: string) {
    const key = (platformRegion || '').toLowerCase().trim();
    const regional = REGION_MAP[key] ?? (['kr', 'jp1'].includes(key) ? 'asia' : 'americas');

    const baseURL = `https://${regional}.api.riotgames.com`;

    console.log(`[improvement] using region "${key}" → base ${baseURL}`);

    this.regionalClient = createHttpClient({
      baseURL,
      timeoutMs: 15000,
      retries: 1,
      defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
      onLog: (msg, ctx) => {
        if (msg === 'request failed' && ctx.code === 'ENOTFOUND') {
          console.warn(
            `[improvement] DNS failure for ${ctx.url}. Check your region code or DNS resolver.`,
          );
        }
      },
    });
  }

  async getImprovementAnalysis(
    puuid: string,
  ): Promise<{ role: string; patch: string; matchData: any[] }> {
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

    const patch = await this.getCurrentPatch();

    return { role, patch, matchData };
  }

  private async getMatchIds(puuid: string): Promise<string[]> {
    const url = `/lol/match/v5/matches/by-puuid/${puuid}/ids`;
    const params = new URLSearchParams({
      start: '0',
      count: '5',
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

  private async getCurrentPatch(): Promise<string> {
    try {
      const res = await this.regionalClient.get<string[]>(
        'https://ddragon.leagueoflegends.com/api/versions.json',
      );
      const versions = res.data;
      const latest = versions?.[0];
      return latest ? latest.split('.').slice(0, 2).join('.') : '14.20';
    } catch (e: any) {
      console.warn('Failed to fetch current patch:', e.message);
      return '14.20';
    }
  }

  private filterPlayerMatches(matches: MatchDTO[], puuid: string): ParticipantDTO[] {
    return matches
      .map((m) => m.info.participants.find((p) => p.puuid === puuid))
      .filter((p): p is ParticipantDTO => !!p);
  }
}
