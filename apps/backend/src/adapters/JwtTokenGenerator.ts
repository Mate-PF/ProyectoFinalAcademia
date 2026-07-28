import jwt from "jsonwebtoken";
import type { AuthTokenPayload, TokenGenerator } from "@proyecto/domain";

const ONE_DAY_SECONDS = 60 * 60 * 24;

/** Adaptador real del puerto TokenGenerator usando JWT. */
export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: string,
    private readonly expiresInSeconds: number = ONE_DAY_SECONDS,
  ) {}

  async generate(payload: AuthTokenPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresInSeconds });
  }

  /** Verifica un token y devuelve el payload (usado por el middleware de auth). */
  verify(token: string): AuthTokenPayload {
    const decoded = jwt.verify(token, this.secret);
    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      throw new Error("Token inválido");
    }
    return { userId: decoded.userId, role: decoded.role as AuthTokenPayload["role"] };
  }
}
