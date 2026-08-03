# syntax=docker/dockerfile:1
#
# Imagen del frontend. Caso de libro para MULTI-STAGE: la etapa de build trae
# todo Node + pnpm + Vite (pesado) para compilar el SPA, y la etapa final es un
# nginx:alpine que sólo sirve los estáticos (imagen chica). nginx además hace de
# reverse proxy: /api → backend:3000 (ver nginx.conf).
#
# Build context = raíz del repo (workspace pnpm).

# ---- build: compila el SPA con Vite ----
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

# Manifests primero (cacheo de deps).
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY domain/package.json domain/
COPY apps/backend/package.json apps/backend/
COPY apps/web/package.json apps/web/

# Sólo las deps del front.
RUN pnpm install --filter @proyecto/web... --frozen-lockfile

# tsconfig base de la raíz: apps/web/tsconfig.json hace extends de ../../tsconfig.base.json.
COPY tsconfig.base.json tsconfig.json ./
COPY apps/web/ apps/web/

# URL de la API RELATIVA: el navegador pega a /api (mismo origen que nginx) y
# nginx lo proxea al backend por la red interna de Docker. Así no hay ninguna
# URL atada al host horneada en el bundle.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @proyecto/web build

# ---- runtime: nginx (no-root) sirve los estáticos + reverse proxy ----
# nginx-unprivileged corre como usuario sin privilegios (uid 101) y escucha en 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 8080
# La imagen oficial de nginx ya corre en foreground (no hace falta CMD).
