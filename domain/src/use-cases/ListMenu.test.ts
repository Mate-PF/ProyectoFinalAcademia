import { describe, it, expect } from "vitest";
import { ListMenu } from "./ListMenu";
import { Restaurant } from "../entities/Restaurant";
import { MenuItem } from "../entities/MenuItem";
import { Address } from "../value-objects/Address";
import { Money } from "../value-objects/Money";
import { InMemoryRestaurantRepository, InMemoryMenuItemRepository } from "./__test__/fakes";

const address = Address.create({ street: "Corrientes", number: "1000", city: "CABA", postalCode: "1043" });

async function setup() {
  const restaurants = new InMemoryRestaurantRepository();
  const menuItems = new InMemoryMenuItemRepository();
  await restaurants.save(Restaurant.create({ id: "r-1", name: "La Pizzería", ownerId: "u-admin", address }));
  await menuItems.save(
    MenuItem.create({ id: "a", restaurantId: "r-1", name: "Muzza", price: Money.fromDecimal(1500, "ARS") }),
  );
  await menuItems.save(
    MenuItem.create({
      id: "b",
      restaurantId: "r-1",
      name: "Napo",
      price: Money.fromDecimal(1800, "ARS"),
      available: false,
    }),
  );
  // Ítem de OTRO restaurante: no debe aparecer.
  await menuItems.save(
    MenuItem.create({ id: "c", restaurantId: "r-2", name: "Otro", price: Money.fromDecimal(100, "ARS") }),
  );
  const useCase = new ListMenu(restaurants, menuItems);
  return { useCase };
}

describe("ListMenu", () => {
  it("por defecto lista solo los ítems disponibles del restaurante", async () => {
    const { useCase } = await setup();
    const items = await useCase.execute({ restaurantId: "r-1" });
    expect(items.map((i) => i.id)).toEqual(["a"]);
  });

  it("con includeUnavailable devuelve también los no disponibles", async () => {
    const { useCase } = await setup();
    const items = await useCase.execute({ restaurantId: "r-1", includeUnavailable: true });
    expect(items.map((i) => i.id).sort()).toEqual(["a", "b"]);
  });

  it("rechaza si el restaurante no existe", async () => {
    const { useCase } = await setup();
    await expect(useCase.execute({ restaurantId: "no-existe" })).rejects.toThrow();
  });
});
