import type { AccountDTO, Account, Region, SummonerDTO } from 'shared/src/types/account.type';
import type { HttpInstance } from 'shared/src/lib/axios';

import { getLatestVersion } from '../lib/utils/ddragon.util';
import { createRegionalClient, createPlatformClient } from '../lib/utils/riot.util';

export class AccountService {
  private regionalClient: HttpInstance;
  private platformClient: HttpInstance;

  constructor(platformRegion: Region) {
    this.regionalClient = createRegionalClient(platformRegion);
    this.platformClient = createPlatformClient(platformRegion);
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

  async getAccountPict(puuid: string): Promise<string> {
    const url = `/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;

    const res = await this.platformClient.get<SummonerDTO>(url);
    const version = await getLatestVersion();
    const profilePict = await this.getProfilePictUrl(version, res.data.profileIconId);

    return profilePict;
  }
}
