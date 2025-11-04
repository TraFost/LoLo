export interface PlayerSignature {
  role: string;
  sampleSize: number;
  kdaAvg: number;
  csPerGame: number;
  visionPerGame: number;
  objPresence: number;
}

export function buildPlayerSignature(role: string, matchData: any[]): PlayerSignature {
  const sampleSize = matchData.length;
  if (sampleSize === 0) {
    return {
      role,
      sampleSize,
      kdaAvg: 0,
      csPerGame: 0,
      visionPerGame: 0,
      objPresence: 0,
    };
  }

  let cs = 0;
  let vision = 0;
  let gamesWithObjective = 0;
  let kdaSum = 0;

  for (const entry of matchData) {
    const player = entry?.player ?? {};
    const timeline = entry?.timeline;

    const gameKills = Number(player.kills ?? 0);
    const gameDeaths = Number(player.deaths ?? 0);
    const gameAssists = Number(player.assists ?? 0);
    const laneCs = Number(player.totalMinionsKilled ?? 0);
    const jungleCs = Number(player.neutralMinionsKilled ?? 0);
    const gameVision = Number(player.visionScore ?? 0);

    cs += laneCs + jungleCs;
    vision += gameVision;
    kdaSum += (gameKills + gameAssists) / Math.max(1, gameDeaths);

    let touchedObjective = false;
    const frames: any[] | undefined = timeline?.info?.frames;
    if (Array.isArray(frames)) {
      const participantKey = String(player.participantId ?? '');
      for (const frame of frames) {
        const pf = frame?.participantFrames?.[participantKey];
        if (!pf) continue;
        const dragon = Number(pf.dragonKills ?? 0);
        const baron = Number(pf.baronKills ?? 0);
        const herald = Number(pf.riftHeraldKills ?? 0);
        if (dragon > 0 || baron > 0 || herald > 0) {
          touchedObjective = true;
          break;
        }
      }
    }

    if (touchedObjective) {
      gamesWithObjective += 1;
    }
  }

  return {
    role,
    sampleSize,
    kdaAvg: kdaSum / sampleSize,
    csPerGame: cs / sampleSize,
    visionPerGame: vision / sampleSize,
    objPresence: gamesWithObjective / sampleSize,
  };
}
