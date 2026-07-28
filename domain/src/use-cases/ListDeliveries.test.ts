import { describe, it, expect } from "vitest";
import { ListDeliveries } from "./ListDeliveries";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Money } from "../value-objects/Money";
import { InMemoryOrderRepository } from "./__test__/fakes";

function delivery(id: string, delivererId: string | null): Order {
  return Order.rehydrate({
    id,
    customerId: "c1",
    restaurantId: "r1",
    items: [OrderItem.create({ menuItemId: "m", name: "Pizza", unitPrice: Money.fromDecimal(10, "ARS"), quantity: 1 })],
    status: "EN_CAMINO",
    delivererId,
  });
}

describe("ListDeliveries", () => {
  it("devuelve solo las entregas asignadas al repartidor", async () => {
    const orders = new InMemoryOrderRepository();
    await orders.save(delivery("o1", "rep1"));
    await orders.save(delivery("o2", "rep2"));
    await orders.save(delivery("o3", "rep1"));
    const result = await new ListDeliveries(orders).execute({ delivererId: "rep1" });
    expect(result.map((o) => o.id).sort()).toEqual(["o1", "o3"]);
  });
});
