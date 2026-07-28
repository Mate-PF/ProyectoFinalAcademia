import { describe, it, expect } from "vitest";
import { ListRestaurants } from "./ListRestaurants";
import { Restaurant } from "../entities/Restaurant";
import { Address } from "../value-objects/Address";
import { InMemoryRestaurantRepository } from "./__test__/fakes";

const address = Address.create({ street: "Corrientes", number: "1000", city: "CABA", postalCode: "1043" });

describe("ListRestaurants", () => {
  it("devuelve todos los restaurantes", async () => {
    const restaurants = new InMemoryRestaurantRepository();
    await restaurants.save(Restaurant.create({ id: "r1", name: "Pizza", ownerId: "u1", address }));
    await restaurants.save(Restaurant.create({ id: "r2", name: "Sushi", ownerId: "u1", address }));

    const result = await new ListRestaurants(restaurants).execute();

    expect(result.map((r) => r.id).sort()).toEqual(["r1", "r2"]);
  });

  it("devuelve lista vacía si no hay restaurantes", async () => {
    const result = await new ListRestaurants(new InMemoryRestaurantRepository()).execute();
    expect(result).toEqual([]);
  });
});
