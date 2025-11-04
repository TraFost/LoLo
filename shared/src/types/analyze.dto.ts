export interface AnalyzeRequestDTO {
  puuid: string;
  region: string;
}

export interface AnalysisDTO {
  analysis: {
    overall: string;
    strengths: string[];
    improvement: string[];
  };
}

export interface LabeledValueDTO {
  label: string;
  value: string;
}

export interface ProPlayerComparisonDTO {
  name: string;
  role: string;
  playstyle: string;
  similarities: string[];
  playstyleDetails: string[];
  summary: string;
}

export interface ComparisonChartEntryDTO {
  stat: string;
  player: number;
  proPlayer: number;
}

export interface ProComparisonDTO {
  playerAnalysis: LabeledValueDTO[];
  proPlayer: ProPlayerComparisonDTO;
  comparisonChart: ComparisonChartEntryDTO[];
}

export type ImprovementRequestDTO = AnalyzeRequestDTO;
export type ProComparisonRequestDTO = AnalyzeRequestDTO;
