# reservadb-backend

Backend REST para el sistema de reservas de mesas usando PostgreSQL.

## Instalación

```bash
npm install
copy .env.example .env
```

Completa `DATABASE_URL` de PostgreSQL y `JWT_SECRET` en `.env` antes de iniciar la API. Para Supabase, usa la URL de conexión de PostgreSQL del proyecto, conserva `DATABASE_SSL=true` y utiliza `CORS_ORIGIN=http://localhost:4321` durante el desarrollo.

## Desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

## Verificación

```bash
npm run build
```

## Rutas

```text
GET  /api/health
POST /api/auth/login
POST /api/auth/logout
POST /api/reservas
PUT  /api/reservas/:id
GET  /api/reservas
```

`GET /api/health` comprueba también la conexión real con PostgreSQL y devuelve `503` si la base de datos no está disponible.

Todas las rutas de reservas y cierre de sesión requieren:

```text
Authorization: Bearer <jwt>
```

## Importante sobre el administrador inicial

El script SQL crea el administrador con un hash bcrypt de ocho saltos. La contraseña de ejemplo es `123456`; debe cambiarse antes de usar el sistema en producción.
