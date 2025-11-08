import { z } from 'zod';

export const shareImageQuerySchema = z.object({
  puuid: z.string().min(1, 'puuid is required'),
  cardType: z.enum(['player-overview', 'most-played', 'pro-comparison']),
});

export type ShareImageQuery = z.infer<typeof shareImageQuerySchema>;
