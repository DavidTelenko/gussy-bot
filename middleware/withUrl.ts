import type { Middleware } from 'telegraf';
import type { LocalContext } from '@/utils/telegram/types.js';

export const withUrl: Middleware<LocalContext> = async (context, next) => {
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
        link_preview_options: {
          is_disabled: true,
        },
        parse_mode: 'HTML',
      },
    );
  }

  await context.deleteMessage(currentStatus.message_id);
};
