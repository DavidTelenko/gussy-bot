import dns from 'node:dns/promises';
import os from 'node:os';
import { tunnelmole } from 'tunnelmole';

export const host = async () => {
  if (process.env.DEV) {
    return await tunnelmole({
      port: process.env.PORT,
    });
  }

  const local = await dns.lookup(os.hostname(), {
    family: 4,
  });
  return local.address;
};
