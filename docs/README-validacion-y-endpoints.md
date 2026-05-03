# API Planify — Endpoints de sesiones, reglas y validación

Guía completa para levantar el backend con Docker y probar todos los endpoints custom implementados.

---

## 1. Levantar el backend con Docker

### Requisitos previos

- Docker Desktop corriendo
- Archivo `.env` en la raíz del monorepo con al menos:

```env
STRAPI_PORT=1337
FRONTEND_PORT=3000
```

- Archivo `.env.postgres` en la raíz con:

```env
POSTGRES_USER=strapi
POSTGRES_PASSWORD=strapi
POSTGRES_DB=strapi
```

- Archivo `backend/.env` con las variables de Strapi (APP_KEYS, JWT_SECRET, etc.):

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=clave1,clave2,clave3,clave4
API_TOKEN_SALT=alguna_sal
ADMIN_JWT_SECRET=secreto_admin
TRANSFER_TOKEN_SALT=otra_sal
JWT_SECRET=secreto_jwt
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
PUBLIC_URL=http://localhost:1337
STRAPI_ADMIN_BACKEND_URL=http://localhost:1337
# Poner en true solo en desarrollo para probar sin JWT
ALLOW_PUBLIC_ACADEMIC_API=false
```

### Comandos

```bash
# Levantar todo (postgres + strapi + frontend)
docker compose up -d

# Ver logs de strapi en tiempo real
docker compose logs -f strapi

# Solo levantar postgres y strapi (sin frontend)
docker compose up -d postgres strapi

# Detener todo
docker compose down
```

> El primer arranque tarda 2–4 minutos porque instala dependencias dentro del contenedor y compila Strapi.

### Verificar que está listo

Cuando en los logs aparezca:

```
[2026-xx-xx] info: ✔ Your application is ready on http://0.0.0.0:1337
```

El backend está disponible en `http://localhost:1337`.

---

## 2. Autenticación

Todos los endpoints custom requieren un **Bearer Token JWT**, excepto si `ALLOW_PUBLIC_ACADEMIC_API=true` en el `.env` (solo desarrollo).

### Obtener JWT

**POST** `http://localhost:1337/api/auth/local`

```json
{
  "identifier": "coordinator@planify.edu",
  "password": "Planify123*"
}
```

Usuarios disponibles (creados automáticamente en el bootstrap):

| Email | Password | Rol |
|---|---|---|
| `coordinator@planify.edu` | `Planify123*` | academic_coordinator |
| `teacher@planify.edu` | `Planify123*` | teacher |
| `student@planify.edu` | `Planify123*` | student |

