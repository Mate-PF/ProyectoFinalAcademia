import express from "express";
import type { Container } from "../container";
import { authRoutes } from "./routes/auth";
import { restaurantRoutes } from "./routes/restaurants";
import { cartRoutes } from "./routes/cart";
import { orderRoutes } from "./routes/orders";
import { errorHandler } from "./middleware/errorHandler";

/** Arma la app Express montando las rutas sobre el container de casos de uso. */
export function createApp(container: Container): express.Express {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes(container));
  app.use("/api/restaurants", restaurantRoutes(container));
  app.use("/api/cart", cartRoutes(container));
  app.use("/api", orderRoutes(container));

  app.use(errorHandler);
  return app;
}
