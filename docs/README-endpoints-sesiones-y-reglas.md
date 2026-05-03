# API: sesiones por recurso y reglas procesadas

> **Arranque y prerrequisitos del backend** (`.env`, Docker, login, permisos): [BACKEND-prerrequisitos-y-pruebas.md](BACKEND-prerrequisitos-y-pruebas.md)

Este documento describe lo implementado en el backend Strapi 5 para consultas custom de **class sessions** y el endpoint de **reglas procesadas** asociadas a un **schedule config**.

## Qué se implementó

### `api::class-session`

- **CRUD estándar** vía router core (`/api/class-sessions`, etc.), alineado con el resto de APIs del proyecto.
- **Tres rutas custom (solo lectura)** que filtran sesiones por recurso usando el **Document Service** (`documentId` en la URL):
  - Por **docente**: el docente no está en la sesión; se filtra por `academicGroup.teacher`.
  - Por **aula**: filtro directo por `classroom`.
  - Por **grupo académico**: filtro por `academicGroup`.

Las respuestas incluyen **populate** por defecto: `academicGroup` (con `course`, `teacher`, `scheduleConfig`) y `classroom`.

Archivos relevantes:

- `backend/src/api/class-session/controllers/class-session.ts`
- `backend/src/api/class-session/services/class-session.ts`
- `backend/src/api/class-session/routes/class-session.ts` (core)
- `backend/src/api/class-session/routes/01-custom-class-session.ts` (custom)

### `api::schedule-config`

- **CRUD estándar** en `/api/schedule-configs`.
- **Ruta custom** que devuelve reglas **hard** y **soft** del config en un payload unificado (normalización de `parameters` vacíos, `kind`, etc.).

Archivos relevantes:

- `backend/src/api/schedule-config/controllers/schedule-config.ts`
- `backend/src/api/schedule-config/services/schedule-config.ts`
- `backend/src/api/schedule-config/routes/schedule-config.ts` (core)
- `backend/src/api/schedule-config/routes/01-custom-schedule-config.ts` (custom)

---

## Base URL

Por defecto Strapi expone la API REST bajo:

```text
http://localhost:1337/api
```

Si usás otra URL (por ejemplo `VITE_API_URL` en el frontend), reemplazá el host y el puerto en Postman.

---

## Admin (`/admin`) y login (`/api/auth/local`)

Si el panel **no carga** (pantalla en blanco, errores en consola del navegador) o **`POST /api/auth/local`** falla de forma extraña:

1. **Reiniciá Strapi** tras cambios de configuración, por ejemplo:
   ```powershell
   docker compose up -d --build strapi
   ```
2. **Variables de entorno** (Docker Compose ya fuerza la conexión a Postgres del stack y la URL pública):
   - En `docker-compose.yml`, el servicio `strapi` define `DATABASE_*` alineado con [`.env.postgres`](../.env.postgres) y `PUBLIC_URL` / `STRAPI_ADMIN_BACKEND_URL` apuntando a `http://localhost:${STRAPI_PORT}` para que el **admin (Vite)** llame al API desde tu navegador en el host correcto.
   - En local, copiá [backend/.env.example](../backend/.env.example) a `backend/.env` y ajustá secretos; incluye `PUBLIC_URL`, `STRAPI_ADMIN_BACKEND_URL` y `ENCRYPTION_KEY`.
3. **CORS**: `backend/config/middlewares.ts` permite orígenes `localhost` / `127.0.0.1` en puertos **1337** y **3000** para pruebas desde navegador o Postman web.
4. **CSP (admin en blanco en desarrollo)**: en el mismo archivo, en modo no producción se relajan directivas necesarias para el bundle del admin.

**Login de prueba** (usuarios creados por `backend/src/index.ts` en el bootstrap, si no existían):

| Email (por defecto) | Contraseña (por defecto) | Rol |
|---------------------|--------------------------|-----|
| `coordinator@planify.edu` | `Planify123*` | Academic Coordinator |
| `teacher@planify.edu` | `Planify123*` | Teacher |
| `student@planify.edu` | `Planify123*` | Student |

Podés sobreescribirlos con `SEED_*` en `backend/.env`. Luego:

```http
POST http://localhost:1337/api/auth/local
Content-Type: application/json

{ "identifier": "teacher@planify.edu", "password": "Planify123*" }
```

---

## Datos de prueba en base de datos (seed)

Se revisó la base PostgreSQL del stack Docker (`planify-postgres`, BD `strapi`, usuario `strapi`): **no había filas** en `teachers`, `courses`, `class_sessions`, etc.

Se añadió un script idempotente que inserta un **juego mínimo** coherente con las relaciones de Strapi (tablas base + tablas `*_lnk`):

