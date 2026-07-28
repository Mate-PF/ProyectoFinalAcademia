import { describe, it, expect } from "vitest";
import { MenuItem } from "./MenuItem";
import { Money } from "../value-objects/Money";

const base = { id: "mi1", restaurantId: "r1", name: "Muzzarella", price: Money.fromDecimal(1500, "ARS") };

describe("MenuItem", () => {
  it("crea un ítem disponible por defecto", () => {
    const item = MenuItem.create(base);
    expect(item.name).toBe("Muzzarella");
    expect(item.price.equals(Money.fromDecimal(1500, "ARS"))).toBe(true);
    expect(item.available).toBe(true);
  });

  it("permite crearlo no disponible", () => {
    expect(MenuItem.create({ ...base, available: false }).available).toBe(false);
  });

  it("recorta el nombre y rechaza uno vacío", () => {
    expect(MenuItem.create({ ...base, name: "  Napolitana  " }).name).toBe("Napolitana");
    expect(() => MenuItem.create({ ...base, name: "   " })).toThrow();
  });

  it("rechaza un precio no positivo", () => {
    expect(() => MenuItem.create({ ...base, price: Money.fromDecimal(0, "ARS") })).toThrow();
    expect(() => MenuItem.create({ ...base, price: Money.fromDecimal(-1, "ARS") })).toThrow();
  });

  it("cambia el precio y rechaza uno no positivo", () => {
    const item = MenuItem.create(base);
    item.changePrice(Money.fromDecimal(1800, "ARS"));
    expect(item.price.equals(Money.fromDecimal(1800, "ARS"))).toBe(true);
    expect(() => item.changePrice(Money.fromDecimal(0, "ARS"))).toThrow();
  });

  it("alterna disponibilidad", () => {
    const item = MenuItem.create(base);
    item.markUnavailable();
    expect(item.available).toBe(false);
    item.markAvailable();
    expect(item.available).toBe(true);
  });
});
