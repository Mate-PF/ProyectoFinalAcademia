import "dotenv/config";
import { buildContainer, type Repositories } from "./container";
import { buildInMemoryRepositories } from "./adapters/in-memory";
import { createApp } from "./http/app";

const PORT = Number(process.env.PORT ?? 3000);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const PERSISTENCE = process.env.PERSISTENCE ?? "memory";

/**
 * Elige el adaptador de persistencia. Prisma se carga con import DINÁMICO (y por
 * eso los adaptadores Prisma quedan fuera del `tsc` por defecto): solo se toca
 * el cliente generado si realmente se usa PERSISTENCE=prisma.
 */
let checkReadiness: (() => Promise<void>) | undefined;

async function resolveRepositories(): Promise<Repositories> {
  if (PERSISTENCE === "prisma") {
    const modulePath = "./adapters/prisma/index.js";
    const mod = (await import(modulePath)) as {
      buildPrismaRepositories: () => Repositories;
      pingDatabase: () => Promise<void>;
    };
    checkReadiness = mod.pingDatabase;
    return mod.buildPrismaRepositories();
  }
  return buildInMemoryRepositories();
}

const repositories = await resolveRepositories();
const app = createApp(buildContainer({ ...repositories, jwtSecret: JWT_SECRET }), { checkReadiness });

app.listen(PORT, () => {
  console.log(`Backend (persistencia: ${PERSISTENCE}) escuchando en http://localhost:${PORT}`);
});
