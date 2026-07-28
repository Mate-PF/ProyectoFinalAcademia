import { Router } from "express";
import type { Container } from "../../container";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";
import { orderToJson, moneyToJson } from "../presenters";

export function orderRoutes(container: Container): Router {
  const router = Router();
  const { useCases, tokens } = container;

  // Todo el flujo de pedidos requiere estar autenticado.
  router.use(requireAuth(tokens));

  // Confirmar el carrito -> crea el pedido.
  router.post(
    "/checkout",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const order = await useCases.checkout.execute({ customerId: auth.userId });
      res.status(201).json(orderToJson(order));
    }),
  );

  // Avanzar/cancelar el pedido (action + rol salen del cuerpo y del JWT).
  router.patch(
    "/orders/:id/status",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const order = await useCases.changeOrderStatus.execute({
        orderId: req.params.id,
        actorId: auth.userId,
        actorRole: auth.role,
        action: req.body.action,
      });
      res.json(orderToJson(order));
    }),
  );

  // Asignar repartidor (solo ADMIN: lo valida el caso de uso).
  router.patch(
    "/orders/:id/deliverer",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const order = await useCases.assignDeliverer.execute({
        orderId: req.params.id,
        actorRole: auth.role,
        delivererId: req.body.delivererId,
      });
      res.json(orderToJson(order));
    }),
  );

  // Mis pedidos (historial del cliente autenticado).
  router.get(
    "/orders",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const orders = await useCases.listMyOrders.execute({ customerId: auth.userId });
      res.json(orders.map(orderToJson));
    }),
  );

  // Mis entregas (pedidos asignados al repartidor autenticado).
  router.get(
    "/deliveries",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const orders = await useCases.listDeliveries.execute({ delivererId: auth.userId });
      res.json(orders.map(orderToJson));
    }),
  );

  // Seguir un pedido (solo el cliente dueño).
  router.get(
    "/orders/:id",
    asyncHandler(async (req, res) => {
      const auth = req.auth;
      if (auth === undefined) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const tracking = await useCases.trackOrder.execute({
        orderId: req.params.id,
        customerId: auth.userId,
      });
      res.json({
        orderId: tracking.orderId,
        status: tracking.status,
        total: moneyToJson(tracking.total),
        delivererId: tracking.delivererId,
      });
    }),
  );

  return router;
}
