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
import { useAnalyzeMutation } from '../hooks/analyze/use-analyze-mutation.hook';
import { useEffect } from 'react';

export function SummarizePage() {
  const {
    data: statistics,
    error,
    isError,
    isLoading,
    isMissingParams,
    isFetched,
    accountData,
    isAccountError,
    isAccountLoading,
    accountError,
    region,
    progress,
  } = useFetchStatistics();

  const {
    mutate,
    data: analyzeData,
    isLoading: isAnalyzeLoading,
    isError: isAnalyzeError,
    error: analyzeError,
  } = useAnalyzeMutation();

  const champions = fillChampions(statistics?.champions ?? [], 5);

  useEffect(() => {
    if (accountData && isFetched && region) {
      mutate({
        puuid: accountData.puuid,
        region: region,
      });
    }
  }, [isFetched, accountData?.puuid, region]);

  const analyzeState = {
    isLoading: isAnalyzeLoading,
    isError: isAnalyzeError,
    error: analyzeError,
  };

  return (
    <RenderState
      isRedirecting={isMissingParams}
      isAccountLoading={isAccountLoading}
      isLoading={isLoading}
      isError={isAccountError || isError}
      progress={progress}
      error={accountError?.message || error?.message}
    >
      {accountData && statistics && region ? (
        <div className="flex flex-col items-center bg-gray-950 text-white">
          <RecapIntro
            gameName={accountData.gameName}
            tagName={accountData.tagLine}
            championName={champions[0].name}
            profilePict={accountData.profilePict}
            rank={accountData.rank}
            summonerLevel={accountData.summonerLevel}
          />
          <Statistics statistics={statistics.statistics} />
          <ChampionsSummarize champions={champions} />
          <GameplayOverview
            gameplayData={statistics.gameplay}
            analyzeData={analyzeData}
            analyzeState={analyzeState}
          />
          <ProPlayer
            playerName={accountData.gameName}
            analyzeData={analyzeData}
            analyzeState={analyzeState}
          />
          {analyzeData && (
            <ImageCardSection>
              <MostPlayedChampionsCard
                playerName={`${accountData.gameName}#${accountData.tagLine}`}
                champions={champions}
                puuid={accountData.puuid}
              />
              <PlayerOverviewCard
                playerName={`${accountData.gameName}#${accountData.tagLine}`}
                statistics={statistics.statistics}
                roleDistribution={statistics.gameplay.roleDistribution}
                puuid={accountData.puuid}
              />
              <PlayerComparisonCard
                playerName={`${accountData.gameName}#${accountData.tagLine}`}
                comparison={analyzeData.comparison}
                puuid={accountData.puuid}
              />
            </ImageCardSection>
          )}
        </div>
      ) : null}
    </RenderState>
  );
}
