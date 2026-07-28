import { describe, it, expect } from "vitest";
import { Restaurant } from "./Restaurant";
import { Address } from "../value-objects/Address";

const address = Address.create({ street: "Corrientes", number: "1000", city: "CABA", postalCode: "1043" });
const base = { id: "r1", name: "La Pizzería", ownerId: "u-admin", address };

describe("Restaurant", () => {
  it("crea un restaurante y expone sus campos", () => {
    const r = Restaurant.create(base);
    expect(r.id).toBe("r1");
    expect(r.name).toBe("La Pizzería");
    expect(r.ownerId).toBe("u-admin");
    expect(r.address.city).toBe("CABA");
  });

  it("recorta el nombre y rechaza uno vacío", () => {
    expect(Restaurant.create({ ...base, name: "  Sushi  " }).name).toBe("Sushi");
    expect(() => Restaurant.create({ ...base, name: "   " })).toThrow();
  });

  it("rechaza un restaurante sin dueño", () => {
    expect(() => Restaurant.create({ ...base, ownerId: "" })).toThrow();
  });

  it("sabe si pertenece a un usuario", () => {
    const r = Restaurant.create(base);
    expect(r.isOwnedBy("u-admin")).toBe(true);
    expect(r.isOwnedBy("otro")).toBe(false);
  });
});
