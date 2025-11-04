export interface ProSignature {
  id: string;
  role: string;
  sampleSize: number;
  kdaAvg: number;
  csPerGame: number;
  visionPerGame: number;
  objPresence: number;
}

export interface ProProfile {
  id: string;
  name?: string;
  role: string;
  matchData: any[];
}
