import { describe, it, expect } from "vitest";
import { Checkout } from "./Checkout";
import { Cart } from "../entities/Cart";
import { MenuItem } from "../entities/MenuItem";
import { Money } from "../value-objects/Money";
import { InMemoryCartRepository, InMemoryOrderRepository, FixedIdGenerator } from "./__test__/fakes";

function setup() {
  const carts = new InMemoryCartRepository();
  const orders = new InMemoryOrderRepository();
  const ids = new FixedIdGenerator("o-1");
  const useCase = new Checkout(carts, orders, ids);
  return { carts, orders, useCase };
}

async function seedCartWithItems(carts: InMemoryCartRepository): Promise<void> {
  const cart = Cart.create({ id: "cart-1", customerId: "c1", restaurantId: "r-1" });
  cart.addItem(
    MenuItem.create({ id: "a", restaurantId: "r-1", name: "Pizza", price: Money.fromDecimal(10, "ARS") }),
    2,
  );
  await carts.save(cart);
}

describe("Checkout", () => {
  it("crea el pedido desde el carrito, lo persiste y vacía el carrito", async () => {
    const { carts, orders, useCase } = setup();
    await seedCartWithItems(carts);

    const order = await useCase.execute({ customerId: "c1" });

    expect(order.id).toBe("o-1");
    expect(order.status).toBe("PENDIENTE");
    expect(order.total().equals(Money.fromDecimal(20, "ARS"))).toBe(true);
    expect(await orders.findById("o-1")).not.toBeNull();

    const cart = await carts.findByCustomer("c1");
    expect(cart?.isEmpty()).toBe(true);
  });

  it("rechaza si el cliente no tiene carrito", async () => {
    const { useCase } = setup();
    await expect(useCase.execute({ customerId: "c1" })).rejects.toThrow();
  });

  it("rechaza si el carrito está vacío", async () => {
    const { carts, useCase } = setup();
    await carts.save(Cart.create({ id: "cart-1", customerId: "c1", restaurantId: "r-1" }));
    await expect(useCase.execute({ customerId: "c1" })).rejects.toThrow();
  });
});
