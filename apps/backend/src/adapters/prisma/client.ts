import { PrismaClient } from "@prisma/client";

/** Instancia única del cliente Prisma para todo el backend. */
export const prisma = new PrismaClient();
