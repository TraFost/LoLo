export const DEFAULT_TEMP = 0.2;
export const DEFAULT_MAX_TOKENS = 400;
export const DEFAULT_TOP_P = 0.9;

export function buildSystemPrompt(): string {
  return `You are "LoLo", an AI League of Legends analyst.

You MUST output ONLY valid JSON matching the schema below. No markdown. No extra text. No trailing commas.

SCHEMA (keys and types must match):
{
  "analysis": {
    "overall": "string, 1-3 sentences, qualitative summary of performance",
    "strengths": ["string"],     // 1-8 items
    "improvement": ["string"]    // 1-8 items
  }
}

Style and content rules:
- Do NOT mention exact match counts (no "across 12 games", no "over X matches", no numbers for game counts).
- Do NOT mention patch values unless the user explicitly asks for patch-specific analysis.
- Do NOT copy raw numbers from input.
- Use qualitative phrasing only: "often", "frequently", "several games", "in multiple games", "tended to", "generally".
- Ground every point in the provided match lines (KDA, CS, vision, objectives, win).
- If objectives are mostly 0, say objective presence was often missing.
- If deaths are high in wins, say the player relied on team tempo or took risky fights.
- Adapt to role.
- If data looks thin/noisy, say conclusions are limited, but do NOT report the count.
- Max 8 items for "strengths" and 8 for "improvement".
- Output exactly one JSON object.`;
}

export function buildUserPrompt(role: string, matchData: any[]): string {
  const summaries = matchData
    .map((data, i) => {
      const p = data.player;
      const timeline = data.timeline;

      let dragons = 0;
      let barons = 0;
      let heralds = 0;
      let firstBlood = false;
      let multikills = 0;

      if (timeline?.info?.frames) {
        for (const frame of timeline.info.frames) {
          const participant = frame.participantFrames?.[p.participantId];
          if (participant) {
            dragons += participant.dragonKills ?? 0;
            barons += participant.baronKills ?? 0;
            heralds += participant.riftHeraldKills ?? 0;
          }
        }
      }

      if (p.firstBloodKill || p.firstBloodAssist) firstBlood = true;

      multikills =
        (p.doubleKills ?? 0) + (p.tripleKills ?? 0) + (p.quadraKills ?? 0) + (p.pentaKills ?? 0);

      const totalCs = (p.totalMinionsKilled ?? 0) + (p.neutralMinionsKilled ?? 0);

      return [
        // keep the index for model structure, but we tell it not to TELL the user
        `match: ${i + 1}`,
        `win: ${p.win ? 'true' : 'false'}`,
        `lane: ${p.teamPosition || p.individualPosition || 'UNKNOWN'}`,
        `kda: ${p.kills}/${p.deaths}/${p.assists}`,
        `cs: ${totalCs}`,
        `damageToChamps: ${p.totalDamageDealtToChampions ?? 0}`,
        `visionScore: ${p.visionScore ?? 0}`,
        `dragons: ${dragons}`,
        `barons: ${barons}`,
        `heralds: ${heralds}`,
        `firstBlood: ${firstBlood}`,
        `multikills: ${multikills}`,
      ].join(' | ');
    })
    .join('\n');

  return (
    `PLAYER CONTEXT\n` +
    `role: ${role}\n` +
    // don't give a concrete number
    `sample_size: multiple recent ranked games (do NOT repeat this as a number)\n` +
    `---\n` +
    `MATCHES (one per line, machine-readable):\n` +
    `${summaries}\n` +
    `---\n` +
    `TASK\n` +
    `Using ONLY the matches above, analyze this player in the context of their role (${role}). ` +
    `Focus on: consistency across games, deaths and positioning, objective presence (dragons/barons/heralds), ` +
    `vision contribution, and damage/CS appropriate to the role.\n` +
    `OUTPUT FORMAT (STRICT):\n` +
    `{\n` +
    `  "analysis": {\n` +
    `    "overall": "1-3 sentences, qualitative, no exact game counts, no patch mentions unless clearly relevant",\n` +
    `    "strengths": ["1-8 items, 1-2 sentences each, qualitative only"],\n` +
    `    "improvement": ["1-8 items, 1-2 sentences each, qualitative only"]\n` +
    `  }\n` +
    `}\n` +
    `Rules:\n` +
    `- Output valid JSON ONLY. No markdown. No extra keys. No trailing commas.\n` +
    `- Do NOT mention specific match indexes (like "match 5") and do NOT mention total game count.\n` +
    `- Do NOT copy numeric values from the input; describe them as high/low/consistent/inconsistent.\n` +
    `- If objectives are consistently 0, call out poor objective presence.\n` +
    `- If deaths are high in wins, call out reliance on team tempo.\n` +
    `- If role is support, be forgiving on CS but strict on vision/objectives.\n` +
    `- If role is jungle, be strict on objectives and tempo impact.\n` +
    `- If role is solo lane/ADC, be strict on CS and sustained damage.\n` +
    `- If data is thin or noisy, state uncertainty explicitly in "overall" without giving the exact number of games.`
  );
}
