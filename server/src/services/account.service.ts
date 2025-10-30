import { createHttpClient, type HttpInstance } from 'shared/src/lib/axios';
import { PLATFORM_HOST_MAP, REGION_MAP } from 'shared/src/constants/match.constant';
import type { AccountDTO, Account, Region } from 'shared/src/types/account.type';

import { ENV } from '../configs/env.config';

export class AccountService {
  private regionalClient: HttpInstance;
  private platformClient: HttpInstance;

  constructor(platformRegion: Region) {
    const key = platformRegion.toLowerCase().trim();

    const regional = REGION_MAP[key] ?? (['kr', 'jp1'].includes(key) ? 'asia' : 'americas');
    this.regionalClient = createHttpClient({
      baseURL: `https://${regional}.api.riotgames.com`,
      defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
      timeoutMs: 15000,
      retries: 3,
    });

    const platformHost = PLATFORM_HOST_MAP[key];
    if (!platformHost) throw new Error(`unsupported platform region: ${key}`);

    this.platformClient = createHttpClient({
      baseURL: `https://${platformHost}.api.riotgames.com`,
      defaultHeaders: { 'X-Riot-Token': ENV.riot_api },
      timeoutMs: 15000,
      retries: 3,
    });
  }

  async getLatestVersion() {
    const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions: any = await res.json();

    return versions[0];
  }

  async getAccountByRiotId(params: Account): Promise<AccountDTO> {
    const { gameName, tagLine } = params;
    const url = `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName,
    )}/${encodeURIComponent(tagLine)}`;
    const res = await this.regionalClient.get<AccountDTO>(url);
    return res.data;
  }

  async getProfilePictUrl(version: string, profileIconId: number) {
    return `https://ddragon.leagueoflegends.com/cdn/${encodeURIComponent(
      version,
    )}/img/profileicon/${encodeURIComponent(profileIconId)}.png`;
  }

  async getAccountPict(puuid: string) {
    const url = `/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;

    const res: any = await this.platformClient.get<any>(url);

    const version = await this.getLatestVersion();

    const profilePict = await this.getProfilePictUrl(version, res.data.profileIconId);

    return profilePict;
  }
}
