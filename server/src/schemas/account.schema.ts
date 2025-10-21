import z from 'zod';

export const accountSchema = z.object({
  gameName: z.string().min(1),
  tagLine: z.string().min(1),
});
