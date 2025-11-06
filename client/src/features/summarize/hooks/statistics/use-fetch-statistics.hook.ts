import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ResponseWithData } from 'shared/src/types/response';
import type { StatisticsResponse } from 'shared/src/types/statistics.type';
import { useFetchAccount } from '../account/use-fetch-account.hook';

const fetchStatistics = async (puuid: string, region: string): Promise<StatisticsResponse> => {
  try {
    const res = await axios.get<ResponseWithData<StatisticsResponse>>(
      `https://vncjbglssbpomo62pxk3rfkasu0ejovz.lambda-url.ap-southeast-1.on.aws/api/statistics/${puuid}`,
      { params: { region } },
    );
    const response = res.data;

    if (!response.success) {
      throw new Error(response.message || 'API call was not successful');
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'An unknown error occurred';

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.details?.message ||
        error.response?.data?.message ||
        error.message ||
        'An Axios error occurred';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
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
