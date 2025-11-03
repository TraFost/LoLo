import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { AccountDTO } from 'shared/src/types/account.type';
import type { ResponseWithData } from 'shared/src/types/response';

interface AccountResponse extends AccountDTO {
  profilePict: string;
}

export const fetchAccount = async ({
  gameName,
  tagName,
  region,
}: {
  gameName: string;
  tagName: string;
  region: string;
}): Promise<AccountResponse> => {
  try {
    const res = await axios.get<ResponseWithData<AccountResponse>>(
      `http://localhost:3000/api/account/${gameName}/${tagName}`,
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
    if (axios.isAxiosError(error)) {
      console.error('Axios error details: ', error);

      const errorMessage: string = error.response?.data?.details.message || error.message;

      throw new Error(errorMessage);
    } else {
      console.error('An unexpected error occurred: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export function useFetchAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gameName = searchParams.get('game');
  const tagName = searchParams.get('tag');
  const region = searchParams.get('region');

  const isMissingParams = searchParams.size === 0;

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
