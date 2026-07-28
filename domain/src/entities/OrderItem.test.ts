import { describe, it, expect } from "vitest";
import { OrderItem } from "./OrderItem";
import { Money } from "../value-objects/Money";

const validProps = {
  menuItemId: "m1",
  name: "Pizza Muzzarella",
  unitPrice: Money.fromDecimal(12.5, "ARS"),
  quantity: 2,
};

describe("OrderItem", () => {
  it("crea una línea y expone sus campos (snapshot de nombre y precio)", () => {
    const item = OrderItem.create(validProps);
    expect(item.menuItemId).toBe("m1");
    expect(item.name).toBe("Pizza Muzzarella");
    expect(item.unitPrice.equals(Money.fromDecimal(12.5, "ARS"))).toBe(true);
    expect(item.quantity).toBe(2);
  });

  it("calcula el subtotal como precio unitario × cantidad", () => {
    expect(OrderItem.create(validProps).subtotal().cents).toBe(2500);
  });

  it("recorta el nombre y rechaza uno vacío", () => {
    expect(OrderItem.create({ ...validProps, name: "  Empanada  " }).name).toBe("Empanada");
    expect(() => OrderItem.create({ ...validProps, name: "   " })).toThrow();
  });

  it.each([0, -1, 1.5])("rechaza cantidades inválidas: %s", (quantity) => {
    expect(() => OrderItem.create({ ...validProps, quantity })).toThrow();
  });
});
