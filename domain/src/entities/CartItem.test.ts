import { describe, it, expect } from "vitest";
import { CartItem } from "./CartItem";
import { MenuItem } from "./MenuItem";
import { Money } from "../value-objects/Money";

const menuItem = MenuItem.create({
  id: "mi1",
  restaurantId: "r1",
  name: "Pizza",
  price: Money.fromDecimal(10, "ARS"),
});

describe("CartItem", () => {
  it("crea una línea y expone menuItemId y cantidad", () => {
    const line = CartItem.create(menuItem, 3);
    expect(line.menuItemId).toBe("mi1");
    expect(line.quantity).toBe(3);
  });

  it("subtotal = precio actual del ítem × cantidad", () => {
    expect(CartItem.create(menuItem, 3).subtotal().cents).toBe(3000);
  });

  it.each([0, -1, 2.5])("rechaza cantidad inválida: %s", (q) => {
    expect(() => CartItem.create(menuItem, q)).toThrow();
  });

  it("withQuantity devuelve una nueva línea con otra cantidad (inmutable)", () => {
    const a = CartItem.create(menuItem, 1);
    const b = a.withQuantity(5);
    expect(b.quantity).toBe(5);
    expect(a.quantity).toBe(1);
  });
});
