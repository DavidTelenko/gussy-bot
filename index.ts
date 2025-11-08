import { httpServerHandler } from 'cloudflare:node';
import { createServer } from 'node:http';
import { Composer, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { audio, spoiler, video } from '@/commands/index.js';
import { protect } from '@/middleware/protect.js';
import { withoutCommand } from '@/middleware/withoutCommand.js';
import { withUrl } from '@/middleware/withUrl.js';
import type { LocalContext } from '@/utils/telegram/types.js';

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

const port = Number.parseInt(process.env.PORT, 10);

createServer(bot.webhookCallback(`/${process.env.SECRET_PATH}`)).listen(port);

export default httpServerHandler({ port });

// bot.launch();
