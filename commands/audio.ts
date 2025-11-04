import { Composer, Input } from 'telegraf';
import type { BotCommand } from 'telegraf/types';
import { sourceCaption } from '@/utils/telegram/strings.js';
import type { LocalContext } from '@/utils/telegram/types.js';
import { execYtDlp } from '@/utils/yt-dlp.js';

export const config: BotCommand = {
  command: 'audio',
  description: 'Load only audio',
};

export const command = Composer.command<LocalContext>(
  config.command,
  async (context) => {
    await context.sendAudio(
      Input.fromReadableStream(
        execYtDlp(context.url.fragment, { args: ['-t', 'mp3'] }),
      ),
      {
        caption: sourceCaption(context),
        parse_mode: 'HTML',
      },
    );

    await context.deleteMessage(context.message.message_id);
  },
);
