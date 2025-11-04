import type { Middleware } from 'telegraf';
import type { LocalContext } from '@/utils/telegram/types.js';

export const withoutCommand: Middleware<LocalContext> = async (
  context,
  next,
) => {
  // Skip execution if any command was present
  if (context.entities('bot_command').length) {
    return;
  }
  return next();
};
