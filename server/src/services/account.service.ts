import type {
  AccountDTO,
  Account,
  SummonerDTO,
  PlatformRegion,
  LeagueEntryDTO,
  RankSummaryDTO,
} from 'shared/src/types/account.type';
import type { HttpInstance } from 'shared/src/lib/axios';

import { getLatestVersion } from '../lib/utils/ddragon.util';
import { createRegionalClient, createPlatformClient } from '../lib/utils/riot.util';
import { getJSONFromS3, isS3Enabled, putObject } from '../lib/utils/s3.util';

export interface AccountSnapshot {
  fetchedAt: string;
  region: PlatformRegion;
  account: AccountDTO;
  summoner: SummonerDTO;
  profilePict: string;
  rankEntries: LeagueEntryDTO[];
  rank?: RankSummaryDTO | null;
}

export class AccountService {
  private regionalClient: HttpInstance;
  private platformClient: HttpInstance;
  private readonly region: PlatformRegion;

  constructor(platformRegion: PlatformRegion) {
    this.region = platformRegion;
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

  getProfilePictUrl(version: string, profileIconId: number) {
    return `https://ddragon.leagueoflegends.com/cdn/${encodeURIComponent(
      version,
    )}/img/profileicon/${encodeURIComponent(profileIconId)}.png`;
  }

  async getSummonerByPuuid(puuid: string): Promise<SummonerDTO> {
    const url = `/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;

    const res = await this.platformClient.get<SummonerDTO>(url);
    return res.data;
  }

  async getAccountProfile(puuid: string): Promise<{ summoner: SummonerDTO; profilePict: string }> {
    const summoner = await this.getSummonerByPuuid(puuid);
    const version = await getLatestVersion();

    const profilePict = this.getProfilePictUrl(version, summoner.profileIconId);

    return { summoner, profilePict };
  }

  async getLeagueEntries(summonerPuuid: string): Promise<LeagueEntryDTO[]> {
    const url = `/lol/league/v4/entries/by-puuid/${encodeURIComponent(summonerPuuid)}`;
    const res = await this.platformClient.get<LeagueEntryDTO[]>(url);
    return Array.isArray(res.data) ? res.data : [];
  }

  async getCachedAccount(gameName: string, tagLine: string): Promise<AccountSnapshot | null> {
    if (!isS3Enabled()) {
      return null;
    }

    const lookupKey = getLookupKey(this.region, gameName, tagLine);
    try {
      const lookup = await getJSONFromS3<{ puuid?: string }>(lookupKey);
      if (!lookup?.puuid) {
        return null;
      }

      const snapshotKey = getSnapshotKey(this.region, lookup.puuid);
      try {
        const snapshot = await getJSONFromS3<AccountSnapshot>(snapshotKey);
        return snapshot;
      } catch (err: any) {
        if (isNotFoundError(err)) {
          return null;
        }
        console.warn('Failed to load account snapshot', err);
        return null;
      }
    } catch (err: any) {
      if (isNotFoundError(err)) {
        return null;
      }
      console.warn('Failed to read account cache lookup', err);
      return null;
    }
  }

  selectPrimaryRank(entries: LeagueEntryDTO[]): RankSummaryDTO | null {
    if (!Array.isArray(entries) || entries.length === 0) return null;

    const priorityQueues = ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'];
    const found = priorityQueues
      .map((queue) => entries.find((entry) => entry.queueType === queue))
      .find((entry) => entry !== undefined);

    const chosen = found ?? entries[0];
    if (!chosen) return null;

    return {
      queueType: chosen.queueType,
      tier: chosen.tier,
      division: chosen.rank,
      leaguePoints: chosen.leaguePoints,
      wins: chosen.wins,
      losses: chosen.losses,
      display: `${capitalize(chosen.tier)} ${chosen.rank} (${formatQueue(chosen.queueType)})`,
    };
  }

  async saveAccountSnapshot(snapshot: Omit<AccountSnapshot, 'fetchedAt'>): Promise<void> {
    if (!isS3Enabled()) {
      return;
    }

    const payload: AccountSnapshot = {
      fetchedAt: new Date().toISOString(),
      ...snapshot,
    };
    const snapshotKey = getSnapshotKey(snapshot.region, snapshot.account.puuid);
    await putObject({
      key: snapshotKey,
      body: JSON.stringify(payload, null, 2),
      contentType: 'application/json',
    });

    const lookupKey = getLookupKey(
      snapshot.region,
      snapshot.account.gameName,
      snapshot.account.tagLine,
    );
    await putObject({
      key: lookupKey,
      body: JSON.stringify(
        {
          puuid: snapshot.account.puuid,
          updatedAt: payload.fetchedAt,
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });
  }
}

function capitalize(input: string): string {
  if (!input) return input;
  const lower = input.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatQueue(queueType: string): string {
  switch (queueType) {
    case 'RANKED_SOLO_5x5':
      return 'Solo/Duo';
    case 'RANKED_FLEX_SR':
      return 'Flex';
    default:
      return queueType
        .split('_')
        .map((part) => capitalize(part))
        .join(' ');
  }
}

function getSnapshotKey(region: PlatformRegion, puuid: string): string {
  return `accounts/${region}/${puuid}.json`;
}

function getLookupKey(region: PlatformRegion, gameName: string, tagLine: string): string {
  return `accounts/${region}/riot-id/${encodeURIComponent(gameName.trim())}/${encodeURIComponent(
    tagLine.trim(),
  )}.json`;
}

function isNotFoundError(err: any): boolean {
  if (!err) return false;
  const status = err?.$metadata?.httpStatusCode;
  const name = err?.name;
  const message = err?.message as string | undefined;
  return (
    status === 404 ||
    name === 'NoSuchKey' ||
    (typeof message === 'string' && message.includes('Empty object'))
  );
}
