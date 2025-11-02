import { z } from 'zod';

export const improvementRequestSchema = z.object({
  puuid: z.string(),
  region: z.string(),
});

export const improvementResponseSchema = z.object({
  improvement: z.object({
    analysis: z.object({
      overall: z.string(),
      strengths: z.array(z.string()).length(3),
      improvement: z.array(z.string()).length(3),
    }),
  }),
});

export type ImprovementRequest = z.infer<typeof improvementRequestSchema>;
export type ImprovementResponse = z.infer<typeof improvementResponseSchema>;
