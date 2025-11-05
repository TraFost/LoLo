import { invokeNovaMicroJSON } from '../lib/llm/bedrock';
import { buildPracticePlanSystemPrompt, buildPracticePlanUserPrompt } from '../lib/llm/prompt';
import { safeJson } from '../lib/utils/helper.util';
import type { AnalysisDTO, PracticePlanPayload } from 'shared/src/types/analyze.dto';

interface PracticePlanInput {
  role: string;
  analysis: AnalysisDTO;
  matchCount: number;
  rank?: string;
}

export class PracticePlanAgent {
  async run(input: PracticePlanInput): Promise<PracticePlanPayload> {
    try {
      const systemText = buildPracticePlanSystemPrompt();
      const userText = buildPracticePlanUserPrompt({
        role: input.role,
        analysis: input.analysis,
        matchCount: input.matchCount,
        rank: input.rank,
      });

      const { text, stop, usage } = await invokeNovaMicroJSON(systemText, userText, {});
      console.log('[PracticePlanAgent] Nova response', { stop, usage });

      const parsed = safeJson<PracticePlanPayload>(text);
      if (!this.isValid(parsed)) {
        return this.fallback(input);
      }

      return parsed;
    } catch (error) {
      console.error('[PracticePlanAgent] Failed to generate practice plan', error);
      return this.fallback(input);
    }
  }

  private isValid(data: unknown): data is PracticePlanPayload {
    if (!data || typeof data !== 'object') return false;
    const payload = data as PracticePlanPayload;
    if (!Array.isArray(payload.focus) || payload.focus.length < 3 || payload.focus.length > 5) {
      return false;
    }
    if (!payload.focus.every((item) => typeof item === 'string' && item.trim().length > 0)) {
      return false;
    }
    if (
      !Array.isArray(payload.sessions) ||
      payload.sessions.length < 2 ||
      payload.sessions.length > 4
    ) {
      return false;
    }
    for (const session of payload.sessions) {
      if (!session) return false;
      if (typeof session.title !== 'string' || session.title.trim().length === 0) return false;
      if (typeof session.duration !== 'string' || session.duration.trim().length === 0)
        return false;
      if (!Array.isArray(session.checklist) || session.checklist.length === 0) return false;
      if (!session.checklist.every((item) => typeof item === 'string' && item.trim().length > 0)) {
        return false;
      }
    }
    return true;
  }

  private fallback(input: PracticePlanInput): PracticePlanPayload {
    return {
      focus: [
        'Strengthen laning fundamentals',
        'Reduce avoidable deaths',
        'Boost objective awareness',
      ],
      sessions: [
        {
          title: 'Session 1: Laning Review',
          duration: '45m',
          checklist: [
            'Play 2 ranked games focusing on CS and safe trading',
            'After each game, review first 10 minutes and list 3 positioning mistakes',
          ],
        },
        {
          title: 'Session 2: Death Discipline',
          duration: '30m',
          checklist: [
            'Play 1 ranked game aiming for 5 or fewer deaths',
            'After each death, note the cause and what cooldown/vision info was missing',
          ],
        },
        {
          title: 'Session 3: Objective Pressure',
          duration: '30m',
          checklist: [
            'Review last 2 games and note every unclaimed dragon/herald timing',
            'Set map pings or timers to contest the next two objectives in your next game',
          ],
        },
      ],
      notes:
        'Fallback plan used when model output is invalid. Focus on universal fundamentals suited for most ranks.',
    };
  }
}
