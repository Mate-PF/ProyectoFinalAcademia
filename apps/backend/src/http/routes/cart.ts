import { Router } from "express";
import type { Container } from "../../container";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";
import { cartToJson } from "../presenters";

export function cartRoutes(container: Container): Router {
  const router = Router();
  const { useCases, tokens } = container;

  // Todo el carrito requiere estar autenticado.
  router.use(requireAuth(tokens));

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const view = await useCases.viewCart.execute(auth.userId);
      res.json(view === null ? { cart: null } : cartToJson(view));
    }),
  );

  router.post(
    "/items",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const cart = await useCases.addToCart.execute({
        customerId: auth.userId,
        menuItemId: req.body.menuItemId,
        quantity: req.body.quantity,
      });
      res.status(201).json(
        cartToJson({
          cartId: cart.id,
          restaurantId: cart.restaurantId,
          items: cart.items,
          total: cart.isEmpty() ? null : cart.total(),
        }),
      );
    }),
  );

  router.delete(
    "/items/:menuItemId",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const cart = await useCases.removeFromCart.execute({
        customerId: auth.userId,
        menuItemId: req.params.menuItemId,
      });
      res.json(
        cartToJson({
          cartId: cart.id,
          restaurantId: cart.restaurantId,
          items: cart.items,
          total: cart.isEmpty() ? null : cart.total(),
        }),
      );
    }),
  );

  return router;
}
