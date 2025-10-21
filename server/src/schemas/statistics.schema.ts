import z from 'zod';

export const statisticsSchema = z.object({
  puuid: z.string().min(1, 'PUUID is required'),
});

export const statisticsQuerySchema = z.object({
  region: z.string().optional().default('ph2'),
  count: z.string().optional().default('100').transform(Number),
});
