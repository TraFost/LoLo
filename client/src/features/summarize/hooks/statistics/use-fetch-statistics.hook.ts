import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ResponseWithData } from 'shared/src/types/response';
import type { StatisticsResponse } from 'shared/src/types/statistics.type';
import { useFetchAccount } from '../account/use-fetch-account.hook';

const fetchStatistics = async (puuid: string, region: string): Promise<StatisticsResponse> => {
  const res = await axios.get<ResponseWithData<StatisticsResponse>>(
    `http://localhost:3000/api/statistics/${puuid}`,
    { params: { region } },
  );

  const response = res.data;
  if (!response.success) {
    throw new Error(response.message || 'API call was not successful');
  }

  return response.data;
};

export function useFetchStatistics() {
  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
    isMissingParams,
    region,
  } = useFetchAccount();

  const puuid = accountData?.puuid;

  const statisticsQuery = useQuery({
    queryKey: ['statistics', puuid, region],
    queryFn: () => fetchStatistics(puuid!, region!),
    enabled: !!puuid && !isAccountLoading && !isMissingParams,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return {
    ...statisticsQuery,
    accountData,
    isAccountLoading,
    isAccountError,
    accountError,
    isMissingParams,
  };
}
