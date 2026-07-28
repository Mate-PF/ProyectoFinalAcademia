import { describe, it, expect } from "vitest";
import { ListMyOrders } from "./ListMyOrders";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Money } from "../value-objects/Money";
import { InMemoryOrderRepository } from "./__test__/fakes";

function order(id: string, customerId: string): Order {
  return Order.create({
    id,
    customerId,
    restaurantId: "r1",
    items: [OrderItem.create({ menuItemId: "m", name: "Pizza", unitPrice: Money.fromDecimal(10, "ARS"), quantity: 1 })],
  });
}

describe("ListMyOrders", () => {
  it("devuelve solo los pedidos del cliente", async () => {
    const orders = new InMemoryOrderRepository();
    await orders.save(order("o1", "c1"));
    await orders.save(order("o2", "c2"));
    await orders.save(order("o3", "c1"));
    const result = await new ListMyOrders(orders).execute({ customerId: "c1" });
    expect(result.map((o) => o.id).sort()).toEqual(["o1", "o3"]);
  });
});
