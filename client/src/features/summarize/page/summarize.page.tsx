import { HeroesSummarize } from '../components/heroes.summarize';
import { GameplayOverview } from '../components/gameplay-overview.summarize';
import { ProPlayer } from '../components/pro-player.summarize';
import { RecapIntro } from '../components/recap-intro.summarize';
import { Statistics } from '../components/statistics.summarize';

export function SummarizePage() {
  return (
    <div className="flex flex-col items-center bg-gray-950 text-white">
      <RecapIntro />
      <Statistics />
      <HeroesSummarize />
      <GameplayOverview />
      <ProPlayer />
    </div>
  );
}