| Archivo | Descripción |
|---------|-------------|
| [`scripts/seed-planify-api-test-data.sql`](../scripts/seed-planify-api-test-data.sql) | Inserta docente, curso, aula, schedule config, grupo académico, **2 sesiones** en el mismo aula y grupo, y **1 hard rule + 1 soft rule** ligadas al config. |

### Cómo cargar o refrescar el seed

Con Docker Compose levantado y el contenedor `planify-postgres` en ejecución, desde la **raíz del monorepo** (PowerShell):

```powershell
Get-Content -Raw .\scripts\seed-planify-api-test-data.sql | docker exec -i planify-postgres psql -U strapi -d strapi
```

El script borra antes las filas identificadas por códigos `PLAN-SEED-*` y los `document_id` del bloque seed, y vuelve a insertar (podés ejecutarlo varias veces).

### `documentId` fijos para Postman (tras ejecutar el seed)

Estos valores son los que quedan en la columna `document_id` de PostgreSQL y coinciden con lo que Strapi expone como **`documentId`** en la API REST.

| Entidad | `documentId` | Código interno (referencia) |
|---------|----------------|-----------------------------|
| Teacher | `f1000000-0001-4000-8000-000000000001` | `PLAN-SEED-TCH-001` |
| Course | `f1000000-0001-4000-8000-000000000002` | `PLAN-SEED-COU-001` |
| Classroom | `f1000000-0001-4000-8000-000000000003` | `PLAN-SEED-CLA-001` |
| Schedule config | `f1000000-0001-4000-8000-000000000004` | nombre: *Config semestre seed* |
| Academic group | `f1000000-0001-4000-8000-000000000005` | `PLAN-SEED-GRP-001` |
| Class session 1 | `f1000000-0001-4000-8000-000000000006` | lunes 08:00–09:30 |
| Class session 2 | `f1000000-0001-4000-8000-000000000007` | miércoles 10:00–11:30 |
| Hard rule | `f1000000-0001-4000-8000-000000000008` | `PLAN-SEED-HARD-001` |
| Soft rule | `f1000000-0001-4000-8000-000000000009` | `PLAN-SEED-SOFT-001` |

**Qué deberías ver al probar:**

- **By teacher** (`000001`): **2** sesiones (ambas del grupo que tiene a Ana García como docente).
- **By classroom** (`000003`): **2** sesiones (misma aula 101).
- **By academic group** (`000005`): **2** sesiones del grupo `PLAN-SEED-GRP-001`.
- **Processed rules** (`000004`): JSON con `scheduleConfig`, `rules` (2 entradas: una hard y una soft), más `hardRules` y `softRules`.

### URLs listas para copiar en Postman (`localhost:1337`)

Sustituí solo el host/puerto si tu Strapi no corre en `1337`.

```http
GET http://localhost:1337/api/class-sessions/by-teacher/f1000000-0001-4000-8000-000000000001
GET http://localhost:1337/api/class-sessions/by-classroom/f1000000-0001-4000-8000-000000000003
GET http://localhost:1337/api/class-sessions/by-academic-group/f1000000-0001-4000-8000-000000000005
GET http://localhost:1337/api/schedule-configs/f1000000-0001-4000-8000-000000000004/processed-rules
```

---

## Endpoints

