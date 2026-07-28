import { Email } from "../value-objects/Email";

export type UserRole = "CLIENTE" | "REPARTIDOR" | "ADMIN";

const ROLES: readonly UserRole[] = ["CLIENTE", "REPARTIDOR", "ADMIN"];

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  role: UserRole;
  /**
   * Hash de la contraseña — NUNCA la contraseña en texto plano.
   * Lo produce el puerto `PasswordHasher` en el caso de uso de registro;
   * la entidad solo lo transporta de forma opaca.
   */
  passwordHash: string;
}

/**
 * Usuario del sistema (entidad con identidad `id`).
 * El rol determina qué puede hacer (cliente / repartidor / admin de restaurante).
 */
export class User {
  readonly id: string;
  readonly name: string;
  readonly email: Email;
  readonly role: UserRole;
  readonly passwordHash: string;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.passwordHash = props.passwordHash;
  }

  static create(props: UserProps): User {
    const name = props.name.trim();
    if (name.length === 0) {
      throw new Error("El usuario requiere un nombre");
    }
    // Chequeo en runtime porque el rol puede venir de una API/DB (fuera del type system).
    if (!ROLES.includes(props.role)) {
      throw new Error(`Rol inválido: ${String(props.role)}`);
    }
    if (props.passwordHash.trim().length === 0) {
      throw new Error("El usuario requiere un hash de contraseña");
    }
    return new User({ ...props, name });
  }

  isCliente(): boolean {
    return this.role === "CLIENTE";
  }

  isRepartidor(): boolean {
    return this.role === "REPARTIDOR";
  }

  isAdmin(): boolean {
    return this.role === "ADMIN";
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }
}
