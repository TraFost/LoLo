import { ImprovementResponseDTO, ProComparisonDTO } from 'shared/src/types/analyze.dto';

export interface AnalyzeResponse {
  analyze: ImprovementResponseDTO;
  comparison: ProComparisonDTO;
}
