import { describe, it, expect } from "vitest";
import { ListDeliverers } from "./ListDeliverers";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { InMemoryUserRepository } from "./__test__/fakes";

function user(id: string, role: "CLIENTE" | "REPARTIDOR" | "ADMIN"): User {
  return User.create({ id, name: id, email: Email.create(`${id}@x.com`), role, passwordHash: "h" });
}

describe("ListDeliverers", () => {
  it("el ADMIN obtiene solo los repartidores", async () => {
    const users = new InMemoryUserRepository();
    await users.save(user("c1", "CLIENTE"));
    await users.save(user("r1", "REPARTIDOR"));
    await users.save(user("r2", "REPARTIDOR"));
    await users.save(user("a1", "ADMIN"));

    const result = await new ListDeliverers(users).execute({ actorRole: "ADMIN" });

    expect(result.map((u) => u.id).sort()).toEqual(["r1", "r2"]);
  });

  it("rechaza si el actor no es ADMIN", async () => {
    await expect(
      new ListDeliverers(new InMemoryUserRepository()).execute({ actorRole: "CLIENTE" }),
    ).rejects.toThrow();
  });
});
