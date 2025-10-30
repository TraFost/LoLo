import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { bedrock } from '../../configs/bedrock.config';

import { ENV } from '../../configs/env.config';

export async function invokeNovaMicroJSON(
  systemText: string,
  userText: string,
  { modelId = ENV.aws.modelId } = {},
) {
  if (!modelId) {
    throw new Error('Model ID is empty, you need to provide it!');
  }

  const body = {
    system: [{ text: systemText }],
    messages: [
      {
        role: 'user',
        content: [{ text: userText }],
      },
    ],
    inferenceConfig: {
      maxTokens: 400,
      temperature: 0.2,
      topP: 0.9,
    },
  };

  const cmd = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: Buffer.from(JSON.stringify(body)),
  });

  const res = await bedrock.send(cmd);
  const text = Buffer.from(res.body).toString('utf8');
  const json = JSON.parse(text);

  const message = json?.output?.message;
  const outText = message?.content?.find?.((c: any) => c.text)?.text ?? '';
  const stop = json?.stopReason ?? 'unknown';
  const usage = json?.usage ?? null;

  return { raw: json, text: outText, stop, usage };
}
