import { z } from 'zod';
import { commaSeparatedArray } from './utils/schemas.js';

export const envSchema = z.object({
  BOT_TOKEN: z.string(),
  DEV: z.stringbool().optional(),
  DISABLE_COLOR: z.stringbool().optional(),
  PORT: z.coerce.number(),
  WHITELIST: commaSeparatedArray,
  YT_DLP_BIN: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
