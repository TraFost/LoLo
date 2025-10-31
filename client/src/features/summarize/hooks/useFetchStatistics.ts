import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ResponseWithData } from 'shared/src/types/response';
import type { StatisticsResponse } from 'shared/src/types/statistics.type';
import { useFetchAccount } from './useFetchAccount';

const fetchStatistics = async (puuid: string): Promise<StatisticsResponse> => {
  const res = await axios.get<ResponseWithData<StatisticsResponse>>(
    `http://localhost:3000/api/statistics/${puuid}`,
    { params: { region: 'kr' } },
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
  } = useFetchAccount();

  const puuid = accountData?.puuid;

  const statisticsQuery = useQuery({
    queryKey: ['statistics', puuid],
    queryFn: () => fetchStatistics(puuid!),
    enabled: !!puuid && !isAccountLoading && !isMissingParams,
    retry: 1,
    refetchOnWindowFocus: false,
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
