import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { DEFAULT_MAX_TOKENS, DEFAULT_TEMP, DEFAULT_TOP_P } from './prompt';

import { bedrock } from '../../configs/bedrock.config';
import { ENV } from '../../configs/env.config';

type NovaJSON = {
  output?: { message?: { content?: Array<{ text?: string }> } };
  stopReason?: string;
  usage?: any;
};

export async function invokeNovaMicroJSON(
  systemText: string,
  userJsonString: string,
  { modelId = ENV.aws.modelId } = {},
) {
  if (!modelId) throw new Error('Model ID is empty');

  const body = {
    system: [{ text: systemText }],
    messages: [{ role: 'user', content: [{ text: userJsonString }] }],
    inferenceConfig: {
      maxTokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMP,
      topP: DEFAULT_TOP_P,
    },
  };

  const cmd = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body),
  });

  let raw: NovaJSON;
  try {
    const res = await bedrock.send(cmd);
    const text = new TextDecoder().decode(res.body);
    raw = JSON.parse(text) as NovaJSON;
  } catch (e: any) {
    throw new Error(`Nova invoke failed: ${e?.message ?? 'unknown error'}`);
  }

  const message = raw?.output?.message;
  const outText = message?.content?.find?.((c) => typeof c?.text === 'string')?.text ?? '';

  let parsed: any = null;
  try {
    parsed = outText ? JSON.parse(outText) : null;
  } catch {}

  const stop = raw?.stopReason ?? 'unknown';
  const usage = raw?.usage ?? null;

  return { raw, text: outText, json: parsed, stop, usage };
}
