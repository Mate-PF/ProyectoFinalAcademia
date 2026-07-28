import { describe, it, expect } from "vitest";
import { Address, type AddressProps } from "./Address";

const base: AddressProps = {
  street: "Av. Siempreviva",
  number: "742",
  city: "Springfield",
  postalCode: "1000",
};

describe("Address", () => {
  it("crea una dirección y expone sus campos", () => {
    const a = Address.create(base);
    expect(a.street).toBe("Av. Siempreviva");
    expect(a.number).toBe("742");
    expect(a.city).toBe("Springfield");
    expect(a.postalCode).toBe("1000");
  });

  it("recorta espacios en los campos", () => {
    const a = Address.create({ street: "  Calle  ", number: " 10 ", city: " Rosario ", postalCode: " 2000 " });
    expect(a.street).toBe("Calle");
    expect(a.number).toBe("10");
    expect(a.city).toBe("Rosario");
    expect(a.postalCode).toBe("2000");
  });

  it("dos direcciones con los mismos campos son iguales (value object)", () => {
    expect(Address.create(base).equals(Address.create(base))).toBe(true);
  });

  it("direcciones con algún campo distinto no son iguales", () => {
    expect(Address.create(base).equals(Address.create({ ...base, number: "743" }))).toBe(false);
  });

  it.each(["street", "number", "city", "postalCode"] as const)(
    "rechaza si falta el campo obligatorio: %s",
    (field) => {
      expect(() => Address.create({ ...base, [field]: "   " })).toThrow();
    },
  );

  it("se muestra de forma legible", () => {
    expect(Address.create(base).toString()).toBe("Av. Siempreviva 742, Springfield (1000)");
  });
});
