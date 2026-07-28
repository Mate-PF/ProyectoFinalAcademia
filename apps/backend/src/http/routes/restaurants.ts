import { Router } from "express";
import type { Container } from "../../container";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";
import { restaurantToJson, menuItemToJson } from "../presenters";

export function restaurantRoutes(container: Container): Router {
  const router = Router();
  const { useCases, tokens } = container;

  // Listar todos los restaurantes (público: el cliente elige de acá).
  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const restaurants = await useCases.listRestaurants.execute();
      res.json(restaurants.map(restaurantToJson));
    }),
  );

  // Crear restaurante (solo ADMIN: lo valida el caso de uso).
  router.post(
    "/",
    requireAuth(tokens),
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const restaurant = await useCases.createRestaurant.execute({
        ownerId: auth.userId,
        name: req.body.name,
        address: req.body.address,
      });
      res.status(201).json(restaurantToJson(restaurant));
    }),
  );

  // Agregar ítem al menú (solo el dueño: lo valida el caso de uso).
  router.post(
    "/:id/menu",
    requireAuth(tokens),
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const item = await useCases.addMenuItem.execute({
        actorId: auth.userId,
        restaurantId: req.params.id,
        name: req.body.name,
        price: req.body.price,
        currency: req.body.currency,
      });
      res.status(201).json(menuItemToJson(item));
    }),
  );

  // Listar menú (público). ?all=true incluye no disponibles.
  router.get(
    "/:id/menu",
    asyncHandler(async (req, res) => {
      const items = await useCases.listMenu.execute({
        restaurantId: req.params.id,
        includeUnavailable: req.query.all === "true",
      });
      res.json(items.map(menuItemToJson));
    }),
  );

  return router;
}
