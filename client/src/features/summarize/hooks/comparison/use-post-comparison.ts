import axios from 'axios';
import { useFetchAccount } from '../account/use-fetch-account.hook';
import { useMutation } from '@tanstack/react-query';
import { ProComparisonRequestDTO, ProComparisonDTO } from 'shared/src/types/analyze.dto';
import { ResponseWithData } from 'shared/src/types/response';

const postComparison = async ({
  puuid,
  region,
}: ProComparisonRequestDTO): Promise<ProComparisonDTO> => {
  try {
    const res = await axios.post<ResponseWithData<ProComparisonDTO>>(
      'https://vncjbglssbpomo62pxk3rfkasu0ejovz.lambda-url.ap-southeast-1.on.aws/api/analyze/pro-comparison',
      {
        puuid,
        region,
      },
    );

    const response = res.data;
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

export function usePostComparison() {
  const { data: accountData, region } = useFetchAccount();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!accountData || !region) {
        throw new Error('Missing account data or region not provided');
      }

      const payload = {
        puuid: accountData.puuid,
        region,
      };

      return postComparison(payload);
    },
  });

  return mutation;
}
