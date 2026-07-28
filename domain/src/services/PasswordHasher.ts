/**
 * Puerto para el hasheo de contraseñas. El dominio NO sabe cómo se hashea
 * (bcrypt, argon2, etc.): eso lo decide la implementación en el backend.
 * Así el dominio no depende de ninguna librería concreta (DIP).
 */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
