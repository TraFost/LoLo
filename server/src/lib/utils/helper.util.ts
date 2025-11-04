export const normalizeRole = (
  teamPosition?: string,
  individualPosition?: string,
): 'ADC' | 'Mid' | 'Jungle' | 'Top' | 'Support' => {
  const raw = (teamPosition || individualPosition || 'ADC').toUpperCase();
  if (raw === 'ADC' || raw === 'BOTTOM' || raw === 'BOT' || raw === 'DUO_CARRY') return 'ADC';
  if (raw === 'MIDDLE' || raw === 'MID') return 'Mid';
  if (raw === 'JUNGLE') return 'Jungle';
  if (raw === 'TOP') return 'Top';
  if (raw === 'UTILITY' || raw === 'SUPPORT' || raw === 'DUO_SUPPORT') return 'Support';
  return 'ADC';
};

export function formatRoleDisplay(role: string): string {
  const normalized = role?.toLowerCase() ?? '';
  if (normalized === 'mid') return 'Mid Lane';
  if (normalized === 'jungle') return 'Jungle';
  if (normalized === 'top') return 'Top Lane';
  if (normalized === 'support') return 'Support';
  if (normalized === 'adc') return 'Bot Lane';
  return role;
}

export function safeJson<T = unknown>(text: string | null | undefined): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
