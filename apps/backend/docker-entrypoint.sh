#!/bin/sh
# Entrypoint del contenedor del backend.
# Usa invocaciones DIRECTAS (node + el bin de prisma), sin pnpm/corepack en
# runtime: así no baja pnpm de la red al arrancar y el log queda limpio.
# 1) Aplica las migraciones YA versionadas (migrate deploy: idempotente, sin shadow DB).
# 2) Arranca el server (PERSISTENCE=prisma viene del entorno).
# La DB ya está sana cuando este contenedor arranca (depends_on: service_healthy).
set -e
cd /app/apps/backend

echo "→ Aplicando migraciones Prisma (migrate deploy)…"
./node_modules/.bin/prisma migrate deploy

echo "→ Iniciando backend (PERSISTENCE=${PERSISTENCE:-prisma}) en :${PORT:-3000}…"
exec node --import tsx src/main.ts
