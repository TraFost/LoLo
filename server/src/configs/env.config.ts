import 'dotenv/config';

export const ENV = {
  port: Number(process.env.PORT) || 3000,
  riot_api: process.env.RIOT_API_KEY!,

  aws: {
    region: process.env.BEDROCK_REGION || '',
    modelId: process.env.AWS_MODEL_ID || '',
  },
  client: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
} as const;
