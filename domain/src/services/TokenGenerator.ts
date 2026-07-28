import type { UserRole } from "../entities/User";

/** Datos que viajan dentro del token de sesión. */
export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}

/**
 * Puerto para emitir tokens de sesión (JWT, PASETO, etc.). El dominio no sabe
 * el formato ni el secreto: eso lo resuelve la implementación en el backend.
 */
export interface TokenGenerator {
  generate(payload: AuthTokenPayload): Promise<string>;
}
