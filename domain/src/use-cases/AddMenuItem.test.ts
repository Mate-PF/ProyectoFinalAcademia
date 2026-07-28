import { describe, it, expect } from "vitest";
import { AddMenuItem } from "./AddMenuItem";
import { Restaurant } from "../entities/Restaurant";
import { Address } from "../value-objects/Address";
import { Money } from "../value-objects/Money";
import {
  InMemoryRestaurantRepository,
  InMemoryMenuItemRepository,
  FixedIdGenerator,
} from "./__test__/fakes";

const address = Address.create({ street: "Corrientes", number: "1000", city: "CABA", postalCode: "1043" });

function setup() {
  const restaurants = new InMemoryRestaurantRepository();
  const menuItems = new InMemoryMenuItemRepository();
  const ids = new FixedIdGenerator("mi-1");
  const useCase = new AddMenuItem(restaurants, menuItems, ids);
  return { restaurants, menuItems, useCase };
}

async function seedRestaurant(restaurants: InMemoryRestaurantRepository): Promise<void> {
  await restaurants.save(
    Restaurant.create({ id: "r-1", name: "La Pizzería", ownerId: "u-admin", address }),
  );
}

const validInput = { actorId: "u-admin", restaurantId: "r-1", name: "Muzzarella", price: 1500, currency: "ARS" };

describe("AddMenuItem", () => {
  it("el dueño agrega un ítem y queda persistido con su precio", async () => {
    const { restaurants, menuItems, useCase } = setup();
    await seedRestaurant(restaurants);

    const item = await useCase.execute(validInput);

    expect(item.id).toBe("mi-1");
    expect(item.name).toBe("Muzzarella");
    expect(item.price.equals(Money.fromDecimal(1500, "ARS"))).toBe(true);
    expect(await menuItems.findById("mi-1")).not.toBeNull();
  });

  it("rechaza si el restaurante no existe", async () => {
    const { useCase } = setup();
    await expect(useCase.execute(validInput)).rejects.toThrow();
  });

  it("rechaza si el actor no es el dueño", async () => {
    const { restaurants, useCase } = setup();
    await seedRestaurant(restaurants);
    await expect(useCase.execute({ ...validInput, actorId: "otro" })).rejects.toThrow();
  });
});
