import type { BotCommand } from 'telegraf/types';
import { makeCommand } from './video.js';

export const config: BotCommand = {
  command: 'spoiler',
  description: 'Load video and cover with spoiler',
};

export const command = makeCommand({ has_spoiler: true });
