/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app() {
    return { name: 'lolo', home: 'aws', removal: 'remove' };
  },
  async run() {
    const fs = await import('fs');
    const path = await import('path');
    const dotenv = await import('dotenv');

    const envFile = path.join(process.cwd(), 'server', '.env');
    const parsed = fs.existsSync(envFile) ? dotenv.parse(fs.readFileSync(envFile, 'utf8')) : {};

    const apiFn = new sst.aws.Function('ApiFn', {
      handler: 'server/src/lambda/index.handler',
      runtime: 'nodejs22.x',
      timeout: '30 seconds',
      url: {
        cors: false,
      },
      memory: '512 MB',
      permissions: [
        {
          actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
          resources: [
            'arn:aws:bedrock:ap-southeast-1::foundation-model/apac.amazon.nova-micro-v1:0',
          ],
        },
      ],
      nodejs: {
        sourcemap: true,
        // @ts-ignore
        install: false,
        copyFiles: [
          { from: 'server/node_modules', to: 'node_modules' },
          { from: 'shared/src', to: 'shared' },
        ],
      },
      environment: {
        NODE_ENV: 'production',
        ...parsed,
      },
      tags: {
        'rift-rewind-hackathon': '2025',
        'app-name': 'LoLo',
      },
    });

    return { ApiUrl: apiFn.url };
  },
});
