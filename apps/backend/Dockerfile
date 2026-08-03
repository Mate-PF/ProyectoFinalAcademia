# syntax=docker/dockerfile:1
#
# Imagen del backend (Express + Prisma). El backend corre con `tsx` (intérprete
# de TS), por eso NO hay un paso de compilación a JS: el "artefacto" es el propio
# código fuente + node_modules + el cliente Prisma generado. Igual usamos dos
# etapas para dejar fuera de la imagen final la caché de pnpm y el contexto de
# build, y para que `prisma generate` quede cacheado por capas.
#
# Build context = raíz del repo (necesita el workspace pnpm y el paquete domain).

# ---- build: instala deps del workspace + genera el cliente Prisma ----
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

# 1) Manifests primero → mejor cacheo de la capa de dependencias.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY domain/package.json domain/
COPY apps/backend/package.json apps/backend/
COPY apps/web/package.json apps/web/

# 2) Instala SOLO el backend y sus deps del workspace (incluye @proyecto/domain).
RUN pnpm install --filter @proyecto/backend... --frozen-lockfile

# tsconfig base de la raíz: backend/ y domain/ hacen extends de él (lo lee tsx).
COPY tsconfig.base.json tsconfig.json ./

# 3) Código fuente (domain como source: el backend lo importa vía tsx).
COPY domain/ domain/
COPY apps/backend/ apps/backend/

# 4) Genera el cliente Prisma contra el schema versionado.
#    (Descarga los engines de prisma.sh — requiere red durante el build.)
RUN pnpm --filter @proyecto/backend exec prisma generate

# ---- runtime ----
FROM node:22-alpine AS runtime
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app
ENV NODE_ENV=production
ENV PERSISTENCE=prisma

# Copiamos el /app ya instalado y generado desde la etapa de build.
COPY --from=build /app ./

# Entrypoint: aplica migraciones y arranca el server.
COPY apps/backend/docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
