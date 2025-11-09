import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnalyzeRequestDTO,
  ImprovementResponseDTO,
  ProComparisonDTO,
} from 'shared/src/types/analyze.dto';
import { ResponseWithData } from 'shared/src/types/response';
import { apiClient } from '@/lib/utils/api/api-client.util';
import { getErrorMessage } from '@/lib/utils/error/error-message';
import { AnalyzeResponse } from '@/types/analyze';

const postAnalysis = async (payload: AnalyzeRequestDTO): Promise<ImprovementResponseDTO> => {
  const res = await apiClient.post<ResponseWithData<ImprovementResponseDTO>>(
    '/analyze/improvement',
    payload,
  );
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
};

const postComparison = async (payload: AnalyzeRequestDTO): Promise<ProComparisonDTO> => {
  const res = await apiClient.post<ResponseWithData<ProComparisonDTO>>(
    '/analyze/pro-comparison',
    payload,
  );

  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
};

export function useAnalyzeMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<AnalyzeResponse, Error, AnalyzeRequestDTO>({
    mutationFn: async (payload) => {
      const [analyze, comparison] = await Promise.all([
        postAnalysis(payload),
        postComparison(payload),
      ]);
      return { analyze, comparison };
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData(['analyze', variables.puuid, variables.region], data);
    },

    onError: (error) => {
      console.error('Analyze failed:', getErrorMessage(error));
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
