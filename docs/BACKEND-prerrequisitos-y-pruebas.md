# Backend Strapi: qué necesitás para que funcione y poder probar

Guía de checklist para **Planify** (`backend/`) con Docker Compose del monorepo y, opcionalmente, Strapi en tu máquina contra Postgres del compose.

---

## 1. Requisitos de entorno

| Requisito | Detalle |
|-----------|---------|
| **Node** | `>=20` y `<=24` (ver `backend/package.json` → `engines`) |
| **Docker Desktop** | Para `postgres` + `strapi` (+ `frontend` si lo usás) |
| **Archivo `backend/.env`** | **No está en git** (`.gitignore`). Tenés que crearlo copiando el ejemplo (paso 2). |
| **Raíz del repo** | Archivo **`.env`** con al menos `STRAPI_PORT` y `FRONTEND_PORT` (el compose del repo lo usa). |

---

## 2. Crear `backend/.env` (obligatorio)

```powershell
cd backend
copy .env.example .env
```

Editá `backend/.env` y revisá:

| Variable | Para qué sirve |
|----------|----------------|
| `APP_KEYS` | Cookies / sesión (Strapi exige varias claves separadas por coma). |
| `API_TOKEN_SALT` | API Tokens del admin. |
| `ADMIN_JWT_SECRET` | JWT del **panel admin** (`/admin`). |
| `TRANSFER_TOKEN_SALT` | Transferencias Strapi. |
| `JWT_SECRET` | JWT de **Users & Permissions** (`/api/auth/local`, usuarios de la app). |
| `ENCRYPTION_KEY` | Cifrado en admin (debe existir; el ejemplo trae un valor de desarrollo). |
| `PUBLIC_URL` / `STRAPI_ADMIN_BACKEND_URL` | URL pública del API desde el navegador; en Docker Compose también se inyectan (ver abajo). |
| `DATABASE_*` | En **Docker**, el `docker-compose.yml` **sobrescribe** la conexión a Postgres del stack; igual conviene dejarlas alineadas con `.env.example`. |
| `SEED_*` | Emails/contraseñas de usuarios demo creados en el **bootstrap** (`backend/src/index.ts`). |

**Sin `APP_KEYS` y los demás secretos**, Strapi puede no arrancar o el admin puede fallar.

---

## 3. Arranque con Docker (recomendado para pruebas)

Desde la **raíz del monorepo** (donde está `docker-compose.yml`):

```powershell
docker compose up -d postgres
docker compose up -d --build strapi
```

O todo junto:

```powershell
docker compose up -d --build
```

### Qué hace el compose por vos (servicio `strapi`)

En `docker-compose.yml`, además de cargar `backend/.env`, se fijan variables para evitar desajustes:

- **Postgres del stack**: `DATABASE_HOST=postgres`, `DATABASE_NAME=strapi`, usuario/contraseña `strapi` (coherente con [`.env.postgres`](../.env.postgres)).
- **URLs para el navegador en tu PC**: `PUBLIC_URL` y `STRAPI_ADMIN_BACKEND_URL` = `http://localhost:${STRAPI_PORT}` (el puerto del **host** mapeado al contenedor).

Postgres expone **`5433` en el host** → `5432` dentro de la red Docker. Eso sirve si más adelante corrés Strapi **fuera** de Docker y querés apuntar a ese Postgres: `DATABASE_HOST=127.0.0.1`, `DATABASE_PORT=5433`.

---

## 4. URLs que vas a usar

| Qué | URL típica |
|-----|----------------|
| **Admin Strapi** (crear primer usuario admin, gestionar contenido) | `http://localhost:1337/admin` (o el puerto de `STRAPI_PORT` en la raíz `.env`) |
| **API REST** | `http://localhost:1337/api` |
| **Login usuarios app** (Users & Permissions) | `POST http://localhost:1337/api/auth/local` |
| **Registro** (solo si lo habilitás en admin) | `POST http://localhost:1337/api/auth/local/register` |

---

## 5. Usuarios de prueba (app) y permisos

En cada arranque, `backend/src/index.ts` (bootstrap):

1. Crea o actualiza **roles custom**: `academic_coordinator`, `teacher`, `student`, con permisos sobre las APIs académicas (incluye los endpoints custom de sesiones y `getProcessedRules`).
2. Crea usuarios **si no existen** (emails/contraseñas por defecto o `SEED_*` en `.env`):

