import { ChampionsSummarize } from '../components/champions.summarize';
import { GameplayOverview } from '../components/gameplay-overview.summarize';
import { ProPlayer } from '../components/pro-player.summarize';
import { RecapIntro } from '../components/recap-intro.summarize';
import { Statistics } from '../components/statistics.summarize';
import {
  ImageCardSection,
  MostPlayedChampionsCard,
  PlayerComparisonCard,
  PlayerOverviewCard,
} from '../components/image-card.summarize';
import { LoadingSection } from '@/ui/organisms/loading-section.organism';
import { useFetchStatistics } from '../hooks/statistics/use-fetch-statistics.hook';
import { ErrorSection } from '@/ui/organisms/error-section.organism';
import { fillChampions } from '../utils/champion/fill-champions.util';

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

  if (isAccountError) return <ErrorSection error={accountError!.message} />;

  if (isLoading) return <LoadingSection />;
  if (isError) return <ErrorSection error={error!.message} />;

  const champions = fillChampions(statistics!.champions, 5);

  return (
    <div className="flex flex-col items-center bg-gray-950 text-white">
      <RecapIntro
        gameName={accountData!.gameName}
        tagName={accountData!.tagLine}
        championName={champions[0].name}
        profilePict={accountData!.profilePict}
      />
      <Statistics statistics={statistics!.statistics} />
      <ChampionsSummarize champions={champions} />
      <GameplayOverview gameplayData={statistics!.gameplay} />
      <ProPlayer />
      <ImageCardSection>
        <MostPlayedChampionsCard
          playerName={`${accountData!.gameName}#${accountData!.tagLine}`}
          champions={champions}
        />
        <PlayerOverviewCard
          playerName={`${accountData!.gameName}#${accountData!.tagLine}`}
          statistics={statistics!.statistics}
          roleDistribution={statistics!.gameplay.roleDistribution}
        />
        <PlayerComparisonCard />
      </ImageCardSection>
    </div>
  );
}
