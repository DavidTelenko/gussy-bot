import { httpServerHandler } from 'cloudflare:node';
import { createServer } from 'http';
import { Composer, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { audio, spoiler, video } from '@/commands/index.js';
import { envSchema } from '@/env.schema.js';
import { protect } from '@/middleware/protect.js';
import { withoutCommand } from '@/middleware/withoutCommand.js';
import { withUrl } from '@/middleware/withUrl.js';
import { loadEnv } from '@/utils/env.js';
import type { LocalContext } from '@/utils/telegram/types.js';

loadEnv({
  path: '.env',
  schema: envSchema,
});

const bot = new Telegraf<LocalContext>(process.env.BOT_TOKEN);

// NOTE: reminder, order of middleware matters!

bot.use(async (context, next) => {
  console.log(context.message);
  return next();
});
bot.use(protect);
bot.catch((error) => console.error(error));

const mediaCommands = new Composer<LocalContext>();

mediaCommands.use(withUrl);
mediaCommands.use(withoutCommand).on(message('text'), video.middleware);
mediaCommands
  .command(spoiler.config.command, spoiler.command)
  .command(audio.config.command, audio.command)
  .command(video.config.command, video.command);

bot.use(mediaCommands);

process.on('uncaughtException', (error) => {
  // Stain' Alive
  console.error(error);
});

createServer(bot.webhookCallback(`/${process.env.SECRET_PATH}`)).listen(
  process.env.PORT,
);

export default httpServerHandler({ port: process.env.PORT });
