import { describe, it, expect } from "vitest";
import { Email } from "./Email";

describe("Email", () => {
  it("crea un email válido y expone su valor", () => {
    expect(Email.create("juan@example.com").value).toBe("juan@example.com");
  });

  it("normaliza recortando espacios y pasando a minúsculas", () => {
    expect(Email.create("  Juan.Perez@Example.COM  ").value).toBe("juan.perez@example.com");
  });

  it("dos emails con el mismo valor normalizado son iguales", () => {
    expect(Email.create("A@B.com").equals(Email.create("a@b.com"))).toBe(true);
  });

  it("emails distintos no son iguales", () => {
    expect(Email.create("a@b.com").equals(Email.create("c@d.com"))).toBe(false);
  });

  it.each([
    ["", "vacío"],
    ["sinarroba.com", "sin @"],
    ["a@b", "sin dominio de nivel superior"],
    ["a b@c.com", "con espacios"],
    ["@b.com", "sin parte local"],
    ["a@.com", "sin dominio"],
  ])("rechaza un email inválido: %s (%s)", (raw) => {
    expect(() => Email.create(raw)).toThrow();
  });

  it("se muestra como su valor", () => {
    expect(Email.create("juan@example.com").toString()).toBe("juan@example.com");
  });
});
