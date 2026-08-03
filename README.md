# Proyecto Final — Academia For-It (pedidos de comida)

Monorepo con **arquitectura limpia + TDD + TypeScript**. Tres entregas encadenadas:
dominio → backend → frontend → docker-compose.

## Estructura

```
proyecto-final/
├── package.json            # raíz (workspaces, tooling: vitest, eslint, tsc)
├── pnpm-workspace.yaml
├── tsconfig.base.json      # config TS compartida (strict, noEmit)
├── vitest.config.ts
├── eslint.config.js
├── domain/                 # capa de dominio (pura, sin dependencias externas)
│   ├── package.json        # @proyecto/domain
│   ├── tsconfig.json
│   └── src/
│       ├── entities/       # entidades (con identidad): User, Order, ...
│       ├── use-cases/      # casos de uso (reglas de aplicación)
│       ├── services/       # puertos (interfaces): PasswordHasher, repos, ...
│       ├── value-objects/  # value objects (sin identidad): Money, Email, ...
│       │   ├── Money.ts
│       │   └── Money.test.ts
│       └── index.ts        # barrel
└── apps/                   # backend / frontend (más adelante)
```

## Comandos (desde la raíz)

```bash
pnpm install          # instala dependencias del workspace
pnpm test             # corre todos los tests (vitest run)
pnpm test:watch       # tests en modo watch (para el ciclo TDD)
pnpm typecheck        # tsc --noEmit en cada paquete
pnpm lint             # eslint
pnpm check            # typecheck + lint + test (gate completo)
```

## Flujo de trabajo TDD

Rojo → Verde → Refactor, un comportamiento a la vez:
1. Escribir un test que falle (rojo).
2. Implementar lo mínimo para que pase (verde).
3. Refactorizar con los tests en verde.

Los tests van **co-localizados** junto al archivo que prueban (`X.ts` + `X.test.ts`).

## Backend (`apps/backend`)

API Express que expone los casos de uso del dominio. Los puertos se implementan
con adaptadores reales (bcrypt, JWT, `crypto.randomUUID`) y, por ahora,
repositorios **en memoria** (se cambiarán por Postgres en la entrega de Docker).
El `container.ts` es el *composition root*: el único lugar que conoce las
implementaciones concretas.

```bash
pnpm --filter @proyecto/backend dev     # levanta el server (tsx watch) en :3000
```

Endpoints iniciales (auth):
- `GET  /health`
- `POST /api/auth/register`  → `{ name, email, password, role }`
- `POST /api/auth/login`     → `{ email, password }` → `{ token, user }`
- `GET  /api/auth/me`        → requiere `Authorization: Bearer <token>`

## Base de datos (Docker + Prisma) — entrega 3

Postgres se levanta con Docker; el backend puede persistir en memoria (default)
o en Postgres vía Prisma (toggle `PERSISTENCE`).

Setup (una vez):
```bash
docker compose up -d                              # Postgres en :5432
cd apps/backend && cp .env.example .env           # ajustá DATABASE_URL/JWT_SECRET
pnpm --filter @proyecto/backend prisma:generate   # genera el cliente Prisma
pnpm --filter @proyecto/backend prisma:migrate    # crea las tablas (migración inicial)
```
Correr el backend contra Postgres:
```bash
PERSISTENCE=prisma pnpm --filter @proyecto/backend dev
```
> Nota: el `schema.prisma` espeja el dominio (dinero en centavos + moneda,
> dirección embebida). Los adaptadores Prisma reconstruyen los value objects y
> usan `Order.rehydrate`/`Cart.rehydrate` al leer. **El dominio y los casos de
> uso NO cambian**: solo se enchufa otro adaptador — ese es el pago de la
> arquitectura limpia.

## Levantar TODO el sistema con un solo comando (Docker Compose)

La sección anterior levanta sólo Postgres (útil para desarrollar el backend en el
host). Para correr **todo el sistema orquestado** (db + backend + frontend) con un
único comando:

```bash
cp .env.example .env        # una sola vez (define credenciales y JWT_SECRET)
docker compose up --build   # levanta los tres servicios
```

La app queda en **http://localhost:8080**.

### Qué hace cada servicio

