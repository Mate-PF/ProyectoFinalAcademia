import { describe, it, expect } from "vitest";
import { RegisterUser } from "./RegisterUser";
import { InMemoryUserRepository, FakePasswordHasher, FixedIdGenerator } from "./__test__/fakes";

function setup() {
  const users = new InMemoryUserRepository();
  const hasher = new FakePasswordHasher();
  const ids = new FixedIdGenerator("u-123");
  const useCase = new RegisterUser(users, hasher, ids);
  return { users, hasher, ids, useCase };
}

const validInput = {
  name: "Juan",
  email: "Juan@Example.com",
  password: "supersecret",
  role: "CLIENTE" as const,
};

describe("RegisterUser", () => {
  it("registra un usuario nuevo y lo persiste", async () => {
    const { useCase, users } = setup();

    const user = await useCase.execute(validInput);

    expect(user.id).toBe("u-123");
    expect(user.email.value).toBe("juan@example.com"); // normalizado por el VO Email
    expect(user.role).toBe("CLIENTE");
    expect(await users.findById("u-123")).not.toBeNull();
  });

  it("hashea la contraseña (nunca guarda texto plano)", async () => {
    const { useCase } = setup();

    const user = await useCase.execute(validInput);

    expect(user.passwordHash).not.toBe("supersecret");
    expect(user.passwordHash).toBe("hashed:supersecret");
  });

  it("rechaza si el email ya está registrado", async () => {
    const { useCase } = setup();

    await useCase.execute(validInput);

    await expect(useCase.execute(validInput)).rejects.toThrow();
  });

  it("rechaza un email con formato inválido", async () => {
    const { useCase } = setup();

    await expect(useCase.execute({ ...validInput, email: "no-es-un-email" })).rejects.toThrow();
  });

  it("rechaza una contraseña demasiado corta", async () => {
    const { useCase } = setup();

    await expect(useCase.execute({ ...validInput, password: "corta" })).rejects.toThrow();
  });
});
