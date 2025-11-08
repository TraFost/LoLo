import { apiClient } from '@/lib/utils/api-client';
import { ProComparisonRequestDTO, ProComparisonDTO } from 'shared/src/types/analyze.dto';
import { ResponseWithData } from 'shared/src/types/response';

export const postComparison = async ({
  puuid,
  region,
}: ProComparisonRequestDTO): Promise<ProComparisonDTO> => {
  const res = await apiClient.post<ResponseWithData<ProComparisonDTO>>('/analyze/pro-comparison', {
    puuid,
    region,
  });

  const response = res.data;
  return response.data;
};
