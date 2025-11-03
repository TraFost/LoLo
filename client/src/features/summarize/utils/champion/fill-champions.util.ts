import { ChampionStats } from 'shared/src/types/statistics.type';

export function fillChampions(champions: ChampionStats[], max: number) {
  const templateChampion: ChampionStats = {
    name: 'Yuumi',
    matches: 0,
    winrate: 0,
    wins: 0,
    mastery: {
      chestGranted: false,
      level: 1,
      points: 0,
    },
  };

  return [
    ...champions,
    ...Array.from({ length: Math.max(0, max - champions.length) }, () => ({
      ...templateChampion,
    })),
  ].slice(0, max);
}
