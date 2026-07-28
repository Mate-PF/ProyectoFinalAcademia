import { describe, it, expect } from "vitest";
import { TrackOrder } from "./TrackOrder";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Money } from "../value-objects/Money";
import { InMemoryOrderRepository } from "./__test__/fakes";

async function setup() {
  const orders = new InMemoryOrderRepository();
  const item = OrderItem.create({
    menuItemId: "m1",
    name: "Pizza",
    unitPrice: Money.fromDecimal(10, "ARS"),
    quantity: 2,
  });
  const order = Order.create({ id: "o-1", customerId: "c1", restaurantId: "r-1", items: [item] });
  order.confirm();
  await orders.save(order);
  const useCase = new TrackOrder(orders);
  return { useCase };
}

describe("TrackOrder", () => {
  it("el cliente dueño ve el estado y el total de su pedido", async () => {
    const { useCase } = await setup();
    const tracking = await useCase.execute({ orderId: "o-1", customerId: "c1" });
    expect(tracking.status).toBe("CONFIRMADO");
    expect(tracking.total.equals(Money.fromDecimal(20, "ARS"))).toBe(true);
    expect(tracking.delivererId).toBeNull();
  });

  it("rechaza si el pedido no es del cliente", async () => {
    const { useCase } = await setup();
    await expect(useCase.execute({ orderId: "o-1", customerId: "otro" })).rejects.toThrow();
  });

  it("rechaza si el pedido no existe", async () => {
    const { useCase } = await setup();
    await expect(useCase.execute({ orderId: "nope", customerId: "c1" })).rejects.toThrow();
  });
});