| Servicio   | Imagen                          | Puerto (host) | Rol |
|------------|---------------------------------|---------------|-----|
| `db`       | `postgres:16-alpine`            | `5432` *(opc.)* | Base de datos, con volumen persistente `pgdata` y healthcheck (`pg_isready`). |
| `backend`  | build `apps/backend/Dockerfile` | `3000` *(opc.)* | Express + Prisma. En el arranque corre `prisma migrate deploy` y sirve con `PERSISTENCE=prisma`. |
| `frontend` | build `apps/web/Dockerfile`     | `8080`        | nginx que sirve el SPA compilado **y** hace de reverse proxy de `/api`. |

El arranque respeta el orden con `depends_on` + `condition: service_healthy`:
**db (sana) → backend (sano) → frontend**. Así el backend no intenta conectarse
antes de que Postgres acepte conexiones, y nginx no arranca antes que el backend.

### Cómo se comunican (y por qué el frontend NO usa `http://backend:3000`)

```
navegador  ──HTTP :8080──▶  nginx (frontend)
                              ├─ /            → sirve el SPA (index.html)
                              └─ /api/…       → proxy_pass ▶ backend:3000  ──▶  db:5432
```

El SPA se compila con `VITE_API_URL=""`, así que el cliente pega a rutas
**relativas** (`/api/…`). Esto es clave: las peticiones las hace el **navegador**,
que corre en tu máquina y **no** puede resolver el nombre `backend` (ese nombre
sólo existe dentro de la red de Docker). Por eso el frontend habla siempre con
nginx (mismo origen) y es **nginx** —que sí está en la red interna— el que reenvía
a `backend:3000`. Un `VITE_API_URL=http://backend:3000` fallaría en el browser.

### Para hostear esto en un servidor

- **Reverse proxy:** ya lo tenemos. nginx es la única puerta de entrada: expone un
  puerto, sirve los estáticos y enruta `/api` al backend. En un server sería el
  lugar natural para terminar TLS, cachear estáticos y balancear.
- **Dominio + HTTPS:** apuntás un dominio (registro A) a la IP del server y sacás un
  certificado gratis con **Let's Encrypt** (p. ej. `certbot`). En Compose se suele
  sumar un contenedor de certbot que renueva el cert en un volumen compartido, y
  nginx escucha en `443` con `ssl_certificate`. El `X-Forwarded-Proto` que ya
  mandamos ayuda al backend a saber que el tráfico original era https.
- **Secretos:** acá van en `.env` (fuera del `docker-compose.yml`, y `.env` está
  ignorado por git). En producción se reemplaza por variables del entorno del server
  o un gestor de secretos (Docker/Swarm secrets, Vault, las variables del proveedor).
  Nada de credenciales hardcodeadas ni commiteadas.
- **Imágenes:** `Dockerfile` multi-stage → el frontend termina como un nginx chico
  (sólo estáticos, sin Node). `restart: unless-stopped` para que los servicios se
  recuperen solos.

## Uso de la aplicación

Levantar en dos terminales:
```bash
pnpm --filter @proyecto/backend dev     # API en :3000 (persistencia en memoria por defecto)
pnpm --filter @proyecto/web dev         # Frontend en :5173
```
Luego abrir **http://localhost:5173**.

### Crear cuenta y elegir rol

![Crear cuenta](docs/img/register.png)

En **Crear cuenta** se ingresa nombre, email y contraseña, y se elige un **rol**. Al registrarse, la sesión queda iniciada automáticamente. Cada rol ve una app distinta:

- **Cliente**: pide comida (Restaurantes → menú → carrito → checkout → seguimiento) y consulta **Mis pedidos**.
- **Admin**: crea su restaurante, carga el menú y **gestiona los pedidos** (Confirmar → Preparar → Despachar), pudiendo además **asignar un repartidor**.
- **Repartidor**: ve **Mis entregas** y marca los pedidos como entregados.

### Iniciar sesión

![Iniciar sesión](docs/img/login.png)

Con email y contraseña. El menú de navegación se adapta al rol del usuario. El botón 🌙/☀️ del header alterna entre tema **claro y oscuro** (la preferencia se recuerda).

### Comportamiento esperado (flujo completo)

1. El **cliente** arma un pedido y lo confirma → queda en estado **Pendiente**.
2. El **admin** lo **Confirma → Prepara → Despacha** (cada acción actualiza el estado en el acto) y le **asigna un repartidor**.
3. El pedido pasa a **En camino**; el **repartidor** lo marca como **Entregado**.
4. El **cliente** ve el estado actualizado en **Mis pedidos** / seguimiento.

> En modo memoria (por defecto) los datos se reinician cada vez que se reinicia el backend. Para persistencia real, ver la sección de Docker + Prisma.
