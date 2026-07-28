import { describe, it, expect } from "vitest";
import { AssignDeliverer } from "./AssignDeliverer";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { User, type UserRole } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Money } from "../value-objects/Money";
import { InMemoryOrderRepository, InMemoryUserRepository } from "./__test__/fakes";

function makeConfirmedOrder(): Order {
  const item = OrderItem.create({
    menuItemId: "m1",
    name: "Pizza",
    unitPrice: Money.fromDecimal(10, "ARS"),
    quantity: 1,
  });
  const order = Order.create({ id: "o-1", customerId: "c1", restaurantId: "r-1", items: [item] });
  order.confirm(); // CONFIRMADO: estado válido para asignar repartidor
  return order;
}

async function setup(delivererRole: UserRole = "REPARTIDOR") {
  const orders = new InMemoryOrderRepository();
  const users = new InMemoryUserRepository();
  await orders.save(makeConfirmedOrder());
  await users.save(
    User.create({
      id: "rep-1",
      name: "Repa",
      email: Email.create("rep@example.com"),
      role: delivererRole,
      passwordHash: "hashed:x",
    }),
  );
  const useCase = new AssignDeliverer(orders, users);
  return { orders, useCase };
}

describe("AssignDeliverer", () => {
  it("un ADMIN asigna un repartidor válido", async () => {
    const { orders, useCase } = await setup();
    await useCase.execute({ orderId: "o-1", actorRole: "ADMIN", delivererId: "rep-1" });
    expect((await orders.findById("o-1"))?.delivererId).toBe("rep-1");
  });

  it("rechaza si el actor no es ADMIN", async () => {
    const { useCase } = await setup();
    await expect(
      useCase.execute({ orderId: "o-1", actorRole: "CLIENTE", delivererId: "rep-1" }),
    ).rejects.toThrow();
  });

  it("rechaza si el usuario asignado no tiene rol REPARTIDOR", async () => {
    const { useCase } = await setup("CLIENTE"); // rep-1 existe pero es CLIENTE
    await expect(
      useCase.execute({ orderId: "o-1", actorRole: "ADMIN", delivererId: "rep-1" }),
    ).rejects.toThrow();
  });

  it("rechaza si el pedido no existe", async () => {
    const { useCase } = await setup();
    await expect(
      useCase.execute({ orderId: "nope", actorRole: "ADMIN", delivererId: "rep-1" }),
    ).rejects.toThrow();
  });
});
