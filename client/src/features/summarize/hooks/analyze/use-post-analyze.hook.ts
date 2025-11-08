import { useFetchAccount } from '../account/use-fetch-account.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalyzeRequestDTO, ImprovementResponseDTO } from 'shared/src/types/analyze.dto';
import { ResponseWithData } from 'shared/src/types/response';
import { postComparison } from '../comparison/use-post-comparison';
import { apiClient } from '@/lib/utils/api-client';

const postAnalyze = async ({
  puuid,
  region,
}: AnalyzeRequestDTO): Promise<ImprovementResponseDTO> => {
  const res = await apiClient.post<ResponseWithData<ImprovementResponseDTO>>(
    '/analyze/improvement',
    {
      puuid,
      region,
    },
  );

  const response = res.data;
  return response.data;
};

export function usePostAnalyze() {
  const { data: accountData, region } = useFetchAccount();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!accountData || !region) {
        throw new Error('Missing account data or region not provided');
      }

      const payload = { puuid: accountData.puuid, region };

      const [analyze, comparison] = await Promise.all([
        postAnalyze(payload),
        postComparison(payload),
      ]);

      return { analyze, comparison };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['analyze', accountData?.puuid, region], data);
    },
  });

  return mutation;
}
