import type { Middleware } from 'telegraf';
import { randomEmoji } from '@/utils/telegram/randomEmoji.js';
import type { LocalContext } from '@/utils/telegram/types.js';

export const protect: Middleware<LocalContext> = async (context, next) => {
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
};
