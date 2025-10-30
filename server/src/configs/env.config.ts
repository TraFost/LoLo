import 'dotenv/config';

export const ENV = {
  port: Number(process.env.PORT) || 3000,
  riot_api: process.env.RIOT_API_KEY!,

  aws: {
    region: process.env.AWS_REGION || '',
    modelId: process.env.AWS_MODEL_ID || '',
  },
} as const;
