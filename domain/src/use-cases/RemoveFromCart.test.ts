import { describe, it, expect } from "vitest";
import { RemoveFromCart } from "./RemoveFromCart";
import { Cart } from "../entities/Cart";
import { MenuItem } from "../entities/MenuItem";
import { Money } from "../value-objects/Money";
import { InMemoryCartRepository } from "./__test__/fakes";

function seededCart(): Cart {
  const cart = Cart.create({ id: "cart-1", customerId: "c1", restaurantId: "r-1" });
  cart.addItem(MenuItem.create({ id: "a", restaurantId: "r-1", name: "Pizza", price: Money.fromDecimal(10, "ARS") }));
  cart.addItem(MenuItem.create({ id: "b", restaurantId: "r-1", name: "Emp", price: Money.fromDecimal(5, "ARS") }));
  return cart;
}

describe("RemoveFromCart", () => {
  it("quita un ítem del carrito", async () => {
    const carts = new InMemoryCartRepository();
    await carts.save(seededCart());
    const useCase = new RemoveFromCart(carts);

    const cart = await useCase.execute({ customerId: "c1", menuItemId: "a" });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.menuItemId).toBe("b");
  });

  it("rechaza si el cliente no tiene carrito", async () => {
    const carts = new InMemoryCartRepository();
    const useCase = new RemoveFromCart(carts);
    await expect(useCase.execute({ customerId: "x", menuItemId: "a" })).rejects.toThrow();
  });
});
