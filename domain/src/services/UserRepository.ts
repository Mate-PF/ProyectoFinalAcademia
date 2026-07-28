import type { User } from "../entities/User";
import type { Email } from "../value-objects/Email";

/**
 * Puerto de persistencia de usuarios. El dominio define QUÉ necesita
 * (guardar, buscar por email/id); la implementación concreta (Prisma, memoria,
 * etc.) vive en la capa externa.
 */
export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