| Email por defecto | Contraseña por defecto | Rol |
|---------------------|-------------------------|-----|
| `coordinator@planify.edu` | `Planify123*` | Academic Coordinator |
| `teacher@planify.edu` | `Planify123*` | Teacher |
| `student@planify.edu` | `Planify123*` | Student |

3. **Quita del rol `Public`** los permisos de contenido académico listados en el código (para no exponer la API sin autenticación), **salvo** que actives el modo desarrollo siguiente.

### Modo desarrollo: API académica sin JWT (`ALLOW_PUBLIC_ACADEMIC_API`)

En `backend/.env`:

```env
ALLOW_PUBLIC_ACADEMIC_API=true
```

Con **`true`**, en cada arranque el bootstrap **no** ejecuta la revocación sobre `Public` y **añade** (si faltan) los permisos equivalentes a `TEACHER_ACTIONS` (incluye `findByTeacher`, `getProcessedRules`, etc.) **sin borrar** otros permisos del rol (por ejemplo los de login).

- Valores aceptados: `true`, `1`, `yes` (mayúsculas/minúsculas).
- **No uses `true` en producción.**

Con **`false`** o variable ausente, el comportamiento por defecto sigue siendo revocar esos permisos en `Public`.

**Consecuencia para tus pruebas:** sin esta variable, los GET a `/api/class-sessions/...` y `/api/schedule-configs/.../processed-rules` **no van a funcionar con “No Auth”** salvo que marques permisos en `Public` a mano en el admin. Lo habitual sin flag es:

```http
POST /api/auth/local
{ "identifier": "teacher@planify.edu", "password": "Planify123*" }
```

y luego **Bearer Token** con el `jwt` devuelto.

---

## 6. Datos de contenido (docentes, sesiones, reglas)

El bootstrap **no** inserta cursos/sesiones demo en BD (solo log en `seed-demo-scheduling-data`). Para tener filas y `documentId` fijos:

- Ejecutá el SQL: [`scripts/seed-planify-api-test-data.sql`](../scripts/seed-planify-api-test-data.sql)  
- Instrucciones y UUID listos para Postman: [`docs/README-endpoints-sesiones-y-reglas.md`](README-endpoints-sesiones-y-reglas.md).

---

## 7. CORS / admin en blanco

`backend/config/middlewares.ts`:

- CORS explícito para `localhost` / `127.0.0.1` en **1337** y **3000**.
- CSP más permisiva en **no producción** para que el bundle del admin cargue sin bloqueos habituales.

Si cambiás middlewares, reiniciá Strapi.

---

## 8. Checklist rápido antes de probar en Postman

- [ ] Existe `backend/.env` (copiado de `.env.example`) con secretos definidos.
- [ ] Existe `.env` en la **raíz** con `STRAPI_PORT` (y `FRONTEND_PORT` si usás frontend).
- [ ] `docker compose ps` → `planify-strapi` **Up**, `planify-postgres` **healthy**.
- [ ] Abrís `http://localhost:<STRAPI_PORT>/admin` y podés entrar (primer arranque: crear usuario **administrador** del panel).
- [ ] `POST /api/auth/local` con `teacher@planify.edu` / `Planify123*` devuelve `jwt`.
- [ ] GET a endpoints custom con header `Authorization: Bearer <jwt>`.
- [ ] (Opcional) Ejecutaste el seed SQL si querés datos de sesiones/reglas.

---

## 9. Problemas frecuentes

| Síntoma | Qué mirar |
|---------|-----------|
| `ERR_CONNECTION_RESET` / no carga | Strapi caído o puerto equivocado; `docker compose logs strapi --tail 100`. |
| **403** en API de contenido | Sin JWT o rol sin permiso; o seguís usando `Public` sin permisos (diseño actual del bootstrap). |
| **401** en `/api/auth/local` | Credencial incorrecta o usuario no confirmado (los seed van `confirmed: true`). |
| Admin en blanco | Consola del navegador (F12); reiniciar contenedor tras cambiar `PUBLIC_URL` / middlewares. |
| Error de conexión a DB | Con Docker, el compose fuerza `DATABASE_*`; sin Docker, host `127.0.0.1` y puerto **5433** si usás el Postgres del compose. |

---

## 10. Documentación relacionada

- Endpoints custom + URLs con datos seed: [README-endpoints-sesiones-y-reglas.md](README-endpoints-sesiones-y-reglas.md)
