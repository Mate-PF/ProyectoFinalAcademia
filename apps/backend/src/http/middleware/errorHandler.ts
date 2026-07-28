import type { ErrorRequestHandler } from "express";

/**
 * Traduce errores a respuestas HTTP. El dominio lanza `Error` con mensajes de
 * negocio; mapeamos algunos casos frecuentes por heurística. Una versión más
 * robusta usaría errores tipados del dominio para códigos precisos.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const message = err instanceof Error ? err.message : "Error interno";
  const status = statusFor(message);
  res.status(status).json({ error: message });
};

function statusFor(message: string): number {
  const m = message.toLowerCase();
  if (m.includes("email o contraseña")) return 401;
  if (m.includes("permiso") || m.startsWith("solo ")) return 403;
  if (m.includes("no existe")) return 404;
  return 400;
}
