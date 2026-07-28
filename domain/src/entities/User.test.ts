import { describe, it, expect } from "vitest";
import { User, type UserRole } from "./User";
import { Email } from "../value-objects/Email";

const base = {
  id: "u1",
  name: "Juan Pérez",
  email: Email.create("juan@example.com"),
  role: "CLIENTE" as UserRole,
  passwordHash: "hashed-secret",
};

describe("User", () => {
  it("crea un usuario y expone sus campos", () => {
    const u = User.create(base);
    expect(u.id).toBe("u1");
    expect(u.name).toBe("Juan Pérez");
    expect(u.email.value).toBe("juan@example.com");
    expect(u.role).toBe("CLIENTE");
    expect(u.passwordHash).toBe("hashed-secret");
  });

  it("recorta el nombre y rechaza uno vacío", () => {
    expect(User.create({ ...base, name: "  Ana  " }).name).toBe("Ana");
    expect(() => User.create({ ...base, name: "   " })).toThrow();
  });

  it("rechaza un rol inválido (dato externo fuera del type system)", () => {
    expect(() => User.create({ ...base, role: "HACKER" as UserRole })).toThrow();
  });

  it("rechaza un hash de contraseña vacío", () => {
    expect(() => User.create({ ...base, passwordHash: "" })).toThrow();
  });

  it("expone helpers de rol", () => {
    expect(User.create({ ...base, role: "ADMIN" }).isAdmin()).toBe(true);
    expect(User.create({ ...base, role: "REPARTIDOR" }).isRepartidor()).toBe(true);
    expect(User.create({ ...base, role: "CLIENTE" }).isCliente()).toBe(true);
    expect(User.create({ ...base, role: "CLIENTE" }).hasRole("CLIENTE")).toBe(true);
    expect(User.create({ ...base, role: "CLIENTE" }).hasRole("ADMIN")).toBe(false);
  });
});
