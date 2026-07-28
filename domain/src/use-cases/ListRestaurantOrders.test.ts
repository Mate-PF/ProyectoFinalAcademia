import { describe, it, expect } from "vitest";
import { ListRestaurantOrders } from "./ListRestaurantOrders";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Restaurant } from "../entities/Restaurant";
import { Address } from "../value-objects/Address";
import { Money } from "../value-objects/Money";
import { InMemoryOrderRepository, InMemoryRestaurantRepository } from "./__test__/fakes";

const address = Address.create({ street: "a", number: "1", city: "CABA", postalCode: "1" });

function order(id: string, restaurantId: string): Order {
  return Order.create({
    id,
    customerId: "c1",
    restaurantId,
    items: [OrderItem.create({ menuItemId: "m", name: "Pizza", unitPrice: Money.fromDecimal(10, "ARS"), quantity: 1 })],
  });
}

describe("ListRestaurantOrders", () => {
  it("el dueño ve los pedidos de su restaurante", async () => {
    const restaurants = new InMemoryRestaurantRepository();
    const orders = new InMemoryOrderRepository();
    await restaurants.save(Restaurant.create({ id: "r1", name: "Pizza", ownerId: "admin1", address }));
    await orders.save(order("o1", "r1"));
    await orders.save(order("o2", "r2"));
    const result = await new ListRestaurantOrders(restaurants, orders).execute({ restaurantId: "r1", actorId: "admin1" });
    expect(result.map((o) => o.id)).toEqual(["o1"]);
  });

  it("rechaza si el actor no es el dueño", async () => {
    const restaurants = new InMemoryRestaurantRepository();
    await restaurants.save(Restaurant.create({ id: "r1", name: "Pizza", ownerId: "admin1", address }));
    await expect(
      new ListRestaurantOrders(restaurants, new InMemoryOrderRepository()).execute({ restaurantId: "r1", actorId: "otro" }),
    ).rejects.toThrow();
  });

  it("rechaza si el restaurante no existe", async () => {
    await expect(
      new ListRestaurantOrders(new InMemoryRestaurantRepository(), new InMemoryOrderRepository()).execute({
        restaurantId: "x",
        actorId: "a",
      }),
    ).rejects.toThrow();
  });
});
