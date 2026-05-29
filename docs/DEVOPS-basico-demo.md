# DevOps básico para demo

## Levantar servicios

```bash
docker compose up -d postgres strapi frontend
```

Servicios esperados:

- Frontend: http://localhost:3000
- Strapi: http://localhost:1337
- PostgreSQL: localhost:5433

## Verificación rápida

```bash
node scripts/verify-demo.mjs
```

El verificador revisa:

- Frontend disponible.
- Login de `coordinator@planify.edu`, `teacher@planify.edu` y `student@planify.edu`.
- Endpoints principales de docentes, cursos, aulas, disponibilidad, configuración, reglas y sesiones.
- Restricción de estudiante sobre `/api/class-sessions`.

## Pruebas de frontend

```bash
cd frontend
npm run test:e2e
```

La suite Playwright valida:

- Login real contra Strapi.
- Opciones del sidebar por rol.
- Calendario semanal.
- Exportación CSV.

## Pruebas de backend

```bash
cd backend
npm test
npm run build
```
