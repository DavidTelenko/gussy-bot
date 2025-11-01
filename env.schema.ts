import { z } from 'zod';

export const envSchema = z.object({
  BOT_TOKEN: z.string(),
  DISABLE_COLOR: z.stringbool().optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;
