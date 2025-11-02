import { Composer, Input, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { envSchema } from './env.schema.js';
// import { host } from './utils/domain.js';
import { loadEnv } from './utils/env.js';
import { randomEmoji } from './utils/telegram/randomEmoji.js';
import type { LocalContext } from './utils/telegram/types.js';
import { execYtDlp } from './utils/yt-dlp.js';

loadEnv({
  path: '.env',
  schema: envSchema,
});

const bot = new Telegraf<LocalContext>(process.env.BOT_TOKEN);

await bot.telegram.setMyCommands([
  {
    command: 'audio',
    description: 'Load only audio',
  },
  {
    command: 'spoiler',
    description: 'Video may contain spoilers',
  },
  {
    command: 'video',
    description: 'Load video',
  },
]);

// NOTE: reminder, order of middleware matters!

bot.use(async (context, next) => {
  if (!context.message?.from.id) {
    return;
  }

  // Simple protection measure for now
  if (
    !process.env.WHITELIST.includes(context.message?.from.id) ||
    context.message?.from.is_bot
  ) {
    return;
  }

  if (!context.message || !context.text) {
    return;
  }

  if (Date.now() - context.message.date * 1000 > 1000) {
    // Don't handle messages older than 1 sec
    return;
  }

  // Notify user that we have access to messages
  await context.react(randomEmoji());

  return next();
});

// TODO: implement proper logging

bot.use(async (context, next) => {
  console.log(context.message);
  return next();
});

bot.catch(async (error) => {
  console.error(error);
});

const urlHandlers = new Composer<LocalContext>();

urlHandlers.use(async (context, next) => {
  // Here one will still be able to send any urls.
  //
  // In order to fix this we need to either completely port yt-dlp with all
  // it's helpers (alongside url parsing), or just silently fail

  const urls = context.entities('url');
  if (!urls?.length) {
    return;
  }

  // The use case for bot does not really include batch processing urls, and,
  // frankly, does not make much sense...
  context.url = urls?.[0];

  if (!context.url) {
    return;
  }

  const currentStatus = await context.sendMessage('🟢 Loading...');

  try {
    await next();
  } catch (error) {
    console.error(error);

    await context.sendMessage(
      `🤬 Failed while loading <a href="${context.url.fragment}">this</a> from @${context.from?.username}`,
      {
        parse_mode: 'HTML',
      },
    );
  }

  await context.deleteMessage(currentStatus.message_id);
});

// TODO: all the following handlers have common things, we can simplify and
// extract common logic out of it

urlHandlers.on(message('text'), async (context) => {
  if (context.entities('bot_command').length) {
    return;
  }

  await context.sendVideo(
    Input.fromReadableStream(execYtDlp(context.url.fragment)),
    {
      caption: `🔗 <a href="${context.url.fragment}">Content</a> from @${context.from?.username}`,
      parse_mode: 'HTML',
    },
  );

  await context.deleteMessage(context.message.message_id);
});

urlHandlers.command('spoiler', async (context) => {
  await context.sendVideo(
    Input.fromReadableStream(execYtDlp(context.url.fragment)),
    {
      caption: `🔗 <a href="${context.url.fragment}">Content</a> from @${context.from?.username}`,
      has_spoiler: true,
      parse_mode: 'HTML',
    },
  );

  await context.deleteMessage(context.message.message_id);
});

urlHandlers.command('audio', async (context) => {
  await context.sendAudio(
    Input.fromReadableStream(
      execYtDlp(context.url.fragment, { args: ['-t', 'mp3'] }),
    ),
    {
      caption: `🔗 <a href="${context.url.fragment}">Source</a>`,
      parse_mode: 'HTML',
    },
  );

  await context.deleteMessage(context.message.message_id);
});

urlHandlers.command('video', async (context) => {
  await context.sendVideo(
    Input.fromReadableStream(execYtDlp(context.url.fragment)),
    {
      caption: `🔗 <a href="${context.url.fragment}">Content</a> from @${context.from?.username}`,
      parse_mode: 'HTML',
    },
  );

  await context.deleteMessage(context.message.message_id);
});

// urlHandlers.on('inline_query', async (context) => {
//   await context.answerInlineQuery(
//     [
//       {
//         caption: `🔗 <a href="${context.url.fragment}">Content</a>`,
//         parse_mode: 'HTML',
//         type: 'video',
//         video_url: // and here is where I don't know how to do this efficiently without involving cache...
//       },
//     ],
//     Input.fromReadableStream(execYtDlp(context.url.fragment)),
//   );
// });

bot.use(urlHandlers);

process.on('uncaughtException', (error) => {
  // Stain' Alive
  console.error(error);
});

const config = {
  // webhook: {
  //   domain: await host(),
  //   port: process.env.PORT,
  // },
};

bot.launch(config);
