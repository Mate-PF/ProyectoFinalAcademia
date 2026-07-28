import { describe, it, expect } from "vitest";
import { AddToCart } from "./AddToCart";
import { MenuItem, type MenuItemProps } from "../entities/MenuItem";
import { Money } from "../value-objects/Money";
import { InMemoryCartRepository, InMemoryMenuItemRepository, FixedIdGenerator } from "./__test__/fakes";

function makeMenuItem(overrides: Partial<MenuItemProps> = {}): MenuItem {
  return MenuItem.create({
    id: "mi-1",
    restaurantId: "r-1",
    name: "Pizza",
    price: Money.fromDecimal(10, "ARS"),
    ...overrides,
  });
}

function setup() {
  const carts = new InMemoryCartRepository();
  const menuItems = new InMemoryMenuItemRepository();
  const ids = new FixedIdGenerator("cart-1");
  const useCase = new AddToCart(carts, menuItems, ids);
  return { carts, menuItems, useCase };
}

describe("AddToCart", () => {
  it("crea el carrito y agrega el ítem si el cliente no tenía uno", async () => {
    const { menuItems, carts, useCase } = setup();
    await menuItems.save(makeMenuItem());

    const cart = await useCase.execute({ customerId: "c1", menuItemId: "mi-1", quantity: 2 });

    expect(cart.id).toBe("cart-1");
    expect(cart.items).toHaveLength(1);
    expect(cart.total().cents).toBe(2000);
    expect(await carts.findByCustomer("c1")).not.toBeNull();
  });

  it("acumula la cantidad al agregar el mismo ítem", async () => {
    const { menuItems, useCase } = setup();
    await menuItems.save(makeMenuItem());

    await useCase.execute({ customerId: "c1", menuItemId: "mi-1", quantity: 1 });
    const cart = await useCase.execute({ customerId: "c1", menuItemId: "mi-1", quantity: 2 });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(3);
  });

  it("rechaza si el ítem no existe", async () => {
    const { useCase } = setup();
    await expect(useCase.execute({ customerId: "c1", menuItemId: "nope" })).rejects.toThrow();
  });

  it("rechaza agregar un ítem de otro restaurante al carrito existente", async () => {
    const { menuItems, useCase } = setup();
    await menuItems.save(makeMenuItem({ id: "mi-1", restaurantId: "r-1" }));
    await menuItems.save(makeMenuItem({ id: "mi-2", restaurantId: "r-2", name: "Sushi" }));

    await useCase.execute({ customerId: "c1", menuItemId: "mi-1" });
    await expect(useCase.execute({ customerId: "c1", menuItemId: "mi-2" })).rejects.toThrow();
  });

  it("rechaza un ítem no disponible", async () => {
    const { menuItems, useCase } = setup();
    await menuItems.save(makeMenuItem({ available: false }));
    await expect(useCase.execute({ customerId: "c1", menuItemId: "mi-1" })).rejects.toThrow();
  });
});
