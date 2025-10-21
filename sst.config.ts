/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app() {
    return { name: 'lolo', home: 'aws', removal: 'remove' };
  },
  async run() {
    const apiFn = new sst.aws.Function('ApiFn', {
      handler: 'server/src/lambda/index.handler',
      runtime: 'nodejs22.x',
      url: true,
      nodejs: { sourcemap: true, install: ['pnpm -w i', 'pnpm -w -F shared build'] },
      // environment: { NODE_ENV: 'production' },
      tags: {
        'rift-rewind-hackathon': '2025',
        'app-name': 'LoLo',
      },
      providers: {
        aws: { region: 'ap-southeast-1', profile: 'admin-ippoda' },
      },
    });

    // const web = new sst.aws.StaticSite('Web', {
    //   path: 'client',
    //   build: {
    //     command: 'pnpm -w i && pnpm --filter shared build && pnpm --filter client build',
    //     output: 'dist',
    //   },
    //   environment: { VITE_API_URL: apiFn.url },
    //   tags: {
    //     'rift-rewind-hackathon': '2025',
    //     'app-name': 'LoLo',
    //   },
    // });

    return { ApiUrl: apiFn.url };
  },
});
