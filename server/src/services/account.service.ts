import { createHttpClient, type HttpInstance } from 'shared/src/lib/axios';
import { REGION_MAP } from 'shared/src/constants/match.constant';
import type { AccountDTO, Account, Region } from 'shared/src/types/account.type';

import { ENV } from '../configs/env.config';

export class AccountService {
  private client: HttpInstance;

  constructor(platformRegion: Region) {
    const regional = REGION_MAP[platformRegion] || 'asia';

    this.client = createHttpClient({
      baseURL: `https://${regional}.api.riotgames.com`,
      timeoutMs: 10000,
      retries: 3,
      defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
    });
  }

  async getAccountByRiotId(params: Account): Promise<Account> {
    const { gameName, tagLine } = params;

    const url = `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName,
    )}/${encodeURIComponent(tagLine)}`;

    const res = await this.client.get<AccountDTO>(url);

    return res.data;
  }
}
