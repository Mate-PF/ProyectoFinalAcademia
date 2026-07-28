import type { Repositories } from "../../container";
import {
  InMemoryUserRepository,
  InMemoryRestaurantRepository,
  InMemoryMenuItemRepository,
  InMemoryCartRepository,
  InMemoryOrderRepository,
} from "./repositories";

/** Construye el set de repositorios en memoria (persistencia por defecto). */
export function buildInMemoryRepositories(): Repositories {
  return {
    users: new InMemoryUserRepository(),
    restaurants: new InMemoryRestaurantRepository(),
    menuItems: new InMemoryMenuItemRepository(),
    carts: new InMemoryCartRepository(),
    orders: new InMemoryOrderRepository(),
  };
}
