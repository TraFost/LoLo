import { HeroesSummarize } from '../components/heroes.summarize';
import { GameplayOverview } from '../components/gameplay-overview.summarize';
import { ProPlayer } from '../components/pro-player.summarize';
import { RecapIntro } from '../components/recap-intro.summarize';
import { Statistics } from '../components/statistics.summarize';
import { ImageCard } from '../components/image-card.summarize';
import { LoadingSection } from '@/ui/organisms/loading-section.organism';
import { useFetchAccount } from '../hooks/useFetchAccount';

export function SummarizePage() {
  const { data, error, isError, isLoading, isMissingParams } = useFetchAccount();

  if (isMissingParams) return <p>Redirecting...</p>;

  if (isLoading) return <LoadingSection />;

  if (isError)
    return (
      <div>
        <p>Something went wrong</p>
        <p>{error.message}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center bg-gray-950 text-white">
      <RecapIntro gameName={data!.gameName} tagName={data!.tagLine} />
      <Statistics />
      <HeroesSummarize />
      <GameplayOverview />
      <ProPlayer />
      <ImageCard />
    </div>
  );
}
