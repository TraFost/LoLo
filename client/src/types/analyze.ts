import { ImprovementResponseDTO, ProComparisonDTO } from 'shared/src/types/analyze.dto';

export interface AnalyzeResponse {
  analyze: ImprovementResponseDTO;
  comparison: ProComparisonDTO;
}

export interface AnalyzeProps {
  analyzeData?: AnalyzeResponse;
  analyzeState?: {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
}
