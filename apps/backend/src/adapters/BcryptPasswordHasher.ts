import bcrypt from "bcryptjs";
import type { PasswordHasher } from "@proyecto/domain";

const SALT_ROUNDS = 10;

/** Adaptador real del puerto PasswordHasher usando bcrypt. */
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
