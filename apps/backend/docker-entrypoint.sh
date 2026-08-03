#!/bin/sh
# Entrypoint del contenedor del backend.
# 1) Aplica las migraciones YA versionadas (migrate deploy: idempotente, sin shadow DB).
# 2) Arranca el server con persistencia Prisma.
# La DB ya está sana cuando este contenedor arranca (depends_on: service_healthy).
set -e

echo "→ Aplicando migraciones Prisma (migrate deploy)…"
pnpm --filter @proyecto/backend prisma:deploy

echo "→ Iniciando backend (PERSISTENCE=prisma) en :${PORT:-3000}…"
exec pnpm --filter @proyecto/backend start:prisma
