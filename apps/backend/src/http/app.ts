import express from "express";
import cors from "cors";
import type { Container } from "../container";
import { authRoutes } from "./routes/auth";
import { restaurantRoutes } from "./routes/restaurants";
import { cartRoutes } from "./routes/cart";
import { orderRoutes } from "./routes/orders";
import { errorHandler } from "./middleware/errorHandler";

/** Dependencias opcionales de infraestructura para la app (no de dominio). */
export interface AppDeps {
  /**
   * Chequeo de readiness: verifica que las dependencias externas (la DB) estén
   * realmente disponibles. Con persistencia en memoria no se define.
   */
  checkReadiness?: () => Promise<void>;
}

/** Arma la app Express montando las rutas sobre el container de casos de uso. */
export function createApp(container: Container, deps: AppDeps = {}): express.Express {
  const app = express();
  app.use(cors()); // permite el consumo desde el frontend (Vite en :5173)
  app.use(express.json());

  // Liveness: el proceso está vivo y responde. Barato, sin tocar la DB.
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Readiness: además de vivo, ¿puede atender tráfico real? Verifica la DB.
  // (Healthcheck "avanzado": más allá de pg_isready — chequea la conexión de la
  // app, no sólo que el contenedor de Postgres esté arriba.)
  app.get("/ready", async (_req, res) => {
    try {
      if (deps.checkReadiness) await deps.checkReadiness();
      res.json({ status: "ready" });
    } catch {
      res.status(503).json({ status: "not-ready" });
    }
  });

  app.use("/api/auth", authRoutes(container));
  app.use("/api/restaurants", restaurantRoutes(container));
  app.use("/api/cart", cartRoutes(container));
  app.use("/api", orderRoutes(container));

  app.use(errorHandler);
  return app;
}
