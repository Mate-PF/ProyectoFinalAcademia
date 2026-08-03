import type { Repositories } from "../../container";
import { prisma } from "./client";
import { PrismaUserRepository } from "./PrismaUserRepository";
import { PrismaRestaurantRepository } from "./PrismaRestaurantRepository";
import { PrismaMenuItemRepository } from "./PrismaMenuItemRepository";
import { PrismaCartRepository } from "./PrismaCartRepository";
import { PrismaOrderRepository } from "./PrismaOrderRepository";

/** Construye el set de repositorios contra Postgres vía Prisma. */
export function buildPrismaRepositories(): Repositories {
  return {
    users: new PrismaUserRepository(),
    restaurants: new PrismaRestaurantRepository(),
    menuItems: new PrismaMenuItemRepository(),
    carts: new PrismaCartRepository(),
    orders: new PrismaOrderRepository(),
  };
}

/** Readiness: verifica que la conexión a Postgres esté operativa. */
export async function pingDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}
