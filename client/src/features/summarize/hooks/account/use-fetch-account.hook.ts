import { apiClient } from '@/lib/utils/api/api-client.util';
import { getErrorMessage } from '@/lib/utils/error/error-message';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { AccountDTO, RankSummaryDTO } from 'shared/src/types/account.type';
import { ResponseWithData } from 'shared/src/types/response';

interface AccountDTOResponse extends AccountDTO {
  profilePict: string;
  rank: RankSummaryDTO;
  summonerLevel: number;
}

export const fetchAccount = async ({
  gameName,
  tagName,
  region,
}: {
  gameName: string;
  tagName: string;
  region: string;
}): Promise<AccountDTOResponse> => {
  try {
    const res = await apiClient.get<ResponseWithData<AccountDTOResponse>>(
      `/account/${gameName}/${tagName}`,
      {
        params: {
          region,
        },
      },
    );
    const response = res.data;

    if (!response.success) {
      throw new Error(response.message || 'API call was not successful');
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export function useFetchAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gameName = searchParams.get('game');
  const tagName = searchParams.get('tag');
  const region = searchParams.get('region');

  const isMissingParams = searchParams.size < 3;

  useEffect(() => {
    if (isMissingParams) {
      navigate('/analyze');
    }
  }, [isMissingParams, navigate]);

  const query = useQuery({
    queryKey: ['account', gameName, tagName, region],
    queryFn: () => fetchAccount({ gameName: gameName!, tagName: tagName!, region: region! }),
    enabled: !isMissingParams,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return {
    ...query,
    isMissingParams,
    region,
  };
}
