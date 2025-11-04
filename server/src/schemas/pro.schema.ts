import { z } from 'zod';

export const proIngestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  puuid: z.string().min(1),
  region: z.string().min(1),
  role: z.string().optional(),
});

export type ProIngestRequest = z.infer<typeof proIngestSchema>;
