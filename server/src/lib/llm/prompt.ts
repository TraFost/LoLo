export const DEFAULT_TEMP = 0.2;
export const DEFAULT_MAX_TOKENS = 350;

export function buildSystemPrompt(): string {
  return `You are an expert League of Legends coach analyzing a player's recent match performance.

Based on the provided match summaries, generate a comprehensive analysis.

Output STRICT JSON only with this exact structure:
{
  "analysis": {
    "overall": "A detailed overall assessment of their performance across the matches",
    "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
    "improvement": ["Area to improve 1", "Area to improve 2", "Area to improve 3"]
  }
}

Rules:
- No markdown, no extra keys, no invented data.
- Analyze patterns in KDA, CS, damage, vision, and win rates.
- Provide actionable insights based on the actual match data.
- Keep each array item to 1-2 sentences.`;
}

export function buildUserPrompt(role: string, patch: string, matchData: any[]): string {
  const summaries = matchData
    .map((data, i) => {
      const p = data.player;
      const timeline = data.timeline;

      let dragons = 0,
        barons = 0,
        firstBlood = false,
        multikills = 0;
      if (timeline?.info?.frames) {
        for (const frame of timeline.info.frames) {
          const participant = frame.participantFrames?.[p.participantId];
          if (participant) {
            dragons += participant.dragonKills ?? 0;
            barons += participant.baronKills ?? 0;
          }
        }
      }
      if (p.firstBloodKill || p.firstBloodAssist) firstBlood = true;
      multikills =
        (p.doubleKills ?? 0) + (p.tripleKills ?? 0) + (p.quadraKills ?? 0) + (p.pentaKills ?? 0);

      return `Match ${i + 1}: KDA=${p.kills}/${p.deaths}/${p.assists}, CS=${
        (p.totalMinionsKilled ?? 0) + (p.neutralMinionsKilled ?? 0)
      }, Damage=${p.totalDamageDealtToChampions}, Vision=${
        p.visionScore
      }, Dragons=${dragons}, Barons=${barons}, FirstBlood=${firstBlood}, Multikills=${multikills}, Win=${
        p.win
      }`;
    })
    .join('\n');

  return `Role: ${role}
Patch: ${patch}
Recent matches summary (including timeline data):
${summaries}

Analyze this player's performance in ${role} role. Focus on patterns in their gameplay, decision making, objective control, and areas for improvement. Consider their consistency across matches and specific strengths/weaknesses shown in the data.`;
}
