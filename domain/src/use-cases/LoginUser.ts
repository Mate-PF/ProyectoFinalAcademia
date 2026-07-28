import type { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import type { UserRepository } from "../services/UserRepository";
import type { PasswordHasher } from "../services/PasswordHasher";
import type { TokenGenerator } from "../services/TokenGenerator";

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserResult {
  token: string;
  user: User;
}

// Mensaje único para no revelar si el email existe o si falló la contraseña
// (evita enumeración de usuarios).
const INVALID_CREDENTIALS = "Email o contraseña incorrectos";

/**
 * Caso de uso: autenticar un usuario y emitir un token de sesión.
 * Depende de los puertos UserRepository, PasswordHasher y TokenGenerator (DIP).
 */
export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenGenerator,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserResult> {
    let email: Email;
    try {
      email = Email.create(input.email);
    } catch {
      // Un email mal formado no puede corresponder a ningún usuario.
      throw new Error(INVALID_CREDENTIALS);
    }

    const user = await this.users.findByEmail(email);
    if (user === null) {
      throw new Error(INVALID_CREDENTIALS);
    }

    const passwordOk = await this.hasher.compare(input.password, user.passwordHash);
    if (!passwordOk) {
      throw new Error(INVALID_CREDENTIALS);
    }

    const token = await this.tokens.generate({ userId: user.id, role: user.role });
    return { token, user };
  }
}
