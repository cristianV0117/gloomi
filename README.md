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
- **`backend/`** — API NestJS. Punto de entrada `backend/src/main.ts`.

## GitHub

Un solo remoto; los pushes incluyen ambas carpetas. Para ignorar secretos, usa `.env` locales (ver `.gitignore`).
