import 'dotenv/config';

export const ENV = {
  port: Number(process.env.PORT) || 3000,
  riot_api: process.env.RIOT_API_KEY!,
};
