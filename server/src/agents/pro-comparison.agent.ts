import {
  buildComparisonSystemPrompt,
  buildComparisonUserPrompt,
  buildProSelectorSystemPrompt,
  buildProSelectorUserPrompt,
  type ComparisonPromptInput,
} from '../lib/llm/prompt';
import { invokeNovaMicroJSON } from '../lib/llm/bedrock';
import { getJSONFromS3 } from '../lib/utils/s3.util';
import { formatRoleDisplay, safeJson } from '../lib/utils/helper.util';
import { buildPlayerSignature } from '../lib/utils/signature.util';

import { PlayerAnalystAgent } from './player-analyst.agent';
import type { ProProfile, ProSignature } from '../types/pro.type';
import type { AnalysisDTO, ProComparisonDTO } from 'shared/src/types/analyze.dto';

export interface SelectorPayload {
  chosen_pro_id: string;
  reason?: string;
  alternatives?: string[];
}

const PLAYER_ANALYSIS_LABELS = [
  'Preferred Role',
  'Playstyle',
  'Team Impact',
  'Decision Tempo',
] as const;

const CHART_STATS = ['Fighting', 'Farming', 'Supporting', 'Pushing', 'Versatility'] as const;

type PlayerAnalysisLabel = (typeof PLAYER_ANALYSIS_LABELS)[number];
type ChartStat = (typeof CHART_STATS)[number];

export interface ProComparisonInput {
  role: string;
  matchData: any[];
  playerAnalysis: AnalysisDTO;
}

export class ProComparisonAgent {
  constructor(private readonly playerAnalyst: PlayerAnalystAgent) {}

  async run(input: ProComparisonInput): Promise<ProComparisonDTO> {
    const playerSignature = buildPlayerSignature(input.role, input.matchData);
    const roleDisplay = formatRoleDisplay(input.role);

    const proSignatures = await getJSONFromS3<ProSignature[]>('pros/index.json');
    if (!Array.isArray(proSignatures) || proSignatures.length === 0) {
      throw new Error('No pro signatures available');
    }

    const selectorSystem = buildProSelectorSystemPrompt();
    const selectorUser = buildProSelectorUserPrompt(playerSignature, proSignatures);
    const selectorRes = await invokeNovaMicroJSON(selectorSystem, selectorUser, {});

    const selectorJson = safeJson<SelectorPayload>(selectorRes.text);

    const chosenProId =
      selectorJson?.chosen_pro_id ??
      proSignatures.find((p) => p.role === input.role)?.id ??
      proSignatures[0]!.id;

    const proProfile = await getJSONFromS3<ProProfile>(`pros/full/${chosenProId}.json`);
    if (!proProfile) {
      throw new Error('Pro profile not found');
    }

    const proName = proProfile.name ?? proProfile.id;

    const proAnalysis = await this.playerAnalyst.run({
      role: proProfile.role,
      matchData: proProfile.matchData,
    });

    const proSignature = proSignatures.find((p) => p.id === chosenProId) ?? null;

    const compareSystem = buildComparisonSystemPrompt();
    const comparePayload: ComparisonPromptInput = {
      role: input.role,
      roleDisplay,
      proName,
      selectorReason: selectorJson?.reason,
      playerAnalysis: input.playerAnalysis,
      proAnalysis,
      playerSignature,
      proSignature,
    };

    const compareUser = buildComparisonUserPrompt(comparePayload);
    const compareLLM = await invokeNovaMicroJSON(compareSystem, compareUser, {});

    const parsed = safeJson<ProComparisonDTO>(compareLLM.text);

    return this.normalizeResponse(parsed, {
      roleDisplay,
      proName,
    });
  }

