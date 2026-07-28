import { describe, it, expect } from "vitest";
import { ChangeOrderStatus } from "./ChangeOrderStatus";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Money } from "../value-objects/Money";
import { InMemoryOrderRepository } from "./__test__/fakes";

function makeOrder(): Order {
  const item = OrderItem.create({
    menuItemId: "m1",
    name: "Pizza",
    unitPrice: Money.fromDecimal(10, "ARS"),
    quantity: 1,
  });
  return Order.create({ id: "o-1", customerId: "c1", restaurantId: "r-1", items: [item] });
}

async function withOrder(mutate?: (order: Order) => void) {
  const orders = new InMemoryOrderRepository();
  const order = makeOrder();
  mutate?.(order);
  await orders.save(order);
  const useCase = new ChangeOrderStatus(orders);
  return { orders, useCase };
}

describe("ChangeOrderStatus", () => {
  it("un ADMIN confirma un pedido PENDIENTE", async () => {
    const { orders, useCase } = await withOrder();
    await useCase.execute({ orderId: "o-1", actorId: "admin", actorRole: "ADMIN", action: "CONFIRM" });
    expect((await orders.findById("o-1"))?.status).toBe("CONFIRMADO");
  });

  it("un CLIENTE no puede confirmar", async () => {
    const { useCase } = await withOrder();
    await expect(
      useCase.execute({ orderId: "o-1", actorId: "c1", actorRole: "CLIENTE", action: "CONFIRM" }),
    ).rejects.toThrow();
  });

  it("el repartidor asignado entrega un pedido EN_CAMINO", async () => {
    const { orders, useCase } = await withOrder((order) => {
      order.confirm();
      order.assignDeliverer("rep-1");
      order.startPreparing();
      order.dispatch(); // EN_CAMINO, delivererId=rep-1
    });
    await useCase.execute({ orderId: "o-1", actorId: "rep-1", actorRole: "REPARTIDOR", action: "DELIVER" });
    expect((await orders.findById("o-1"))?.status).toBe("ENTREGADO");
  });

  it("un repartidor que no es el asignado no puede entregar", async () => {
    const { useCase } = await withOrder((order) => {
      order.confirm();
      order.assignDeliverer("rep-1");
      order.startPreparing();
      order.dispatch();
    });
    await expect(
      useCase.execute({ orderId: "o-1", actorId: "rep-2", actorRole: "REPARTIDOR", action: "DELIVER" }),
    ).rejects.toThrow();
  });

  it("el cliente dueño puede cancelar su pedido", async () => {
    const { orders, useCase } = await withOrder();
    await useCase.execute({ orderId: "o-1", actorId: "c1", actorRole: "CLIENTE", action: "CANCEL" });
    expect((await orders.findById("o-1"))?.status).toBe("CANCELADO");
  });

  it("un tercero no puede cancelar un pedido ajeno", async () => {
    const { useCase } = await withOrder();
    await expect(
      useCase.execute({ orderId: "o-1", actorId: "otro", actorRole: "CLIENTE", action: "CANCEL" }),
    ).rejects.toThrow();
  });

  it("respeta la máquina de estados: el repartidor asignado no puede entregar si el pedido no salió (CONFIRMADO)", async () => {
    // Autorizado (repartidor asignado) pero el estado no permite ENTREGADO → la entidad rechaza.
    const { useCase } = await withOrder((order) => {
      order.confirm();
      order.assignDeliverer("rep-1"); // delivererId=rep-1, pero sigue en CONFIRMADO
    });
    await expect(
      useCase.execute({ orderId: "o-1", actorId: "rep-1", actorRole: "REPARTIDOR", action: "DELIVER" }),
    ).rejects.toThrow();
  });

  it("rechaza si el pedido no existe", async () => {
    const { useCase } = await withOrder();
    await expect(
      useCase.execute({ orderId: "nope", actorId: "admin", actorRole: "ADMIN", action: "CONFIRM" }),
    ).rejects.toThrow();
  });
});