Respuesta:

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "academic_coordinator", ... }
}
```

Usar el `jwt` como header en todas las peticiones:

```
Authorization: Bearer <jwt>
```

---

## 3. Endpoints de sesiones por recurso

### GET — Sesiones por docente

```
GET /api/class-sessions/by-teacher/:teacherDocumentId
```

Filtra sesiones donde `academicGroup.teacher.documentId` coincide.

**Ejemplo:**
```
GET http://localhost:1337/api/class-sessions/by-teacher/f1000000-0001-4000-8000-000000000001
Authorization: Bearer <jwt>
```

**Respuesta 200:**
```json
{
  "data": [
    {
      "documentId": "s1000000-0001-4000-8000-000000000001",
      "dayOfWeek": 1,
      "startTime": "08:00:00.000",
      "endTime": "10:00:00.000",
      "status": "planned",
      "academicGroup": {
        "documentId": "g1000000-0001-4000-8000-000000000001",
        "course": { "documentId": "...", "name": "Matemáticas I" },
        "teacher": { "documentId": "f1000000-0001-4000-8000-000000000001", "firstName": "Carlos" },
        "scheduleConfig": { "documentId": "..." }
      },
      "classroom": { "documentId": "c1000000-0001-4000-8000-000000000001", "code": "A101" }
    }
  ]
}
```

---

### GET — Sesiones por aula

```
GET /api/class-sessions/by-classroom/:classroomDocumentId
```

**Ejemplo:**
```
GET http://localhost:1337/api/class-sessions/by-classroom/c1000000-0001-4000-8000-000000000001
Authorization: Bearer <jwt>
```

**Respuesta 200:** misma estructura que por docente.

---

### GET — Sesiones por grupo académico

```
GET /api/class-sessions/by-academic-group/:academicGroupDocumentId
```

**Ejemplo:**
```
GET http://localhost:1337/api/class-sessions/by-academic-group/g1000000-0001-4000-8000-000000000001
Authorization: Bearer <jwt>
```

**Respuesta 200:** misma estructura que por docente.

---

## 4. Endpoint de reglas procesadas

### GET — Reglas procesadas de un schedule config

```
GET /api/schedule-configs/:scheduleConfigDocumentId/processed-rules
```

Retorna hard rules y soft rules normalizadas en un payload unificado.

**Ejemplo:**
```
GET http://localhost:1337/api/schedule-configs/sc100000-0001-4000-8000-000000000001/processed-rules
Authorization: Bearer <jwt>
```

**Respuesta 200:**
```json
{
  "data": {
    "scheduleConfig": {
      "documentId": "sc100000-0001-4000-8000-000000000001",
      "name": "Config Semestre 2026-1",
      "academicPeriod": "2026-1",
      "isActive": true
    },
    "rules": [
      {
        "kind": "hard",
        "documentId": "hr100000-0001-4000-8000-000000000001",
        "code": "NO_OVERLAP",
        "name": "Sin solapamiento de docente",
        "isEnabled": true,
        "parameters": {}
      },
      {
        "kind": "soft",
        "documentId": "sr100000-0001-4000-8000-000000000001",
        "code": "PREFER_MORNING",
        "name": "Preferir horario mañana",
        "isEnabled": true,
        "weight": 70,
        "parameters": {}
      }
    ],
    "hardRules": [ ... ],
    "softRules": [ ... ]
  }
}
```

---

## 5. Endpoint de validación de sesión

### POST — Validar sesión individual

```
POST /api/class-sessions/validar-sesion
```

Verifica si una sesión propuesta tiene conflictos con las sesiones existentes (solapamiento de docente, aula o grupo académico). Úsalo **antes de crear o actualizar** una sesión.

**Body:**
```json
{
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "10:00",
  "teacherDocumentId": "f1000000-0001-4000-8000-000000000001",
  "classroomDocumentId": "c1000000-0001-4000-8000-000000000001",
  "academicGroupDocumentId": "g1000000-0001-4000-8000-000000000001",
  "sessionDocumentId": null
}
```

> `sessionDocumentId` es opcional. Pasarlo cuando se valida una **actualización** para excluir la propia sesión de los chequeos.

**Respuesta 200 — sin conflictos:**
```json
{
  "data": {
    "valid": true,
    "conflicts": []
  }
}
```

**Respuesta 200 — con conflictos:**
```json
{
  "data": {
    "valid": false,
    "conflicts": [
      {
        "type": "teacher",
        "message": "El docente ya tiene una sesión asignada el día 1 entre 08:00:00.000 y 10:00:00.000",
        "conflictingSession": {
          "documentId": "s1000000-0001-4000-8000-000000000001",
          "dayOfWeek": 1,
          "startTime": "08:00:00.000",
          "endTime": "10:00:00.000"
        }
      }
    ]
  }
}
```

**Tipos de conflicto posibles:**

| `type` | Descripción |
|---|---|
| `teacher` | El docente ya tiene otra sesión en el mismo día y franja horaria |
| `classroom` | El aula ya está ocupada en el mismo día y franja horaria |
| `academicGroup` | El grupo ya tiene otra sesión en el mismo día y franja horaria |

**Códigos de error:**

| Status | Causa |
|---|---|
| 400 | `dayOfWeek` fuera de rango (1–6), o `startTime`/`endTime` faltantes |
| 401 | Sin JWT o JWT expirado |
| 403 | El rol del usuario no tiene permiso (`validateSession`) |

---

## 6. Endpoint de validación de horario completo

### GET — Validar horario de un schedule config

```
GET /api/schedule-configs/:scheduleConfigDocumentId/validar-horario
```

Recorre **todas las sesiones** asociadas a los grupos académicos de un schedule config y detecta conflictos internos (docente, aula o grupo con dos sesiones solapadas).

**Ejemplo:**
```
GET http://localhost:1337/api/schedule-configs/sc100000-0001-4000-8000-000000000001/validar-horario
Authorization: Bearer <jwt>
```

**Respuesta 200 — horario válido:**
```json
{
  "data": {
    "valid": true,
    "totalSessions": 5,
    "conflicts": []
  }
}
```

**Respuesta 200 — con conflictos:**
```json
{
  "data": {
    "valid": false,
    "totalSessions": 5,
    "conflicts": [
      {
        "type": "classroom",
        "message": "El aula ya está ocupada el día 2 entre 10:00:00.000 y 12:00:00.000",
        "conflictingSession": {
          "documentId": "s1000000-0002-4000-8000-000000000002",
          "dayOfWeek": 2,
          "startTime": "10:00:00.000",
          "endTime": "12:00:00.000"
        },
        "sessionA": {
          "documentId": "s1000000-0001-4000-8000-000000000001",
          "dayOfWeek": 2,
          "startTime": "11:00:00.000",
          "endTime": "13:00:00.000"
        },
        "sessionB": {
          "documentId": "s1000000-0002-4000-8000-000000000002",
          "dayOfWeek": 2,
          "startTime": "10:00:00.000",
          "endTime": "12:00:00.000"
        }
      }
    ]
  }
}
```

**Códigos de error:**

| Status | Causa |
|---|---|
| 400 | `scheduleConfigDocumentId` vacío o inválido |
| 404 | No existe un schedule config con ese `documentId` |
| 401 | Sin JWT o JWT expirado |
| 403 | El rol no tiene permiso (`validateSchedule`) |

---

## 7. Pruebas unitarias

Las funciones de validación (`isTimeOverlap`, `checkSessionConflicts`, `isWithinScheduleHours`) tienen pruebas unitarias independientes de Strapi.

```bash
# Desde la carpeta backend
cd backend
npm test
```

Resultado esperado:

```
 RUN  v4.1.5

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Duration  ~300ms
```

Archivo de pruebas: `backend/src/api/class-session/validation/session-validation.test.ts`

---

## 8. Colección Postman (resumen rápido)

| Método | URL | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/local` | Ninguna | `{ "identifier": "...", "password": "..." }` |
| GET | `/api/class-sessions/by-teacher/:id` | Bearer JWT | — |
| GET | `/api/class-sessions/by-classroom/:id` | Bearer JWT | — |
| GET | `/api/class-sessions/by-academic-group/:id` | Bearer JWT | — |
| GET | `/api/schedule-configs/:id/processed-rules` | Bearer JWT | — |
| POST | `/api/class-sessions/validar-sesion` | Bearer JWT | JSON con sesión propuesta |
| GET | `/api/schedule-configs/:id/validar-horario` | Bearer JWT | — |

> Base URL: `http://localhost:1337/api`

---

## 9. Permisos por rol

| Endpoint | academic_coordinator | teacher | student |
|---|---|---|---|
| `by-teacher` / `by-classroom` / `by-academic-group` | ✓ | ✓ | — |
| `processed-rules` | ✓ | ✓ | — |
| `validar-sesion` | ✓ | ✓ | — |
| `validar-horario` | ✓ | ✓ | — |

Los permisos se sincronizan automáticamente al iniciar Strapi vía el bootstrap en `backend/src/index.ts`.
