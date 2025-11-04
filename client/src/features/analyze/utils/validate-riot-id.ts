export const validateAndSplitRiotId = (fullRiotId: string) => {
  const regex = /^(.+)#(.+)$/;
  const match = fullRiotId.trim().match(regex);
  if (!match) return { isValid: false, gameName: '', tagName: '' };
  return { isValid: true, gameName: match[1], tagName: match[2] };
};
