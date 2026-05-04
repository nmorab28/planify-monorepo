import type { Core } from '@strapi/strapi';

/**
 * Hook reservado para datos demo vía Document Service.
 * Los datos fijos para probar endpoints custom están en `scripts/seed-planify-api-test-data.sql`.
 */
export async function seedDemoSchedulingData(strapi: Core.Strapi): Promise<void> {
  strapi.log.info(
    '[seed-demo-scheduling-data] Sin inserciones automáticas. Usá scripts/seed-planify-api-test-data.sql si necesitás datos en Postgres.'
  );
}