  private normalizeResponse(
    response: ProComparisonDTO | null,
    context: { roleDisplay: string; proName: string },
  ): ProComparisonDTO {
    const fallback = this.buildDefaultResponse(context.roleDisplay, context.proName);
    const source = response ?? fallback;

    const fallbackPlayerMap = new Map<PlayerAnalysisLabel, string>();
    for (const item of fallback.playerAnalysis) {
      fallbackPlayerMap.set(item.label as PlayerAnalysisLabel, item.value);
    }

    const playerMap = new Map<PlayerAnalysisLabel, string>();
    for (const item of source.playerAnalysis ?? []) {
      if (!item || typeof item.label !== 'string') continue;
      const match = PLAYER_ANALYSIS_LABELS.find(
        (label) => label.toLowerCase() === item.label.toLowerCase(),
      );
      const value = typeof item.value === 'string' ? item.value.trim() : '';
      if (match && value) {
        playerMap.set(match, value);
      }
    }

    const normalizedPlayerAnalysis = PLAYER_ANALYSIS_LABELS.map((label) => {
      if (label === 'Preferred Role') {
        return { label, value: context.roleDisplay };
      }
      const value = playerMap.get(label) ?? fallbackPlayerMap.get(label) ?? 'Insight unavailable.';
      return { label, value };
    });

    const sourcePro = source.proPlayer ?? fallback.proPlayer;
    const playstyle =
      typeof sourcePro.playstyle === 'string' && sourcePro.playstyle.trim()
        ? sourcePro.playstyle.trim()
        : fallback.proPlayer.playstyle;
    const summary =
      typeof sourcePro.summary === 'string' && sourcePro.summary.trim()
        ? sourcePro.summary.trim()
        : fallback.proPlayer.summary;
    const similarities = this.sanitizeSimilarities(
      sourcePro.similarities,
      fallback.proPlayer.similarities,
    );
    const playstyleDetails = this.ensurePlaystyleDetails(
      sourcePro.playstyleDetails,
      fallback.proPlayer.playstyleDetails,
    );

    const proPlayer = {
      name: context.proName,
      role: context.roleDisplay,
      playstyle,
      similarities,
      playstyleDetails,
      summary,
    };

    const fallbackChartMap = new Map<ChartStat, { player: number; proPlayer: number }>();
    fallback.comparisonChart.forEach((item) => {
      fallbackChartMap.set(item.stat as ChartStat, {
        player: item.player,
        proPlayer: item.proPlayer,
      });
    });

    const sourceChart = Array.isArray(source.comparisonChart) ? source.comparisonChart : [];
    const chart = CHART_STATS.map((stat) => {
      const match = sourceChart.find(
        (entry) =>
          typeof entry?.stat === 'string' && entry.stat.toLowerCase() === stat.toLowerCase(),
      );
      const fallbackEntry = fallbackChartMap.get(stat) ?? { player: 50, proPlayer: 50 };
      return {
        stat,
        player: this.clampScore(match?.player ?? fallbackEntry.player),
        proPlayer: this.clampScore(match?.proPlayer ?? fallbackEntry.proPlayer),
      };
    });

    return {
      playerAnalysis: normalizedPlayerAnalysis,
      proPlayer,
      comparisonChart: chart,
    };
  }

  private buildDefaultResponse(roleDisplay: string, proName: string): ProComparisonDTO {
    return {
      playerAnalysis: PLAYER_ANALYSIS_LABELS.map((label) => ({
        label,
        value:
          label === 'Preferred Role'
            ? roleDisplay
            : 'Insight unavailable. We will update this after more game data is processed.',
      })),
      proPlayer: {
        name: proName,
        role: roleDisplay,
        playstyle: 'Playstyle insights are not available right now.',
        similarities: ['Consistent fundamentals'],
        playstyleDetails: [
          'Additional playstyle context will appear once more data is collected.',
          'Check back after we refresh the pro comparison.',
        ],
        summary: 'Comparison unavailable at this time.',
      },
      comparisonChart: CHART_STATS.map((stat) => ({
        stat,
        player: 50,
        proPlayer: 70,
      })),
    };
  }

  private clampScore(score: unknown): number {
    const numeric = Number(score);
    if (Number.isFinite(numeric)) {
      return Math.min(100, Math.max(0, Math.round(numeric)));
    }
    return 50;
  }

  private sanitizeSimilarities(raw: unknown, fallback: string[]): string[] {
    if (!Array.isArray(raw)) return fallback;
    const deduped = Array.from(
      new Set(
        raw
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item) => item.length > 0),
      ),
    );
    if (deduped.length === 0) return fallback;
    return deduped.slice(0, 3);
  }

  private ensurePlaystyleDetails(raw: unknown, fallback: string[]): string[] {
    const cleaned = Array.isArray(raw)
      ? raw
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item) => item.length > 0)
      : [];
    const result = cleaned.slice(0, 2);
    while (result.length < 2) {
      const fallbackItem = fallback[result.length] ?? 'Further detail unavailable for now.';
      result.push(fallbackItem);
    }
    return result;
  }
}
