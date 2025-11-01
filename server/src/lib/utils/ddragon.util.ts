import { createHttpClient } from 'shared/src/lib/axios';

const ddragonClient = createHttpClient({
  baseURL: 'https://ddragon.leagueoflegends.com',
  timeoutMs: 10000,
  retries: 2,
});

export async function getCurrentPatch(): Promise<string> {
  try {
    const res = await ddragonClient.get<string[]>('/api/versions.json');
    const versions = res.data;
    const latest = versions?.[0];
    return latest ? latest.split('.').slice(0, 2).join('.') : '14.20';
  } catch (e: any) {
    console.warn('Failed to fetch current patch:', e.message);
    return '14.20';
  }
}

export async function getLatestVersion(): Promise<string> {
  try {
    const res = await ddragonClient.get<string[]>('/api/versions.json');
    const versions = res.data;
    return versions?.[0] ?? '14.20';
  } catch (e: any) {
    console.warn('Failed to fetch latest version:', e.message);
    return '14.20';
  }
}
