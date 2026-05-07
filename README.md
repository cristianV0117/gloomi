# GLOOMI — Monorepo

Mismo repositorio en GitHub: **`frontend/`** (Vite + React) y **`backend/`** (NestJS). No hace falta configurar nada especial en GitHub; cada deploy (Railway, etc.) usa **Root Directory** `frontend` o `backend`.

## Requisitos

- Node.js LTS
- npm

## Instalación

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Scripts (desde la raíz del repo)

| Comando | Descripción |
|--------|-------------|
| `npm run dev` | Frontend en desarrollo (Vite) |
| `npm run dev:tunnel` | Frontend con túnel (`TUNNEL=1`) |
| `npm run build` | Build frontend + build Nest |
| `npm run lint` | ESLint del frontend |
| `npm run start:backend:dev` | API Nest en modo desarrollo |
| `npm run start:backend` | API Nest (build previo) |

## Carpetas

- **`frontend/`** — Tienda y personalizador GLOOMI (SPA). Ver `frontend/README.md` para detalle del stack Vite.
- **`backend/`** — API NestJS + **MongoDB** (Mongoose). Copia `backend/.env.example` → `backend/.env` y define `MONGODB_URI`. En local hace falta un servidor Mongo (Docker: `docker run -d -p 27017:27017 --name mongo mongo:7`). En Railway: plugin MongoDB o Atlas y la misma variable de entorno.

## MongoDB (backend)

1. `cd backend && cp .env.example .env` y edita `MONGODB_URI`.
2. Levanta Mongo local o usa [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. Para definir **schemas**, usa `@Prop()` + `SchemaFactory` de Mongoose y registra el módulo con `MongooseModule.forFeature([{ name: X.name, schema: XSchema }])` (ver [Nest + Mongoose](https://docs.nestjs.com/techniques/mongodb)).

## GitHub

Un solo remoto; los pushes incluyen ambas carpetas. Para ignorar secretos, usa `.env` locales (ver `.gitignore`).
