import { Telegraf } from 'telegraf';
import { audio, spoiler, video } from '../commands/index.js';
import { envSchema } from '../env.schema.js';
import { loadEnv } from '../utils/env.js';

loadEnv({
  path: '.env',
  schema: envSchema,
});

const bot = new Telegraf(process.env.BOT_TOKEN);
await bot.telegram.setWebhook(
  `https://localhost:${process.env.PORT}/${process.env.SECRET_PATH}`,
);

await bot.telegram.setMyCommands([audio.config, spoiler.config, video.config]);
