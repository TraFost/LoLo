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
import { useFetchStatistics } from '../hooks/statistics/use-fetch-statistics.hook';
import { fillChampions } from '../utils/champion/fill-champions.util';
import { RenderState } from '../components/render-state.summarize';

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

  const champions = fillChampions(statistics?.champions ?? [], 5);

  return (
    <RenderState
      isRedirecting={isMissingParams}
      isAccountLoading={isAccountLoading}
      isLoading={isLoading}
      isError={isAccountError || isError}
      error={
        typeof accountError === 'object'
          ? accountError?.message
          : accountError || (typeof error === 'object' ? error?.message : error)
      }
    >
      {accountData && statistics ? (
        <div className="flex flex-col items-center bg-gray-950 text-white">
          <RecapIntro
            gameName={accountData.gameName}
            tagName={accountData.tagLine}
            championName={champions[0].name}
            profilePict={accountData.profilePict}
          />
          <Statistics statistics={statistics.statistics} />
          <ChampionsSummarize champions={champions} />
          <GameplayOverview gameplayData={statistics.gameplay} />
          <ProPlayer />
          <ImageCardSection>
            <MostPlayedChampionsCard
              playerName={`${accountData!.gameName}#${accountData.tagLine}`}
              champions={champions}
            />
            <PlayerOverviewCard
              playerName={`${accountData.gameName}#${accountData.tagLine}`}
              statistics={statistics.statistics}
              roleDistribution={statistics.gameplay.roleDistribution}
            />
            <PlayerComparisonCard />
          </ImageCardSection>
        </div>
      ) : null}
    </RenderState>
  );
}
