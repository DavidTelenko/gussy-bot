import { Composer, Input } from 'telegraf';
import { message } from 'telegraf/filters';
import type { BotCommand, Convenience } from 'telegraf/types';
import { sourceAndUserCaption } from '@/utils/telegram/strings.js';
import type { LocalContext } from '@/utils/telegram/types.js';
import { execYtDlp } from '@/utils/yt-dlp.js';

export const config: BotCommand = {
  command: 'video',
  description: 'Load video',
};

const text = message('text');

export const makeMiddleware = (extra?: Convenience.ExtraVideo) =>
  Composer.on<LocalContext, typeof text>(text, async (context) => {
    await context.sendVideo(
      Input.fromReadableStream(execYtDlp(context.url.fragment)),
      {
        caption: sourceAndUserCaption(context),
        parse_mode: 'HTML',
        supports_streaming: true,
        ...extra,
      },
    );

    await context.deleteMessage(context.message.message_id);
  });

export const makeCommand = (extra?: Convenience.ExtraVideo) =>
  Composer.command<LocalContext>(config.command, makeMiddleware(extra));

export const middleware = makeMiddleware();
export const command = makeCommand();
