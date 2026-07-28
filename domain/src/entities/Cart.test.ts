import { describe, it, expect } from "vitest";
import { Cart } from "./Cart";
import { MenuItem, type MenuItemProps } from "./MenuItem";
import { Money } from "../value-objects/Money";

function makeMenuItem(overrides: Partial<MenuItemProps> = {}): MenuItem {
  return MenuItem.create({
    id: "mi1",
    restaurantId: "r1",
    name: "Pizza",
    price: Money.fromDecimal(10, "ARS"),
    ...overrides,
  });
}

function makeCart(): Cart {
  return Cart.create({ id: "cart1", customerId: "c1", restaurantId: "r1" });
}

describe("Cart", () => {
  describe("creación", () => {
    it("nace vacío", () => {
      const cart = makeCart();
      expect(cart.isEmpty()).toBe(true);
      expect(cart.items).toHaveLength(0);
    });

    it("rechaza ids vacíos", () => {
      expect(() => Cart.create({ id: "", customerId: "c1", restaurantId: "r1" })).toThrow();
      expect(() => Cart.create({ id: "cart1", customerId: "", restaurantId: "r1" })).toThrow();
      expect(() => Cart.create({ id: "cart1", customerId: "c1", restaurantId: "" })).toThrow();
    });
  });

  describe("agregar / quitar", () => {
    it("agrega un ítem y calcula el total", () => {
      const cart = makeCart();
      cart.addItem(makeMenuItem(), 2);
      expect(cart.items).toHaveLength(1);
      expect(cart.total().cents).toBe(2000);
    });

    it("acumula cantidad si el ítem ya está (no duplica la línea)", () => {
      const cart = makeCart();
      const item = makeMenuItem();
      cart.addItem(item, 1);
      cart.addItem(item, 2);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]?.quantity).toBe(3);
    });

    it("rechaza ítems de otro restaurante", () => {
      const cart = makeCart();
      expect(() => cart.addItem(makeMenuItem({ id: "x", restaurantId: "r2" }))).toThrow();
    });

    it("rechaza ítems no disponibles", () => {
      const cart = makeCart();
      expect(() => cart.addItem(makeMenuItem({ available: false }))).toThrow();
    });

    it("quita un ítem por id", () => {
      const cart = makeCart();
      cart.addItem(makeMenuItem({ id: "a" }));
      cart.addItem(makeMenuItem({ id: "b", name: "Empanada" }));
      cart.removeItem("a");
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]?.menuItemId).toBe("b");
    });

    it("clear vacía el carrito", () => {
      const cart = makeCart();
      cart.addItem(makeMenuItem());
      cart.clear();
      expect(cart.isEmpty()).toBe(true);
    });
  });

  describe("total", () => {
    it("suma los subtotales de las líneas", () => {
      const cart = makeCart();
      cart.addItem(makeMenuItem({ id: "a", price: Money.fromDecimal(10, "ARS") }), 2);
      cart.addItem(makeMenuItem({ id: "b", name: "Emp", price: Money.fromDecimal(5, "ARS") }), 1);
      expect(cart.total().equals(Money.fromDecimal(25, "ARS"))).toBe(true);
    });

    it("falla en un carrito vacío", () => {
      expect(() => makeCart().total()).toThrow();
    });
  });

  describe("checkout", () => {
    it("convierte el carrito en un Order PENDIENTE con mismo cliente/restaurante y total", () => {
      const cart = makeCart();
      cart.addItem(makeMenuItem({ price: Money.fromDecimal(10, "ARS") }), 2);
      const order = cart.checkout("o1");
      expect(order.id).toBe("o1");
      expect(order.status).toBe("PENDIENTE");
      expect(order.customerId).toBe("c1");
      expect(order.restaurantId).toBe("r1");
      expect(order.total().equals(Money.fromDecimal(20, "ARS"))).toBe(true);
    });

    it("snapshotea el precio: si el menú cambia después, el pedido no cambia", () => {
      const cart = makeCart();
      const item = makeMenuItem({ price: Money.fromDecimal(10, "ARS") });
      cart.addItem(item, 1);
      const order = cart.checkout("o1");
      item.changePrice(Money.fromDecimal(99, "ARS")); // cambia el menú DESPUÉS del checkout
      expect(order.total().equals(Money.fromDecimal(10, "ARS"))).toBe(true);
    });

    it("no permite checkout de un carrito vacío", () => {
      expect(() => makeCart().checkout("o1")).toThrow();
    });
  });
});
