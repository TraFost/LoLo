import { ChampionsSummarize } from '../components/champions.summarize';
import { GameplayOverview } from '../components/gameplay-overview.summarize';
import { ProPlayer } from '../components/pro-player.summarize';
import { RecapIntro } from '../components/recap-intro.summarize';
import { Statistics } from '../components/statistics.summarize';
import { ImageCard } from '../components/image-card.summarize';
import { LoadingSection } from '@/ui/organisms/loading-section.organism';
import { useFetchStatistics } from '../hooks/useFetchStatistics';

export function SummarizePage() {
  const {
    data: statistics,
    error,
    isError,
    isLoading,
    isMissingParams,
    accountData,
    isAccountError,
    isAccountLoading,
    accountError,
  } = useFetchStatistics();

  if (isMissingParams) return <p>Redirecting...</p>;

  if (isAccountLoading) return <LoadingSection />;

  if (isAccountError)
    return (
      <div>
        <p>Something went wrong</p>
        <p>{accountError!.message}</p>
      </div>
    );

  if (isLoading) return <p>Loading statistics...</p>;
  if (isError)
    return (
      <div>
        <p>Failed to fetch statistics</p>
        <p>{error?.message}</p>
      </div>
    );
  console.log(isError);

  return (
    <div className="flex flex-col items-center bg-gray-950 text-white">
      <RecapIntro
        gameName={accountData!.gameName}
        tagName={accountData!.tagLine}
        championName={statistics!.champions.length !== 0 ? statistics!.champions[0].name : 'Yuumi'}
      />
      <Statistics statistics={statistics!.statistics} />
      <ChampionsSummarize champions={statistics!.champions} />
      <GameplayOverview roleDistribution={statistics!.gameplay.roleDistribution} />
      <ProPlayer />
      <ImageCard />
    </div>
  );
}
