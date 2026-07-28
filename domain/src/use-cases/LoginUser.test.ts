import { describe, it, expect } from "vitest";
import { LoginUser } from "./LoginUser";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { InMemoryUserRepository, FakePasswordHasher, FakeTokenGenerator } from "./__test__/fakes";

function setup() {
  const users = new InMemoryUserRepository();
  const hasher = new FakePasswordHasher();
  const tokens = new FakeTokenGenerator();
  const useCase = new LoginUser(users, hasher, tokens);
  return { users, useCase };
}

async function seedUser(users: InMemoryUserRepository): Promise<User> {
  const user = User.create({
    id: "u-1",
    name: "Juan",
    email: Email.create("juan@example.com"),
    role: "CLIENTE",
    passwordHash: "hashed:supersecret", // coincide con FakePasswordHasher.compare
  });
  await users.save(user);
  return user;
}

describe("LoginUser", () => {
  it("loguea con credenciales correctas y devuelve token + usuario", async () => {
    const { users, useCase } = setup();
    await seedUser(users);

    const result = await useCase.execute({ email: "Juan@Example.com", password: "supersecret" });

    expect(result.user.id).toBe("u-1");
    expect(result.token).toBe("token:u-1:CLIENTE");
  });

  it("rechaza con contraseña incorrecta", async () => {
    const { users, useCase } = setup();
    await seedUser(users);

    await expect(useCase.execute({ email: "juan@example.com", password: "wrong" })).rejects.toThrow();
  });

  it("rechaza si el email no existe", async () => {
    const { useCase } = setup();

    await expect(useCase.execute({ email: "nadie@example.com", password: "supersecret" })).rejects.toThrow();
  });

  it("trata un email con formato inválido como credenciales inválidas", async () => {
    const { useCase } = setup();

    await expect(useCase.execute({ email: "no-es-email", password: "supersecret" })).rejects.toThrow();
  });
});
