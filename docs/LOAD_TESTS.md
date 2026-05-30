# Pruebas de carga y estrés

Planify incluye una prueba sencilla para validar que el frontend y los endpoints principales de Strapi respondan antes de la demo.

## Dashboard visual con Docker

Levanta el servicio visual junto con los demás contenedores:

```bash
docker compose up load-test-dashboard
```

Luego abre:

```text
http://localhost:4010
```

El dashboard permite elegir modo, duración y concurrencia. Al finalizar muestra total de requests, errores, throughput, p50, p95, máximo y códigos HTTP por endpoint.

## Línea de comandos

Desde `frontend/`:

```bash
npm run test:load
npm run test:stress
```

También se puede ejecutar desde la raíz:

```bash
PLANIFY_LOAD_MODE=smoke node scripts/load-test.mjs
PLANIFY_LOAD_MODE=load PLANIFY_LOAD_DURATION=20 PLANIFY_LOAD_CONCURRENCY=8 node scripts/load-test.mjs
PLANIFY_LOAD_MODE=stress PLANIFY_LOAD_DURATION=30 PLANIFY_LOAD_CONCURRENCY=24 node scripts/load-test.mjs
```

Variables útiles:

- `PLANIFY_API_URL`: URL de Strapi. Por defecto `http://localhost:1337`.
- `PLANIFY_FRONTEND_URL`: URL del frontend. Por defecto `http://localhost:3000`.
- `PLANIFY_LOAD_EMAIL`: usuario de prueba. Por defecto `coordinator@planify.edu`.
- `PLANIFY_LOAD_PASSWORD`: contraseña de prueba. Por defecto `Planify123*`.
- `PLANIFY_LOAD_MAX_ERROR_RATE`: tasa máxima de error permitida. Por defecto `0.02`.