Todas las rutas custom son **GET** y van **después** del prefijo `/api`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/class-sessions/by-teacher/:teacherDocumentId` | Sesiones cuyo grupo académico tiene ese docente (`documentId` del teacher). |
| GET | `/class-sessions/by-classroom/:classroomDocumentId` | Sesiones en esa aula (`documentId` del classroom). |
| GET | `/class-sessions/by-academic-group/:academicGroupDocumentId` | Sesiones de ese grupo (`documentId` del academic group). |
| GET | `/schedule-configs/:scheduleConfigDocumentId/processed-rules` | Config mínimo + listas `rules`, `hardRules`, `softRules` normalizadas. |

### Ejemplos de URL completas (plantilla)

Si ya ejecutaste el **seed** de arriba, usá directamente las URLs con UUID fijos en la sección **URLs listas para copiar en Postman**. Plantilla genérica:

```text
GET http://localhost:1337/api/class-sessions/by-teacher/<DOCUMENT_ID_DOCENTE>
GET http://localhost:1337/api/class-sessions/by-classroom/<DOCUMENT_ID_AULA>
GET http://localhost:1337/api/class-sessions/by-academic-group/<DOCUMENT_ID_GRUPO>
GET http://localhost:1337/api/schedule-configs/<DOCUMENT_ID_SCHEDULE_CONFIG>/processed-rules
```

### Query opcional (Strapi 5)

En los tres endpoints de sesiones, el controlador reenvía a `findMany`:

- `sort` — mismo formato que acepta la API de documentos de Strapi.
- `pagination` — por ejemplo paginación por cursor o por página según configuración de Strapi.

Ejemplo (ajustá según la sintaxis que uses en el resto del proyecto):

```text
GET .../api/class-sessions/by-teacher/abc123?pagination[page]=1&pagination[pageSize]=25
```

Si algo no aplica a tu versión exacta de query string, probá primero sin query y luego añadí paginación desde la documentación oficial de Strapi 5 para `findMany`.

### Respuestas esperadas (forma general)

**Sesiones** (custom):

```json
{
  "data": [ /* array de documentos class-session */ ]
}
```

**Reglas procesadas**:

```json
{
  "data": {
    "scheduleConfig": {
      "documentId": "...",
      "name": "...",
      "academicPeriod": "...",
      "isActive": true
    },
    "rules": [ /* hard + soft unificados */ ],
    "hardRules": [ /* solo hard */ ],
    "softRules": [ /* solo soft */ ]
  }
}
```

Si el `schedule-config` no existe: **404** con mensaje acorde. Si existe pero no tiene reglas: **200** con arreglos vacíos.

---

## Permisos (obligatorio para Postman sin admin JWT)

Los endpoints REST de contenido suelen estar gobernados por el plugin **Users & Permissions**.

1. Abrí el panel admin: `http://localhost:1337/admin`
2. **Settings → Users & Permissions plugin → Roles**
3. En el rol que uses (por ejemplo **Public** o **Authenticated**), en **Permissions**, buscá:
   - **Class-session**: habilitá las acciones que correspondan, en particular las custom:
     - `findByTeacher`
     - `findByClassroom`
     - `findByAcademicGroup`
   - **Schedule-config**: habilitá:
     - `getProcessedRules`
   - Si también querés el CRUD estándar, habilitá `find`, `findOne`, etc.

Sin estos permisos, Postman puede responder **403 Forbidden** aunque la ruta exista.

---

## Cómo obtener los `documentId` en Strapi 5

1. **Content Manager**: abrí la entrada (Teacher, Classroom, Academic Group, Schedule Config).
2. En la UI reciente de Strapi 5 suele mostrarse el **Document ID** en el detalle del documento, o podés obtenerlo vía API estándar, por ejemplo:

```http
GET http://localhost:1337/api/teachers?pagination[pageSize]=5
```

Revisá el JSON: cada ítem trae `documentId` (no confundir solo con `id` numérico si aparece en capas legacy).

---

## Probar desde Postman

### 1. Variables de entorno en Postman

Creá un environment con:

| Variable | Ejemplo |
|----------|---------|
| `baseUrl` | `http://localhost:1337` |
| `apiPrefix` | `/api` |
| `jwt` | (opcional) token JWT del usuario si usás rol Authenticated |

URL base combinada para requests:

```text
{{baseUrl}}{{apiPrefix}}
```

### 2. Crear una request por endpoint

Para cada una:

1. **Method**: `GET`
2. **URL**: pegá una de las URLs de la tabla (reemplazando el segmento final por el `documentId` real).
3. **Authorization** (si aplica):
   - Tipo **Bearer Token** y pegá `{{jwt}}`, o
   - **No Auth** si habilitaste **Public** en Users & Permissions (solo recomendable en desarrollo).

### 3. Headers

Normalmente no hace falta nada extra. Si tu instancia exige API tokens u otra cabecera, añadila según tu despliegue.

### 4. Verificar respuesta

- **200** + cuerpo JSON con `data` como arriba → OK.
- **400** → parámetro de ruta vacío o inválido (por ejemplo `documentId` faltante).
- **404** → en `processed-rules`, schedule config inexistente.
- **403** → permisos no habilitados para el rol/token usado.

### 5. Colección sugerida (nombres de requests)

1. `Class Sessions - By Teacher`
2. `Class Sessions - By Classroom`
3. `Class Sessions - By Academic Group`
4. `Schedule Config - Processed Rules`

Podés duplicar la primera request y solo cambiar método/path/params para ir más rápido.

---

## Reinicio del servidor

Después de desplegar o montar código nuevo en Docker, puede ser necesario **reiniciar el contenedor o proceso de Strapi** para que cargue rutas y controladores nuevos.

---

## Resumen rápido

| Objetivo | Endpoint GET |
|----------|----------------|
| Sesiones de un docente | `/api/class-sessions/by-teacher/:teacherDocumentId` |
| Sesiones de un aula | `/api/class-sessions/by-classroom/:classroomDocumentId` |
| Sesiones de un grupo | `/api/class-sessions/by-academic-group/:academicGroupDocumentId` |
| Reglas unificadas de un config | `/api/schedule-configs/:scheduleConfigDocumentId/processed-rules` |
