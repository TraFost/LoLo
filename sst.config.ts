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

    const bucket = new sst.aws.Bucket('storage', {
      public: true,
    });

    const apiFn = new sst.aws.Function('ApiFn', {
      handler: 'server/src/lambda/index.handler',
      runtime: 'nodejs22.x',
      timeout: '60 seconds',
      link: [bucket],
      url: {
        cors: false,
      },
      memory: '512 MB',
      permissions: [
        {
          actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
          resources: [
            'arn:aws:bedrock:ap-southeast-1:097677866265:inference-profile/apac.amazon.nova-micro-v1:0',
            'arn:aws:bedrock:ap-southeast-1::foundation-model/amazon.nova-micro-v1:0',
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
        ...parsed,
        NODE_ENV: 'production',
        AWS_SDK_LOAD_CONFIG: '0',
      },
      tags: {
        'rift-rewind-hackathon': '2025',
        'app-name': 'LoLo',
      },
    });

    const client = new sst.aws.StaticSite('lolo-client', {
      path: 'client',
      build: {
        command: 'pnpm run build',
        output: 'dist',
      },
      environment: {
        VITE_SERVER_URL: apiFn.url,
        VITE_SHARE_BASE_URL: apiFn.url,
      },
    });

    apiFn.addEnvironment({
      SHARE_PUBLIC_URL: apiFn.url,
    });

    return { ApiUrl: apiFn.url, client: client.url };
  },
});
