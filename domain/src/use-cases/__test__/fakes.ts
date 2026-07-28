import type { User } from "../../entities/User";
import type { Email } from "../../value-objects/Email";
import type { UserRepository } from "../../services/UserRepository";
import type { PasswordHasher } from "../../services/PasswordHasher";
import type { IdGenerator } from "../../services/IdGenerator";
import type { AuthTokenPayload, TokenGenerator } from "../../services/TokenGenerator";

/** Repositorio de usuarios en memoria (fake) para los tests de casos de uso. */
export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.byId.set(user.id, user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.byId.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.byId.get(id) ?? null;
  }
}

/** Hasher determinístico (fake): "hashed:<plain>". Suficiente para testear la lógica. */
export class FakePasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plain}`;
  }
}

/** Generador de ids fijo (fake) para tests determinísticos. */
export class FixedIdGenerator implements IdGenerator {
  constructor(private readonly id: string = "generated-id") {}

  next(): string {
    return this.id;
  }
}

/** Emisor de tokens fake: codifica el payload en un string legible. */
export class FakeTokenGenerator implements TokenGenerator {
  async generate(payload: AuthTokenPayload): Promise<string> {
    return `token:${payload.userId}:${payload.role}`;
  }
}
