import type { RequestHandler } from "express";
import type { AuthTokenPayload } from "@proyecto/domain";
import type { JwtTokenGenerator } from "../../adapters/JwtTokenGenerator";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

const BEARER = "Bearer ";

/** Exige un JWT válido en Authorization; deja el payload en req.auth. */
export function requireAuth(tokens: JwtTokenGenerator): RequestHandler {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (header === undefined || !header.startsWith(BEARER)) {
      res.status(401).json({ error: "Falta el token de autenticación" });
      return;
    }
    try {
      req.auth = tokens.verify(header.slice(BEARER.length));
      next();
    } catch {
      res.status(401).json({ error: "Token inválido" });
    }
  };
}
