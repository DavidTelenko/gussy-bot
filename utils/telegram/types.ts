import type { Context } from 'telegraf';
import type { MessageEntity } from 'telegraf/types';

export interface LocalContext extends Context {
  url: MessageEntity.CommonMessageEntity & {
    type: 'url';
    fragment: string;
  };
}
