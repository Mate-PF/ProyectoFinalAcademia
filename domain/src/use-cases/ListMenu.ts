import type { MenuItem } from "../entities/MenuItem";
import type { RestaurantRepository } from "../services/RestaurantRepository";
import type { MenuItemRepository } from "../services/MenuItemRepository";

export interface ListMenuInput {
  restaurantId: string;
  /** Por defecto solo se listan los ítems disponibles (vista del cliente). */
  includeUnavailable?: boolean;
}

/**
 * Caso de uso: listar el menú de un restaurante. Por defecto devuelve solo los
 * ítems disponibles; con `includeUnavailable` devuelve todos (vista del admin).
 */
export class ListMenu {
  constructor(
    private readonly restaurants: RestaurantRepository,
    private readonly menuItems: MenuItemRepository,
  ) {}

  async execute(input: ListMenuInput): Promise<MenuItem[]> {
    const restaurant = await this.restaurants.findById(input.restaurantId);
    if (restaurant === null) {
      throw new Error("El restaurante no existe");
    }

    const items = await this.menuItems.findByRestaurant(input.restaurantId);
    if (input.includeUnavailable === true) {
      return items;
    }
    return items.filter((item) => item.available);
  }
}
