import { User, type UserRole } from "../entities/User";
import { Email } from "../value-objects/Email";
import type { PasswordHasher } from "../services/PasswordHasher";
import type { IdGenerator } from "../services/IdGenerator";
import type { UserRepository } from "../services/UserRepository";

const MIN_PASSWORD_LENGTH = 8;

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Caso de uso: registrar un usuario.
 *
 * Depende de ABSTRACCIONES (los puertos), no de implementaciones concretas —
 * se inyectan por el constructor. Esto es la Inversión de Dependencias (DIP):
 * el dominio dicta las interfaces y el mundo externo las implementa. En los
 * tests inyectamos fakes en memoria; en producción, adaptadores reales.
 */
export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = Email.create(input.email); // el VO valida y normaliza el formato

    const existing = await this.users.findByEmail(email);
    if (existing !== null) {
      throw new Error("Ya existe un usuario con ese email");
    }

    if (input.password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }

    const passwordHash = await this.hasher.hash(input.password);

    const user = User.create({
      id: this.ids.next(),
      name: input.name,
      email,
      role: input.role,
      passwordHash,
    });

    await this.users.save(user);
    return user;
  }
}
