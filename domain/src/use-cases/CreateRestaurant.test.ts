import { describe, it, expect } from "vitest";
import { CreateRestaurant } from "./CreateRestaurant";
import { User, type UserRole } from "../entities/User";
import { Email } from "../value-objects/Email";
import {
  InMemoryUserRepository,
  InMemoryRestaurantRepository,
  FixedIdGenerator,
} from "./__test__/fakes";

function setup() {
  const users = new InMemoryUserRepository();
  const restaurants = new InMemoryRestaurantRepository();
  const ids = new FixedIdGenerator("r-1");
  const useCase = new CreateRestaurant(users, restaurants, ids);
  return { users, restaurants, useCase };
}

async function seedUser(users: InMemoryUserRepository, id: string, role: UserRole): Promise<void> {
  await users.save(
    User.create({
      id,
      name: "Dueño",
      email: Email.create(`${id}@example.com`),
      role,
      passwordHash: "hashed:x",
    }),
  );
}

const validInput = {
  ownerId: "u-admin",
  name: "La Pizzería",
  address: { street: "Corrientes", number: "1000", city: "CABA", postalCode: "1043" },
};

describe("CreateRestaurant", () => {
  it("un ADMIN crea el restaurante y queda persistido", async () => {
    const { users, restaurants, useCase } = setup();
    await seedUser(users, "u-admin", "ADMIN");

    const restaurant = await useCase.execute(validInput);

    expect(restaurant.id).toBe("r-1");
    expect(restaurant.name).toBe("La Pizzería");
    expect(restaurant.isOwnedBy("u-admin")).toBe(true);
    expect(await restaurants.findById("r-1")).not.toBeNull();
  });

  it("rechaza si el dueño no existe", async () => {
    const { useCase } = setup();
    await expect(useCase.execute(validInput)).rejects.toThrow();
  });

  it("rechaza si el usuario no es ADMIN", async () => {
    const { users, useCase } = setup();
    await seedUser(users, "u-admin", "CLIENTE");
    await expect(useCase.execute(validInput)).rejects.toThrow();
  });
});
