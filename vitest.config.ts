import { defineConfig } from "vitest/config";

// Config raíz: SOLO los tests del dominio (entorno node). El frontend (apps/web)
// tiene su propia config con jsdom (se corre con `pnpm --filter @proyecto/web test`).
export default defineConfig({
  test: {
    include: ["domain/**/*.test.ts"],
    environment: "node",
  },
});
