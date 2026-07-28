import { describe, it, expect } from "vitest";
import { ViewCart } from "./ViewCart";
import { Cart } from "../entities/Cart";
import { MenuItem } from "../entities/MenuItem";
import { Money } from "../value-objects/Money";
import { InMemoryCartRepository } from "./__test__/fakes";

describe("ViewCart", () => {
  it("devuelve null si el cliente no tiene carrito", async () => {
    const carts = new InMemoryCartRepository();
    const view = await new ViewCart(carts).execute("c1");
    expect(view).toBeNull();
  });

  it("devuelve el carrito con el total calculado", async () => {
    const carts = new InMemoryCartRepository();
    const cart = Cart.create({ id: "cart-1", customerId: "c1", restaurantId: "r-1" });
    cart.addItem(
      MenuItem.create({ id: "a", restaurantId: "r-1", name: "Pizza", price: Money.fromDecimal(10, "ARS") }),
      2,
    );
    await carts.save(cart);

    const view = await new ViewCart(carts).execute("c1");

    expect(view?.items).toHaveLength(1);
    expect(view?.total?.cents).toBe(2000);
  });

  it("el total es null en un carrito vacío", async () => {
    const carts = new InMemoryCartRepository();
    await carts.save(Cart.create({ id: "cart-1", customerId: "c1", restaurantId: "r-1" }));

    const view = await new ViewCart(carts).execute("c1");

    expect(view).not.toBeNull();
    expect(view?.total).toBeNull();
  });
});
