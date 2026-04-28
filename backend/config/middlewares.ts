import type { Core } from '@strapi/strapi';

const isDev = process.env.NODE_ENV !== 'production';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:', 'ws:', 'wss:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io'],
          ...(isDev
            ? {
                'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                'upgrade-insecure-requests': null,
              }
            : {}),
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:1337',
        'http://127.0.0.1:1337',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
