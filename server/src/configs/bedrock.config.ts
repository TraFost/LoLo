import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

import { ENV } from './env.config';

export const bedrock = new BedrockRuntimeClient({ region: ENV.aws.region });
