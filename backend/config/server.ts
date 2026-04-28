import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => {
  const port = env.int('PORT', 1337);
  const defaultPublicUrl = `http://localhost:${port}`;

  return {
    host: env('HOST', '0.0.0.0'),
    port,
    url: env('PUBLIC_URL', defaultPublicUrl),
    app: {
      keys: env.array('APP_KEYS'),
    },
  };
};

export default config;
