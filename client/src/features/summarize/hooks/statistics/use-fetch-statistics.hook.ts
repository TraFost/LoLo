import { useQuery } from '@tanstack/react-query';
import type { ResponseWithData } from 'shared/src/types/response';
import type { StatisticsResponse } from 'shared/src/types/statistics.type';
import { useFetchAccount } from '../account/use-fetch-account.hook';
import { fetchWithProgress } from '@/lib/utils/api/api-client.util';
import { useState } from 'react';
import { getErrorMessage } from '@/lib/utils/error/error-message';

const fetchStatistics = async (
  puuid: string,
  region: string,
  onProgress?: (p: number) => void,
): Promise<StatisticsResponse> => {
  try {
    const res = await fetchWithProgress<ResponseWithData<StatisticsResponse>>(
      `/statistics/${puuid}`,
      { params: { region }, onProgress },
    );

    if (!res.success) throw new Error(res.message || 'API call was not successful');
    return res.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export function useFetchStatistics() {
  const [progress, setProgress] = useState(0);

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
    queryFn: () => fetchStatistics(puuid!, region!, setProgress),
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
    region,
    progress,
  };
}
