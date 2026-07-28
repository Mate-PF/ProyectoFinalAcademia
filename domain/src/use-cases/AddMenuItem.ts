import { MenuItem } from "../entities/MenuItem";
import { Money } from "../value-objects/Money";
import type { RestaurantRepository } from "../services/RestaurantRepository";
import type { MenuItemRepository } from "../services/MenuItemRepository";
import type { IdGenerator } from "../services/IdGenerator";

export interface AddMenuItemInput {
  /** Quién intenta agregar el ítem: debe ser el dueño del restaurante. */
  actorId: string;
  restaurantId: string;
  name: string;
  price: number;
  currency: string;
}

/**
 * Caso de uso: agregar un ítem al menú de un restaurante.
 * Regla de negocio: solo el DUEÑO del restaurante puede modificar su menú.
 */
export class AddMenuItem {
  constructor(
    private readonly restaurants: RestaurantRepository,
    private readonly menuItems: MenuItemRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: AddMenuItemInput): Promise<MenuItem> {
    const restaurant = await this.restaurants.findById(input.restaurantId);
    if (restaurant === null) {
      throw new Error("El restaurante no existe");
    }
    if (!restaurant.isOwnedBy(input.actorId)) {
      throw new Error("Solo el dueño puede modificar el menú");
    }

    const item = MenuItem.create({
      id: this.ids.next(),
      restaurantId: input.restaurantId,
      name: input.name,
      price: Money.fromDecimal(input.price, input.currency),
    });

    await this.menuItems.save(item);
    return item;
  }
}
