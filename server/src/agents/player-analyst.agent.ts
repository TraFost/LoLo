import { buildSystemPrompt, buildUserPrompt } from '../lib/llm/prompt';
import { invokeNovaMicroJSON } from '../lib/llm/bedrock';
import { safeJson } from '../lib/utils/helper.util';
import type { AnalysisDTO } from 'shared/src/types/analyze.dto';

export interface PlayerAnalystInput {
  role: string;
  matchData: any[];
}

export class PlayerAnalystAgent {
  async run(input: PlayerAnalystInput): Promise<AnalysisDTO> {
    const systemText = buildSystemPrompt();
    const userText = buildUserPrompt(input.role, input.matchData);

    const { text, stop, usage } = await invokeNovaMicroJSON(systemText, userText, {});
    console.log('[PlayerAnalystAgent] Nova response', { stop, usage });

    return safeJson<AnalysisDTO>(text) ?? this.buildDefaultAnalysisPayload();
  }

  private buildDefaultAnalysisPayload(): AnalysisDTO {
    return {
      analysis: {
        overall: 'Summary unavailable.',
        strengths: [],
        improvement: [],
      },
    };
  }
}
