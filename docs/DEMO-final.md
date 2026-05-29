# Demo final Planify

## Servicios

- Frontend: http://localhost:3000
- Strapi: http://localhost:1337
- PostgreSQL: localhost:5433

## Usuario demo

- Coordinador: coordinator@planify.edu
- Clave: Planify123*

## Recorrido sugerido

1. Iniciar sesion en el frontend con el usuario coordinador.
2. Ir a Planificacion > Parametros del semestre y confirmar la franja 07:00-22:00, almuerzo 12:00-13:00 y sabado 07:00-13:00.
3. Ir a Planificacion > Reglas de horario y mostrar reglas obligatorias/blandas activas.
4. Ir a Sesiones de clase > Calendario semanal.
5. Filtrar por docente, aula o grupo.
6. Crear una sesion y mostrar validaciones:
   - conflicto de docente/aula/grupo,
   - disponibilidad docente,
   - capacidad de aula,
   - dias no consecutivos,
   - caracteristicas requeridas del aula.
7. Bloquear una sesion desde el listado.
8. Publicar sesiones visibles o publicar el horario completo.

Los datos demo se crean desde `backend/src/bootstrap/seed-demo-scheduling-data.ts` usando Document Service de Strapi. Se puede deshabilitar con `SEED_DEMO_SCHEDULING_DATA=false`.
