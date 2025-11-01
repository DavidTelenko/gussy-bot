import TelegramBot from 'node-telegram-bot-api';
import { envSchema } from './env.schema.js';
import { loadEnv } from './utils/env.js';

loadEnv({ path: '.env', schema: envSchema });

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, msg.text ?? 'ACK');
});
