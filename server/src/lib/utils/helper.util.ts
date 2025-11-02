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
