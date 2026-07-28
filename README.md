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
