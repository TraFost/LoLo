import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { AccountDTO } from 'shared/src/types/account.type';
import type { ResponseWithData } from 'shared/src/types/response';

export const fetchAccount = async ({
  gameName,
  tagName,
}: {
  gameName: string;
  tagName: string;
}): Promise<AccountDTO> => {
  try {
    const res = await axios.get<ResponseWithData<AccountDTO>>(
      `http://localhost:3000/api/account/${gameName}/${tagName}`,
    );
    const response = res.data;
    console.log(response);

    if (!response.success) {
      throw new Error(response.message || 'API call was not successful');
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error details: ', error.response?.data);

      const errorMessage: string = error.response?.data?.details.data.status.message;

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

  const isMissingParams = searchParams.size === 0;

  useEffect(() => {
    if (isMissingParams) {
      navigate('/analyze');
    }
  }, [isMissingParams, navigate]);

  const query = useQuery({
    queryKey: ['account', gameName, tagName],
    queryFn: () => fetchAccount({ gameName: gameName!, tagName: tagName! }),
    enabled: !isMissingParams,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isMissingParams,
  };
}
