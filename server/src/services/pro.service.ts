import type { PlatformRegion } from 'shared/src/types/account.type';

import { putObject, getJSONFromS3 } from '../lib/utils/s3.util';
import { buildPlayerSignature } from '../lib/utils/signature.util';
import type { ProProfile, ProSignature } from '../types/pro.type';
import { AnalyzeService } from './analyze.service';

export interface ProIngestInput {
  id: string;
  name?: string;
  puuid: string;
  region: PlatformRegion;
  role?: string;
}

export class ProService {
  async ingestPro(
    input: ProIngestInput,
  ): Promise<{ profile: ProProfile; signature: ProSignature }> {
    const analyzeService = new AnalyzeService(input.region);
    const { role: detectedRole, matchData } = await analyzeService.getImprovementAnalysis(
      input.puuid,
    );

    const role = input.role ?? detectedRole;
    const signature = buildPlayerSignature(role, matchData);
    const displayName = input.name ?? input.id;

    const profile: ProProfile = {
      id: input.id,
      name: displayName,
      role,
      matchData,
    };

    const indexEntry: ProSignature = {
      id: input.id,
      role,
      sampleSize: signature.sampleSize,
      kdaAvg: signature.kdaAvg,
      csPerGame: signature.csPerGame,
      visionPerGame: signature.visionPerGame,
      objPresence: signature.objPresence,
    };

    const currentIndex = await this.loadExistingSignatures();
    const nextIndex = [...currentIndex.filter((entry) => entry.id !== input.id), indexEntry];

    await putObject({
      key: 'pros/index.json',
      body: JSON.stringify(nextIndex, null, 2),
      contentType: 'application/json',
    });

    await putObject({
      key: `pros/full/${input.id}.json`,
      body: JSON.stringify(profile, null, 2),
      contentType: 'application/json',
    });

    return { profile, signature: indexEntry };
  }

  private async loadExistingSignatures(): Promise<ProSignature[]> {
    try {
      const index = await getJSONFromS3<ProSignature[]>('pros/index.json');
      if (!Array.isArray(index)) return [];

      return index.map((entry) => {
        const { sampleSize = 0, ...rest } = entry as ProSignature & { sampleSize?: number };
        return { sampleSize, ...rest };
      });
    } catch (err: unknown) {
      const code = (err as any)?.$metadata?.httpStatusCode;
      const name = (err as any)?.name;
      const message = (err as any)?.message;
      if (code === 404 || name === 'NoSuchKey' || message?.includes('Empty object')) {
        return [];
      }
      throw err;
    }
  }
}
