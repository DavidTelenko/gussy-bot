import { z } from 'zod';
import { commaSeparatedNumberArray } from './utils/schemas.js';

export const envSchema = z.object({
  BOT_TOKEN: z.string(),
  DEV: z.stringbool().optional(),
  DISABLE_COLOR: z.stringbool().optional(),
  PORT: z.coerce.number(),
  SECRET_PATH: z.string(),
  WHITELIST: commaSeparatedNumberArray,
  YT_DLP_BIN: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
