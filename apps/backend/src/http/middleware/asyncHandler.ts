import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Envuelve un handler async para que sus errores lleguen al middleware de
 * errores (en Express 4 los rechazos de promesas no se propagan solos).
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
